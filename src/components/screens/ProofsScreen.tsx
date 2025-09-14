import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Download, Share, Eye, Calendar, MapPin, Award, Users, Zap } from "lucide-react";
import proofsImage from "@/assets/proofs-icon.jpg";

export default function ProofsScreen() {
  const proofs = [
    {
      id: "1",
      title: "Event Attendance Proof",
      eventName: "ETH Denver 2025",
      location: "Denver, CO",
      date: "Feb 28, 2025",
      status: "Valid",
      proofHash: "zk_proof_0x1a2b...c3d4",
      type: "Attendance",
      description: "Zero-knowledge proof of event attendance without revealing identity",
      reward: "50 ZKP",
      icon: Calendar
    },
    {
      id: "2", 
      title: "Age Verification Proof",
      eventName: "Privacy Tech Meetup",
      location: "San Francisco, CA",
      date: "Dec 15, 2024",
      status: "Rewarded",
      proofHash: "zk_proof_0x5e6f...g7h8",
      type: "Identity",
      description: "Proof of age eligibility without revealing exact age or identity",
      reward: "100 ZKP",
      icon: Shield
    },
    {
      id: "3",
      title: "Membership Verification",
      eventName: "ZK Summit 11",
      location: "Athens, Greece",
      date: "Apr 10, 2025",
      status: "Submitted",
      proofHash: "zk_proof_0x9i0j...k1l2",
      type: "Membership",
      description: "Cryptographic proof of group membership maintaining anonymity",
      reward: "75 ZKP",
      icon: Users
    },
    {
      id: "4",
      title: "Achievement Unlock Proof",
      eventName: "Cryptography Workshop",
      location: "Online",
      date: "Jan 20, 2025",
      status: "Valid",
      proofHash: "zk_proof_0xm3n4...o5p6",
      type: "Achievement",
      description: "Proof of skill completion without revealing learning progress",
      reward: "25 ZKP",
      icon: Award
    },
    {
      id: "5",
      title: "Contribution Proof",
      eventName: "Open Source Conference",
      location: "Berlin, Germany", 
      date: "Mar 15, 2024",
      status: "Rewarded",
      proofHash: "zk_proof_0xq7r8...s9t0",
      type: "Contribution",
      description: "Anonymous proof of code contribution to privacy-preserving projects",
      reward: "200 ZKP",
      icon: Zap
    },
    {
      id: "6",
      title: "Reputation Score Proof",
      eventName: "DeFi Protocol Usage",
      location: "Blockchain Network",
      date: "Nov 05, 2024",
      status: "Submitted",
      proofHash: "zk_proof_0xu1v2...w3x4",
      type: "Reputation",
      description: "Zero-knowledge proof of transaction history and reputation score",
      reward: "150 ZKP",
      icon: Shield
    }
  ];

  const getStatusCounts = () => {
    const valid = proofs.filter(p => p.status === 'Valid').length;
    const submitted = proofs.filter(p => p.status === 'Submitted').length;  
    const rewarded = proofs.filter(p => p.status === 'Rewarded').length;
    return { valid, submitted, rewarded, total: proofs.length };
  };

  const { valid, submitted, rewarded, total } = getStatusCounts();

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
        <h1 className="text-2xl font-bold">My Proofs</h1>
        <p className="text-muted-foreground">Your zero-knowledge proofs and privacy credentials</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        <Card className="shadow-card bg-gradient-dark">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-success">{valid}</p>
            <p className="text-xs text-muted-foreground">Valid</p>
          </CardContent>
        </Card>
        <Card className="shadow-card bg-gradient-dark">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-warning">{submitted}</p>
            <p className="text-xs text-muted-foreground">Submitted</p>
          </CardContent>
        </Card>
        <Card className="shadow-card bg-gradient-dark">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-primary">{rewarded}</p>
            <p className="text-xs text-muted-foreground">Rewarded</p>
          </CardContent>
        </Card>
        <Card className="shadow-card bg-gradient-dark">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-foreground">{total}</p>
            <p className="text-xs text-muted-foreground">Total</p>
          </CardContent>
        </Card>
      </div>

      {/* Empty State or Proofs List */}
      {proofs.length === 0 ? (
        <Card className="shadow-card">
          <CardContent className="p-8 text-center space-y-4">
            <img 
              src={proofsImage} 
              alt="No proofs yet" 
              className="w-32 h-32 mx-auto rounded-xl opacity-60"
            />
            <div className="space-y-2">
              <h3 className="text-lg font-medium">No proofs yet</h3>
              <p className="text-muted-foreground">
                Join events and generate your first zero-knowledge proof
              </p>
            </div>
            <Button variant="gradient">
              Browse Events
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {proofs.map((proof) => {
            const IconComponent = proof.icon;
            return (
              <Card key={proof.id} className="shadow-card">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                          <IconComponent className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{proof.title}</CardTitle>
                          <p className="text-sm text-muted-foreground">{proof.eventName}</p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {proof.description}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-3 h-3" />
                          <span>{proof.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>{proof.date}</span>
                        </div>
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
                          +{proof.reward}
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-muted/30 p-3 rounded-lg">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Proof Hash:</span>
                      <code className="font-mono text-xs">{proof.proofHash}</code>
                    </div>
                    <div className="flex items-center justify-between text-sm mt-1">
                      <span className="text-muted-foreground">Type:</span>
                      <span className="text-xs">{proof.type}</span>
                    </div>
                    {proof.status !== 'Submitted' && (
                      <div className="flex items-center justify-between text-sm mt-1">
                        <span className="text-muted-foreground">Reward:</span>
                        <span className="text-xs font-medium text-primary">{proof.reward}</span>
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
          })}
        </div>
      )}
    </div>
  );
}