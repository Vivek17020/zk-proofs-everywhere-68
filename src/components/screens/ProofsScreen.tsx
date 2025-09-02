import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Download, Share, Eye, Calendar, MapPin } from "lucide-react";
import proofsImage from "@/assets/proofs-icon.jpg";

export default function ProofsScreen() {
  const proofs = [
    {
      id: "1",
      eventName: "DevCon 2024",
      location: "Bangkok, Thailand",
      date: "Nov 12, 2024",
      status: "verified",
      proofHash: "0x1234...abcd",
      type: "Attendance"
    },
    {
      id: "2", 
      eventName: "ETH Global Hackathon",
      location: "Online",
      date: "Oct 28, 2024",
      status: "verified",
      proofHash: "0x5678...efgh",
      type: "Participation"
    },
    {
      id: "3",
      eventName: "Privacy Summit",
      location: "San Francisco, CA",
      date: "Oct 15, 2024",
      status: "pending",
      proofHash: "0x9abc...ijkl",
      type: "Speaker"
    }
  ];

  return (
    <div className="p-6 pb-24 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">My Proofs</h1>
        <p className="text-muted-foreground">Your verified event participation records</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="shadow-card bg-gradient-dark">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-success">8</p>
            <p className="text-xs text-muted-foreground">Verified</p>
          </CardContent>
        </Card>
        <Card className="shadow-card bg-gradient-dark">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-warning">1</p>
            <p className="text-xs text-muted-foreground">Pending</p>
          </CardContent>
        </Card>
        <Card className="shadow-card bg-gradient-dark">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-primary">12</p>
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
          {proofs.map((proof) => (
            <Card key={proof.id} className="shadow-card">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <CardTitle className="text-lg">{proof.eventName}</CardTitle>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
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
                  <Badge 
                    variant={proof.status === 'verified' ? 'default' : 'secondary'}
                    className={proof.status === 'verified' 
                      ? 'bg-success hover:bg-success/80' 
                      : 'bg-warning hover:bg-warning/80'
                    }
                  >
                    {proof.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted/30 p-3 rounded-lg">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Proof Hash:</span>
                    <code className="font-mono">{proof.proofHash}</code>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-1">
                    <span className="text-muted-foreground">Type:</span>
                    <span>{proof.type}</span>
                  </div>
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
          ))}
        </div>
      )}
    </div>
  );
}