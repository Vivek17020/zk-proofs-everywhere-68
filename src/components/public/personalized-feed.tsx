import React, { useState } from 'react';
import { usePersonalizedFeed } from '@/hooks/use-personalized-feed';
import { ArticleCard } from '@/components/public/article-card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useArticles } from '@/hooks/use-articles';
import { useAuth } from '@/hooks/use-auth';
import { User, TrendingUp, Clock } from 'lucide-react';

export function PersonalizedFeed() {
  const { user } = useAuth();
  const [limit, setLimit] = useState(12);
  
  const { data: personalizedArticles, isLoading: personalizedLoading } = usePersonalizedFeed(limit);
  const { data: latestData, isLoading: latestLoading } = useArticles(undefined, 1, limit);
  const { data: trendingData, isLoading: trendingLoading } = useArticles(undefined, 1, limit);

  const latestArticles = latestData?.articles || [];
  const trendingArticles = trendingData?.articles?.sort((a, b) => {
    const aScore = (a.likes_count || 0) + (a.shares_count || 0) + (a.views_count || 0);
    const bScore = (b.likes_count || 0) + (b.shares_count || 0) + (b.views_count || 0);
    return bScore - aScore;
  }) || [];

  const loadMore = () => {
    setLimit(prev => prev + 12);
  };

  if (personalizedLoading && latestLoading && trendingLoading) {
    return <FeedSkeleton />;
  }

  return (
    <section className="py-8">
      <Tabs defaultValue={user ? "for-you" : "trending"} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          {user && (
            <TabsTrigger value="for-you" className="gap-2">
              <User className="h-4 w-4" />
              For You
            </TabsTrigger>
          )}
          <TabsTrigger value="trending" className="gap-2">
            <TrendingUp className="h-4 w-4" />
            Trending
          </TabsTrigger>
          <TabsTrigger value="latest" className="gap-2">
            <Clock className="h-4 w-4" />
            Latest
          </TabsTrigger>
        </TabsList>

        {user && (
          <TabsContent value="for-you" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Recommended for You</h2>
                <p className="text-muted-foreground">
                  Articles curated based on your reading preferences
                </p>
              </div>
            </div>
            
            {personalizedLoading ? (
              <FeedSkeleton />
            ) : personalizedArticles && personalizedArticles.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {personalizedArticles.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
                
                {personalizedArticles.length >= limit && (
                  <div className="text-center">
                    <Button onClick={loadMore} variant="outline">
                      Load More Articles
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  Start reading articles to get personalized recommendations!
                </p>
              </div>
            )}
          </TabsContent>
        )}

        <TabsContent value="trending" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Trending Articles</h2>
              <p className="text-muted-foreground">
                Most popular articles right now
              </p>
            </div>
          </div>
          
          {trendingLoading ? (
            <FeedSkeleton />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trendingArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="latest" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Latest Articles</h2>
              <p className="text-muted-foreground">
                Fresh content just published
              </p>
            </div>
          </div>
          
          {latestLoading ? (
            <FeedSkeleton />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </section>
  );
}

function FeedSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="space-y-4">
          <Skeleton className="aspect-[16/9] w-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-5/6" />
          </div>
        </div>
      ))}
    </div>
  );
}