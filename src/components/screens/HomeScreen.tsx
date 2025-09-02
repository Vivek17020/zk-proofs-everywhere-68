import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Calendar, TrendingUp, Plus } from "lucide-react";

export default function HomeScreen() {
  return (
    <div className="p-6 pb-24 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Welcome back!</h1>
        <p className="text-muted-foreground">Your privacy-first event verification dashboard</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="shadow-card bg-gradient-dark">
          <CardContent className="p-4 flex items-center space-x-3">
            <div className="p-2 bg-primary/20 rounded-lg">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">12</p>
              <p className="text-sm text-muted-foreground">Total Proofs</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card bg-gradient-dark">
          <CardContent className="p-4 flex items-center space-x-3">
            <div className="p-2 bg-success/20 rounded-lg">
              <Calendar className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">8</p>
              <p className="text-sm text-muted-foreground">Events Attended</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Recent Activity
            <TrendingUp className="w-5 h-5 text-muted-foreground" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
            <div className="w-2 h-2 bg-success rounded-full"></div>
            <div className="flex-1">
              <p className="font-medium">DevCon 2024</p>
              <p className="text-sm text-muted-foreground">Proof generated successfully</p>
            </div>
            <span className="text-xs text-muted-foreground">2h ago</span>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            <div className="flex-1">
              <p className="font-medium">ETH Global Hackathon</p>
              <p className="text-sm text-muted-foreground">Event joined</p>
            </div>
            <span className="text-xs text-muted-foreground">1d ago</span>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
            <div className="w-2 h-2 bg-warning rounded-full"></div>
            <div className="flex-1">
              <p className="font-medium">Privacy Summit</p>
              <p className="text-sm text-muted-foreground">Verification pending</p>
            </div>
            <span className="text-xs text-muted-foreground">3d ago</span>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button className="w-full" variant="gradient">
            <Plus className="w-4 h-4 mr-2" />
            Generate New Proof
          </Button>
          <Button variant="outline" className="w-full">
            <Calendar className="w-4 h-4 mr-2" />
            Browse Events
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}