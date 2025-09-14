import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Calendar, TrendingUp, Plus, Bluetooth, Wifi, User, MapPin, Zap } from "lucide-react";
import { useZKIdentity } from "@/hooks/useZKIdentity";
import { useToast } from "@/hooks/use-toast";

export default function HomeScreen() {
  const [isScanning, setIsScanning] = useState(false);
  const [connectingTo, setConnectingTo] = useState<string | null>(null);
  const [nearbyUsers, setNearbyUsers] = useState<Array<{
    id: string;
    username: string;
    distance: string;
    signal: 'strong' | 'medium' | 'weak';
    method: 'bluetooth' | 'wifi';
    connected: boolean;
    ephemeralId?: string;
  }>>([]);
  
  const { generateEventCredential, isGeneratingProof } = useZKIdentity();
  const { toast } = useToast();

  const mockNearbyUsers = [
    { id: "0x1a2b3c", username: "alice_zk", distance: "2m", signal: "strong" as const, method: "bluetooth" as const, connected: false },
    { id: "0x4d5e6f", username: "bob_crypto", distance: "5m", signal: "medium" as const, method: "wifi" as const, connected: false },
    { id: "0x7g8h9i", username: "charlie_dev", distance: "8m", signal: "medium" as const, method: "bluetooth" as const, connected: false },
    { id: "0xj1k2l3", username: "diana_zkp", distance: "12m", signal: "weak" as const, method: "wifi" as const, connected: false },
    { id: "0xm4n5o6", username: "eve_privacy", distance: "15m", signal: "weak" as const, method: "bluetooth" as const, connected: false },
  ];

  const handleDetectNearby = () => {
    setIsScanning(true);
    setNearbyUsers([]);
    
    // Simulate scanning delay and gradual discovery
    setTimeout(() => {
      setNearbyUsers(mockNearbyUsers.slice(0, 2));
    }, 800);
    
    setTimeout(() => {
      setNearbyUsers(mockNearbyUsers.slice(0, 4));
    }, 1500);
    
    setTimeout(() => {
      setNearbyUsers(mockNearbyUsers);
      setIsScanning(false);
    }, 2200);
  };

  const generateEphemeralId = () => {
    const bytes = new Uint8Array(8);
    crypto.getRandomValues(bytes);
    return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
  };

  const handleConnect = async (userId: string, username: string) => {
    if (connectingTo || isGeneratingProof) return;

    setConnectingTo(userId);
    
    try {
      // Simulate ephemeral ID exchange
      toast({
        title: "Initiating Connection",
        description: `Exchanging ephemeral IDs with ${username}...`,
      });

      // Simulate BLE handshake delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const ephemeralId = generateEphemeralId();
      
      // Update user as connected with ephemeral ID
      setNearbyUsers(prev => 
        prev.map(user => 
          user.id === userId 
            ? { ...user, connected: true, ephemeralId }
            : user
        )
      );

      toast({
        title: "Connection Established! 🔗",
        description: `Ephemeral ID: ${ephemeralId}`,
      });

      // Generate ZK proof of co-presence
      await generateEventCredential(
        `copresence-${userId}-${Date.now()}`,
        `Co-presence with ${username}`,
        {
          location: "BLE Range",
          duration: 1,
          attendeeCount: 2
        }
      );

    } catch (error) {
      toast({
        variant: "destructive",
        title: "Connection Failed",
        description: "Failed to establish connection. Please try again.",
      });
    } finally {
      setConnectingTo(null);
    }
  };

  const getSignalColor = (signal: 'strong' | 'medium' | 'weak') => {
    switch (signal) {
      case 'strong': return 'text-success';
      case 'medium': return 'text-warning';
      case 'weak': return 'text-muted-foreground';
    }
  };
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
          <Button 
            onClick={handleDetectNearby}
            disabled={isScanning}
            variant="secondary" 
            className="w-full"
          >
            {isScanning ? (
              <>
                <div className="w-4 h-4 mr-2 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                Scanning...
              </>
            ) : (
              <>
                <Bluetooth className="w-4 h-4 mr-2" />
                Detect Nearby
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Nearby Users */}
      {(nearbyUsers.length > 0 || isScanning) && (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Nearby Users
              {isScanning && (
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {nearbyUsers.length === 0 && isScanning && (
              <div className="text-center py-8 text-muted-foreground">
                <Bluetooth className="w-8 h-8 mx-auto mb-2 animate-pulse" />
                <p>Scanning for nearby users...</p>
              </div>
            )}
            
            {nearbyUsers.map((user) => (
              <div 
                key={user.id}
                className="flex items-center justify-between p-3 bg-muted/30 rounded-lg animate-fade-in"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1">
                    {user.method === 'bluetooth' ? (
                      <Bluetooth className={`w-4 h-4 ${getSignalColor(user.signal)}`} />
                    ) : (
                      <Wifi className={`w-4 h-4 ${getSignalColor(user.signal)}`} />
                    )}
                    <User className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">{user.username}</p>
                    <p className="text-sm text-muted-foreground">ID: {user.id}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs">
                    {user.distance}
                  </Badge>
                  {user.connected ? (
                    <div className="flex items-center space-x-2">
                      <Badge variant="default" className="text-xs bg-success/20 text-success">
                        <Zap className="w-3 h-3 mr-1" />
                        Connected
                      </Badge>
                      {user.ephemeralId && (
                        <Badge variant="outline" className="text-xs font-mono">
                          {user.ephemeralId.slice(0, 6)}...
                        </Badge>
                      )}
                    </div>
                  ) : (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleConnect(user.id, user.username)}
                      disabled={connectingTo === user.id || isGeneratingProof}
                    >
                      {connectingTo === user.id ? (
                        <>
                          <div className="w-3 h-3 mr-1 border border-primary border-t-transparent rounded-full animate-spin" />
                          Connecting
                        </>
                      ) : (
                        "Connect"
                      )}
                    </Button>
                  )}
                </div>
              </div>
            ))}
            
            {nearbyUsers.length > 0 && !isScanning && (
              <div className="text-center pt-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setNearbyUsers([])}
                  className="text-muted-foreground"
                >
                  Clear Results
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}