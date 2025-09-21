import { Shield, Bell, Clock, Check, X, AlertTriangle, User } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { useState } from "react";

interface Request {
  id: string;
  clientName: string;
  requestType: "unblock" | "modify_goal" | "emergency";
  website?: string;
  reason: string;
  timestamp: Date;
  urgency: "low" | "medium" | "high";
}

export function GuardianDashboard() {
  const [requests, setRequests] = useState<Request[]>([
    {
      id: "1",
      clientName: "Alex M.",
      requestType: "unblock",
      website: "news.example.com",
      reason: "Need to access news for work presentation tomorrow",
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      urgency: "medium",
    },
    {
      id: "2",
      clientName: "Alex M.",
      requestType: "emergency",
      reason: "Feeling strong urges, need to talk",
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      urgency: "high",
    },
    {
      id: "3",
      clientName: "Jordan K.",
      requestType: "modify_goal",
      reason: "Want to extend recovery goal from 90 to 180 days",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      urgency: "low",
    },
  ]);

  const handleApprove = (requestId: string) => {
    setRequests(prev => prev.filter(r => r.id !== requestId));
    // Mock approval action
    console.log(`Approved request ${requestId}`);
  };

  const handleDeny = (requestId: string) => {
    setRequests(prev => prev.filter(r => r.id !== requestId));
    // Mock denial action
    console.log(`Denied request ${requestId}`);
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high": return "destructive";
      case "medium": return "default";
      case "low": return "secondary";
      default: return "secondary";
    }
  };

  const getRequestIcon = (type: string) => {
    switch (type) {
      case "unblock": return Shield;
      case "emergency": return AlertTriangle;
      case "modify_goal": return User;
      default: return Bell;
    }
  };

  const activeClients = ["Alex M.", "Jordan K.", "Sam R."];

  return (
    <div className="w-full max-w-[310px] space-y-3">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full mx-auto">
          <Shield className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-lg font-semibold">Guardian Dashboard</h2>
        <p className="text-xs text-muted-foreground">
          Monitor and approve client requests
        </p>
      </div>

      <Card className="p-3">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium text-sm">Active Clients</h3>
          <Badge variant="secondary" className="text-xs">{activeClients.length}</Badge>
        </div>
        <div className="space-y-1">
          {activeClients.map((client, index) => (
            <div key={index} className="flex items-center gap-2 p-1 bg-secondary/50 rounded-lg">
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                <User className="w-3 h-3 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium">{client}</p>
                <p className="text-xs text-muted-foreground">Active recovery</p>
              </div>
              <div className="w-1 h-1 bg-primary rounded-full"></div>
            </div>
          ))}
        </div>
      </Card>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-sm">Pending Requests</h3>
          <Badge variant="destructive" className="flex items-center gap-1 text-xs">
            <Bell className="w-2 h-2" />
            {requests.length}
          </Badge>
        </div>

        {requests.length === 0 ? (
          <Card className="p-3 text-center">
            <Check className="w-6 h-6 text-primary mx-auto mb-1" />
            <p className="text-xs text-muted-foreground">No pending requests</p>
          </Card>
        ) : (
          <div className="space-y-2">
            {requests.map((request) => {
              const RequestIcon = getRequestIcon(request.requestType);
              return (
                <Card key={request.id} className="p-2">
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <div className="flex items-center justify-center w-6 h-6 bg-secondary rounded-lg">
                        <RequestIcon className="w-3 h-3" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-1 mb-1">
                          <p className="font-medium text-xs">{request.clientName}</p>
                          <Badge variant={getUrgencyColor(request.urgency)} className="text-xs h-3 px-1">
                            {request.urgency}
                          </Badge>
                        </div>
                        {request.website && (
                          <p className="text-xs text-primary mb-1">{request.website}</p>
                        )}
                        <p className="text-xs text-muted-foreground">{request.reason}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-2 h-2" />
                      {request.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>

                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeny(request.id)}
                        className="flex-1 h-6 text-xs"
                      >
                        <X className="w-2 h-2 mr-1" />
                        Deny
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleApprove(request.id)}
                        className="flex-1 h-6 text-xs"
                      >
                        <Check className="w-2 h-2 mr-1" />
                        Approve
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <Card className="p-2 bg-muted/50">
        <div className="flex items-start gap-2">
          <Shield className="w-4 h-4 text-primary mt-0.5" />
          <div>
            <p className="text-xs font-medium">Guardian Responsibilities</p>
            <p className="text-xs text-muted-foreground">
              Review requests carefully. Emergency needs immediate attention.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}