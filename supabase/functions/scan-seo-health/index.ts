import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SeoIssue {
  url: string;
  issue_type: string;
  severity: 'critical' | 'warning' | 'info';
  notes: string;
  article_id?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    console.log('Starting SEO health scan...');

    // Fetch all published articles
    const { data: articles, error: articlesError } = await supabaseClient
      .from("articles")
      .select("id, slug, title, content, canonical_url, meta_title, meta_description, seo_keywords, published_at")
      .eq("published", true);

    if (articlesError) throw articlesError;

    const issues: SeoIssue[] = [];
    const baseUrl = "https://www.thebulletinbriefs.in";

    // Scan each article for SEO issues
    for (const article of articles || []) {
      const articleUrl = `${baseUrl}/article/${article.slug}`;
      
      // Check 1: Missing canonical URL
      if (!article.canonical_url) {
        issues.push({
          url: articleUrl,
          issue_type: 'missing_canonical',
          severity: 'critical',
          notes: `Article "${article.title}" is missing canonical URL`,
          article_id: article.id
        });
        
        // Auto-fix: Set canonical URL
        await supabaseClient
          .from('articles')
          .update({ canonical_url: articleUrl })
          .eq('id', article.id);
        
        console.log(`Auto-fixed: Added canonical URL for ${article.slug}`);
      }

      // Check 2: Canonical URL mismatch
      if (article.canonical_url && article.canonical_url !== articleUrl) {
        issues.push({
          url: articleUrl,
          issue_type: 'canonical_mismatch',
          severity: 'warning',
          notes: `Canonical URL (${article.canonical_url}) doesn't match actual URL (${articleUrl})`,
          article_id: article.id
        });
      }

      // Check 3: Missing meta title
      if (!article.meta_title) {
        issues.push({
          url: articleUrl,
          issue_type: 'missing_meta_title',
          severity: 'critical',
          notes: `Article "${article.title}" is missing meta title`,
          article_id: article.id
        });
        
        // Auto-fix: Use article title as meta title (max 60 chars)
        const metaTitle = article.title.length > 60 
          ? article.title.substring(0, 57) + '...'
          : article.title;
        
        await supabaseClient
          .from('articles')
          .update({ meta_title: metaTitle })
          .eq('id', article.id);
        
        console.log(`Auto-fixed: Added meta title for ${article.slug}`);
      }

      // Check 4: Meta title too long
      if (article.meta_title && article.meta_title.length > 60) {
        issues.push({
          url: articleUrl,
          issue_type: 'meta_title_too_long',
          severity: 'warning',
          notes: `Meta title is ${article.meta_title.length} characters (should be ≤60)`,
          article_id: article.id
        });
      }

      // Check 5: Missing meta description
      if (!article.meta_description) {
        issues.push({
          url: articleUrl,
          issue_type: 'missing_meta_description',
          severity: 'critical',
          notes: `Article "${article.title}" is missing meta description`,
          article_id: article.id
        });
        
        // Auto-fix: Generate from content
        const plainText = article.content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
        const metaDesc = plainText.length > 160 
          ? plainText.substring(0, 157) + '...'
          : plainText;
        
        await supabaseClient
          .from('articles')
          .update({ meta_description: metaDesc })
          .eq('id', article.id);
        
        console.log(`Auto-fixed: Added meta description for ${article.slug}`);
      }

      // Check 6: Meta description too long
      if (article.meta_description && article.meta_description.length > 160) {
        issues.push({
          url: articleUrl,
          issue_type: 'meta_description_too_long',
          severity: 'warning',
          notes: `Meta description is ${article.meta_description.length} characters (should be ≤160)`,
          article_id: article.id
        });
      }

      // Check 7: Missing SEO keywords
      if (!article.seo_keywords || article.seo_keywords.length === 0) {
        issues.push({
          url: articleUrl,
          issue_type: 'missing_seo_keywords',
          severity: 'warning',
          notes: `Article "${article.title}" has no SEO keywords`,
          article_id: article.id
        });
      }

      // Check 8: Content too short (soft 404 indicator)
      const contentLength = article.content.replace(/<[^>]*>/g, '').length;
      if (contentLength < 500) {
        issues.push({
          url: articleUrl,
          issue_type: 'short_content',
          severity: 'critical',
          notes: `Content is only ${contentLength} characters (minimum 500 recommended)`,
          article_id: article.id
        });
      }

      // Check 9: Article published more than 7 days ago without updates
      const daysSincePublish = Math.floor(
        (Date.now() - new Date(article.published_at).getTime()) / (1000 * 60 * 60 * 24)
      );
      if (daysSincePublish > 7) {
        issues.push({
          url: articleUrl,
          issue_type: 'stale_content',
          severity: 'info',
          notes: `Article published ${daysSincePublish} days ago, consider updating`,
          article_id: article.id
        });
      }
    }

    // Log all issues to database
    for (const issue of issues) {
      const { error: logError } = await supabaseClient
        .from('seo_health_log')
        .insert({
          url: issue.url,
          issue_type: issue.issue_type,
          severity: issue.severity,
          notes: issue.notes,
          article_id: issue.article_id,
          status: 'open',
          auto_fix_attempted: ['missing_canonical', 'missing_meta_title', 'missing_meta_description'].includes(issue.issue_type)
        });

      if (logError) {
        console.error('Failed to log issue:', logError);
      }
    }

    console.log(`SEO scan complete. Found ${issues.length} issues.`);

    return new Response(JSON.stringify({
      success: true,
      total_issues: issues.length,
      critical: issues.filter(i => i.severity === 'critical').length,
      warnings: issues.filter(i => i.severity === 'warning').length,
      info: issues.filter(i => i.severity === 'info').length,
      auto_fixed: issues.filter(i => ['missing_canonical', 'missing_meta_title', 'missing_meta_description'].includes(i.issue_type)).length
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('SEO scan error:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to complete SEO scan',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});