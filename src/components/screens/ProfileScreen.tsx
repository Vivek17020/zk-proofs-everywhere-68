import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getStoredWallet } from "@/lib/wallet";
import { toast } from "sonner";
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
  TrendingUp,
  Copy,
  Wallet
} from "lucide-react";

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const [wallet, setWallet] = useState(getStoredWallet());

  useEffect(() => {
    setWallet(getStoredWallet());
  }, [user]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast.error("Failed to sign out");
    } else {
      toast.success("Signed out successfully");
    }
  };
  return (
    <div className="p-6 pb-24 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto">
          <User className="w-10 h-10 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">
            {user?.user_metadata?.display_name || 'Anonymous User'}
          </h1>
          <p className="text-muted-foreground">
            {user?.user_metadata?.is_anonymous ? 'Anonymous Account' : 'Registered Account'}
          </p>
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

      {/* Account Information */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Account Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="text-sm font-medium">Display Name</div>
            <div className="text-muted-foreground">
              {user?.user_metadata?.display_name || 'Anonymous User'}
            </div>
          </div>
          {user?.email && !user?.email?.includes('@zkpresence.temp') && (
            <div className="space-y-2">
              <div className="text-sm font-medium">Email</div>
              <div className="text-muted-foreground">{user.email}</div>
            </div>
          )}
          <div className="space-y-2">
            <div className="text-sm font-medium">Account Type</div>
            <Badge variant={user?.user_metadata?.is_anonymous ? "secondary" : "default"}>
              {user?.user_metadata?.is_anonymous ? 'Anonymous' : 'Registered'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Wallet Information */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            Anonymous Wallet
          </CardTitle>
          <CardDescription>Your secure, locally-generated wallet</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {wallet ? (
            <>
              <div className="space-y-2">
                <div className="text-sm font-medium">Wallet Address</div>
                <div className="flex items-center gap-2">
                  <code className="text-xs bg-muted p-2 rounded flex-1 break-all">
                    {wallet.address}
                  </code>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => copyToClipboard(wallet.address, 'Wallet address')}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium">Recovery Phrase</div>
                <div className="flex items-center gap-2">
                  <code className="text-xs bg-muted p-2 rounded flex-1">
                    {wallet.mnemonic}
                  </code>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => copyToClipboard(wallet.mnemonic, 'Recovery phrase')}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  ⚠️ Keep this safe! It's the only way to recover your wallet.
                </p>
              </div>
            </>
          ) : (
            <div className="text-muted-foreground">No wallet found</div>
          )}
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
          
          <Button 
            variant="outline" 
            className="w-full justify-start text-destructive hover:text-destructive"
            onClick={handleSignOut}
          >
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