import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Download, Share, Eye, CheckCircle, Clock, Gift, TrendingUp } from "lucide-react";
import { useZKIdentity } from "@/hooks/useZKIdentity";

export default function ProofsScreen() {
  const { credentials, verifyCredential, exportCredentials, getStats } = useZKIdentity();
  const stats = getStats();

  // Mock stats based on actual credentials or fallback to demo data
  const displayStats = credentials.length > 0 ? {
    totalProofs: stats.totalProofs,
    validProofs: stats.validProofs,
    eventsAttended: stats.events,
    totalRewards: stats.totalProofs * 50 // Mock reward calculation
  } : {
    totalProofs: 6,
    validProofs: 5,
    eventsAttended: 4,
    totalRewards: 300
  };

  // Use actual credentials if available, otherwise show demo data
  const displayProofs = credentials.length > 0 ? credentials.map(cred => ({
    id: cred.id,
    type: "Event Attendance",
    event: cred.eventName,
    status: "Valid" as const,
    date: new Date(cred.timestamp).toLocaleDateString(),
    reward: 50,
    icon: CheckCircle,
    description: `Zero-knowledge proof of attendance at ${cred.eventName}`,
    proof: cred.proof,
    location: cred.metadata.location || "Unknown"
  })) : [
    {
      id: "1",
      type: "Event Attendance",
      event: "ETH Global London",
      status: "Valid" as const,
      date: "2024-03-15",
      reward: 50,
      icon: CheckCircle,
      description: "Zero-knowledge proof of attendance at ETH Global London hackathon",
      proof: "0x1a2b3c4d...",
      location: "London, UK"
    },
    {
      id: "2", 
      type: "Workshop Completion",
      event: "ZK Circuit Design Workshop",
      status: "Submitted" as const,
      date: "2024-03-10",
      reward: 75,
      icon: Clock,
      description: "Completed advanced zero-knowledge circuit design workshop",
      proof: "0x5e6f7g8h...",
      location: "Virtual"
    },
    {
      id: "3",
      type: "Conference Attendance", 
      event: "Devcon 7",
      status: "Valid" as const,
      date: "2024-03-08",
      reward: 100,
      icon: CheckCircle,
      description: "Verified attendance at Ethereum Developer Conference",
      proof: "0x9i0j1k2l...",
      location: "Bangkok, Thailand"
    },
    {
      id: "4",
      type: "Meetup Participation",
      event: "Local Crypto Meetup",
      status: "Rewarded" as const, 
      date: "2024-03-05",
      reward: 25,
      icon: Gift,
      description: "Active participation in monthly cryptocurrency meetup",
      proof: "0xm3n4o5p6...",
      location: "San Francisco, CA"
    },
    {
      id: "5",
      type: "Hackathon Submission",
      event: "DeFi Building Blocks",
      status: "Valid" as const,
      date: "2024-03-01", 
      reward: 150,
      icon: CheckCircle,
      description: "Submitted working DeFi protocol during 48-hour hackathon",
      proof: "0xq7r8s9t0...",
      location: "New York, NY"
    },
    {
      id: "6",
      type: "Training Completion",
      event: "Smart Contract Security",
      status: "Submitted" as const,
      date: "2024-02-28",
      reward: 50,
      icon: Clock,
      description: "Completed comprehensive smart contract security training program", 
      proof: "0xu1v2w3x4...",
      location: "Online"
    }
  ];

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Valid':
        return 'bg-success hover:bg-success/80 text-success-foreground';
      case 'Submitted':  
        return 'bg-warning hover:bg-warning/80 text-warning-foreground';
      case 'Rewarded':
        return 'bg-primary hover:bg-primary/80 text-primary-foreground';
      default:
        return 'bg-muted hover:bg-muted/80';
    }
  };

  return (
    <div className="p-6 pb-24 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Festival Tickets</h1>
        <p className="text-muted-foreground">Your zero-knowledge event credentials</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card className="bg-gradient-primary/10 border-primary/20">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{displayStats.totalProofs}</div>
            <div className="text-sm text-muted-foreground">Total Proofs</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-secondary/10 border-secondary/20">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-secondary">{displayStats.eventsAttended}</div>
            <div className="text-sm text-muted-foreground">Events</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-accent/10 border-accent/20">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-accent">{displayStats.validProofs}</div>
            <div className="text-sm text-muted-foreground">Valid</div>
          </CardContent>
        </Card>
        <Card className="bg-festival-orange/10 border-festival-orange/20">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-festival-orange">{displayStats.totalRewards}</div>
            <div className="text-sm text-muted-foreground">Rewards</div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mb-6">
        <Button 
          onClick={exportCredentials}
          variant="outline" 
          className="flex-1 border-primary/30 hover:bg-primary/10"
        >
          <Download className="w-4 h-4 mr-2" />
          Export All
        </Button>
        {credentials.length > 0 && (
          <Button 
            onClick={() => verifyCredential(credentials[0])}
            className="flex-1 bg-gradient-accent hover:bg-gradient-secondary"
          >
            <Shield className="w-4 h-4 mr-2" />
            Verify Latest
          </Button>
        )}
      </div>

      {/* Proofs List */}
      <div className="space-y-4">
        {displayProofs.length === 0 ? (
          <Card className="shadow-card">
            <CardContent className="p-8 text-center space-y-4">
              <div className="w-32 h-32 mx-auto bg-gradient-primary/20 rounded-xl flex items-center justify-center">
                <Shield className="w-16 h-16 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-medium">No proofs yet</h3>
                <p className="text-muted-foreground">
                  Join events and generate your first zero-knowledge proof
                </p>
              </div>
              <Button className="bg-gradient-primary">
                Browse Events
              </Button>
            </CardContent>
          </Card>
        ) : (
          displayProofs.map((proof) => {
            const IconComponent = proof.icon;
            return (
              <Card key={proof.id} className="shadow-card glow-stage">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-primary/20 rounded-full flex items-center justify-center">
                          <IconComponent className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{proof.type}</CardTitle>
                          <p className="text-sm text-muted-foreground">{proof.event}</p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {proof.description}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <span>{proof.location}</span>
                        <span>{proof.date}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge 
                        variant="secondary"
                        className={getStatusBadgeClass(proof.status)}
                      >
                        {proof.status}
                      </Badge>
                      {proof.status === 'Rewarded' && (
                        <div className="text-xs text-primary font-medium">
                          +{proof.reward} ZKP
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-muted/30 p-3 rounded-lg">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Proof Hash:</span>
                      <code className="font-mono text-xs">{proof.proof.slice(0, 12)}...</code>
                    </div>
                    <div className="flex items-center justify-between text-sm mt-1">
                      <span className="text-muted-foreground">Type:</span>
                      <span className="text-xs">{proof.type}</span>
                    </div>
                    {proof.status !== 'Submitted' && (
                      <div className="flex items-center justify-between text-sm mt-1">
                        <span className="text-muted-foreground">Reward:</span>
                        <span className="text-xs font-medium text-primary">{proof.reward} ZKP</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Share className="w-4 h-4 mr-1" />
                      Share
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Download className="w-4 h-4 mr-1" />
                      Export
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}