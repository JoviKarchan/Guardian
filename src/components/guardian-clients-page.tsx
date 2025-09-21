import { Users, Calendar, Trophy, Shield, MoreVertical } from "lucide-react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";

interface Client {
  id: string;
  name: string;
  streak: number;
  goal: number;
  startDate: Date;
  status: "active" | "struggling" | "at_risk";
  lastActivity: Date;
  blockedSites: number;
}

export function GuardianClientsPage() {
  const clients: Client[] = [
    {
      id: "1",
      name: "Alex M.",
      streak: 47,
      goal: 90,
      startDate: new Date(Date.now() - 47 * 24 * 60 * 60 * 1000),
      status: "active",
      lastActivity: new Date(Date.now() - 30 * 60 * 1000),
      blockedSites: 15,
    },
    {
      id: "2",
      name: "Jordan K.",
      streak: 23,
      goal: 60,
      startDate: new Date(Date.now() - 23 * 24 * 60 * 60 * 1000),
      status: "struggling",
      lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000),
      blockedSites: 8,
    },
    {
      id: "3",
      name: "Sam R.",
      streak: 156,
      goal: 365,
      startDate: new Date(Date.now() - 156 * 24 * 60 * 60 * 1000),
      status: "active",
      lastActivity: new Date(Date.now() - 24 * 60 * 60 * 1000),
      blockedSites: 22,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "default";
      case "struggling": return "secondary";
      case "at_risk": return "destructive";
      default: return "secondary";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active": return "Active";
      case "struggling": return "Needs Support";
      case "at_risk": return "At Risk";
      default: return "Unknown";
    }
  };

  return (
    <div className="w-full max-w-[310px] space-y-3">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full mx-auto">
          <Users className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-lg font-semibold">My Clients</h2>
        <p className="text-xs text-muted-foreground">
          Monitor recovery progress and provide support
        </p>
      </div>

      <div className="space-y-2">
        {clients.map((client) => (
          <Card key={client.id} className="p-2">
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-primary-foreground font-medium text-xs">
                      {client.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-medium text-xs">{client.name}</h3>
                    <Badge variant={getStatusColor(client.status)} className="text-xs h-3 px-1">
                      {getStatusLabel(client.status)}
                    </Badge>
                  </div>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-5 w-5 p-0">
                      <MoreVertical className="w-3 h-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="text-xs">View Details</DropdownMenuItem>
                    <DropdownMenuItem className="text-xs">Send Message</DropdownMenuItem>
                    <DropdownMenuItem className="text-xs">Review History</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="grid grid-cols-3 gap-1 text-center">
                <div>
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Trophy className="w-2 h-2 text-primary" />
                    <span className="text-xs font-medium">{client.streak}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Days</p>
                </div>
                
                <div>
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Calendar className="w-2 h-2 text-primary" />
                    <span className="text-xs font-medium">{client.goal}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Goal</p>
                </div>
                
                <div>
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Shield className="w-2 h-2 text-primary" />
                    <span className="text-xs font-medium">{client.blockedSites}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Blocked</p>
                </div>
              </div>

              <div className="w-full bg-secondary rounded-full h-1">
                <div 
                  className="bg-primary h-1 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min((client.streak / client.goal) * 100, 100)}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{Math.round((client.streak / client.goal) * 100)}%</span>
                <span>{client.lastActivity.toLocaleDateString()}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-2 bg-muted/50">
        <div className="text-center">
          <p className="text-xs font-medium mb-1">Supporting {clients.length} people in recovery</p>
          <p className="text-xs text-muted-foreground">
            Your guidance makes a difference
          </p>
        </div>
      </Card>
    </div>
  );
}