import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { AlertCircle, CheckCircle2, AlertTriangle, Info, RefreshCw, Mail } from "lucide-react";
import { format } from "date-fns";

interface SeoIssue {
  id: string;
  url: string;
  issue_type: string;
  status: string;
  severity: string;
  detected_at: string;
  resolution_status: string;
  notes: string;
  auto_fix_attempted: boolean;
}

export function SeoHealthDashboard() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const queryClient = useQueryClient();

  // Fetch SEO issues
  const { data: issues, isLoading } = useQuery({
    queryKey: ["seo-health-log", statusFilter, severityFilter],
    queryFn: async () => {
      let query = supabase
        .from("seo_health_log")
        .select("*")
        .order("detected_at", { ascending: false });

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }
      if (severityFilter !== "all") {
        query = query.eq("severity", severityFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as SeoIssue[];
    },
  });

  // Calculate statistics
  const stats = {
    total: issues?.length || 0,
    critical: issues?.filter(i => i.severity === "critical").length || 0,
    warning: issues?.filter(i => i.severity === "warning").length || 0,
    open: issues?.filter(i => i.status === "open").length || 0,
    resolved: issues?.filter(i => i.status === "resolved").length || 0,
  };

  // Run SEO scan
  const scanMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke('scan-seo-health');
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      toast.success(`SEO scan complete! Found ${data.total_issues} issues (${data.auto_fixed} auto-fixed)`);
      queryClient.invalidateQueries({ queryKey: ["seo-health-log"] });
    },
    onError: (error) => {
      toast.error("Failed to run SEO scan");
      console.error(error);
    },
  });

  // Send weekly report
  const reportMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke('send-seo-report');
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("SEO report sent successfully!");
    },
    onError: (error) => {
      toast.error("Failed to send report");
      console.error(error);
    },
  });

  // Mark issue as resolved
  const resolveMutation = useMutation({
    mutationFn: async (issueId: string) => {
      const { error } = await supabase
        .from("seo_health_log")
        .update({ status: "resolved", resolution_status: "manual" })
        .eq("id", issueId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Issue marked as resolved");
      queryClient.invalidateQueries({ queryKey: ["seo-health-log"] });
    },
    onError: () => {
      toast.error("Failed to update issue");
    },
  });

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      default:
        return <Info className="h-4 w-4 text-info" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "destructive";
      case "warning":
        return "warning";
      default:
        return "secondary";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">SEO Health Monitor</h2>
          <p className="text-muted-foreground">
            Automated SEO scanning and issue tracking
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => reportMutation.mutate()}
            disabled={reportMutation.isPending}
            variant="outline"
          >
            <Mail className="mr-2 h-4 w-4" />
            Send Report
          </Button>
          <Button
            onClick={() => scanMutation.mutate()}
            disabled={scanMutation.isPending}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${scanMutation.isPending ? 'animate-spin' : ''}`} />
            Run Scan
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Issues</CardTitle>
            <Info className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{stats.critical}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Warnings</CardTitle>
            <AlertTriangle className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{stats.warning}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.open}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{stats.resolved}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Issues</CardTitle>
          <CardDescription>Filter and manage SEO issues</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>

            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severity</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="info">Info</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Issues Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Severity</TableHead>
                  <TableHead>Issue Type</TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead>Detected</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : issues?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      No issues found
                    </TableCell>
                  </TableRow>
                ) : (
                  issues?.map((issue) => (
                    <TableRow key={issue.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getSeverityIcon(issue.severity)}
                          <Badge variant={getSeverityColor(issue.severity) as any}>
                            {issue.severity}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {issue.issue_type.replace(/_/g, " ")}
                      </TableCell>
                      <TableCell>
                        <a
                          href={issue.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline text-sm truncate block max-w-xs"
                        >
                          {issue.url}
                        </a>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {format(new Date(issue.detected_at), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>
                        <Badge variant={issue.status === "resolved" ? "default" : "secondary"}>
                          {issue.status}
                          {issue.auto_fix_attempted && " (auto-fixed)"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {issue.status === "open" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => resolveMutation.mutate(issue.id)}
                            disabled={resolveMutation.isPending}
                          >
                            <CheckCircle2 className="h-4 w-4 mr-1" />
                            Resolve
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}