import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  User, 
  Shield, 
  Settings, 
  Bell, 
  Lock, 
  Download, 
  LogOut,
  Award,
  Calendar,
  TrendingUp
} from "lucide-react";

export default function ProfileScreen() {
  return (
    <div className="p-6 pb-24 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto">
          <User className="w-10 h-10 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Anonymous User</h1>
          <p className="text-muted-foreground">Privacy-first identity</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="shadow-card bg-gradient-dark">
          <CardContent className="p-4 text-center">
            <Shield className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-xl font-bold">12</p>
            <p className="text-xs text-muted-foreground">Total Proofs</p>
          </CardContent>
        </Card>
        <Card className="shadow-card bg-gradient-dark">
          <CardContent className="p-4 text-center">
            <Calendar className="w-6 h-6 text-success mx-auto mb-2" />
            <p className="text-xl font-bold">8</p>
            <p className="text-xs text-muted-foreground">Events</p>
          </CardContent>
        </Card>
        <Card className="shadow-card bg-gradient-dark">
          <CardContent className="p-4 text-center">
            <Award className="w-6 h-6 text-warning mx-auto mb-2" />
            <p className="text-xl font-bold">3</p>
            <p className="text-xs text-muted-foreground">Badges</p>
          </CardContent>
        </Card>
      </div>

      {/* Privacy Level */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Privacy Level
            <Badge className="bg-success hover:bg-success/80">Maximum</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Lock className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium">Zero-Knowledge Mode</p>
                <p className="text-sm text-muted-foreground">Full privacy protection</p>
              </div>
            </div>
            <Switch checked={true} />
          </div>
          
          <div className="bg-primary/10 p-3 rounded-lg">
            <p className="text-sm text-primary">
              Your identity remains completely private. Only cryptographic proofs are shared.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Settings */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Push Notifications</p>
                <p className="text-sm text-muted-foreground">Event updates and proofs</p>
              </div>
            </div>
            <Switch checked={true} />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <TrendingUp className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Analytics</p>
                <p className="text-sm text-muted-foreground">Anonymous usage data</p>
              </div>
            </div>
            <Switch checked={false} />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <Card className="shadow-card">
        <CardContent className="p-4 space-y-3">
          <Button variant="outline" className="w-full justify-start">
            <Download className="w-4 h-4 mr-3" />
            Export Data
          </Button>
          
          <Button variant="outline" className="w-full justify-start">
            <Shield className="w-4 h-4 mr-3" />
            Security Settings
          </Button>
          
          <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive">
            <LogOut className="w-4 h-4 mr-3" />
            Sign Out
          </Button>
        </CardContent>
      </Card>

      {/* App Info */}
      <div className="text-center text-sm text-muted-foreground">
        <p>ZKPresence v1.0.0</p>
        <p>Built with zero-knowledge proofs</p>
      </div>
    </div>
  );
}