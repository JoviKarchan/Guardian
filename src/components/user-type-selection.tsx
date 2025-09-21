import { Shield, Heart, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

interface UserTypeSelectionProps {
  onUserTypeSelect: (userType: "guardian" | "client") => void;
}

export function UserTypeSelection({ onUserTypeSelect }: UserTypeSelectionProps) {
  return (
    <div className="w-full max-w-xs space-y-4">
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-full mx-auto">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold">G</span>
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-1">Welcome to Guardian</h2>
          <p className="text-sm text-muted-foreground">
            Choose your role to get started
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <Card className="p-4 border-2 border-transparent hover:border-primary/20 transition-colors cursor-pointer group" 
              onClick={() => onUserTypeSelect("client")}>
          <div className="flex items-start gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-full group-hover:scale-105 transition-transform">
              <Heart className="w-5 h-5 text-green-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-1 text-sm">I'm in Recovery</h3>
              <p className="text-xs text-muted-foreground mb-3">
                Working on overcoming gambling addiction with website blocking and progress tracking.
              </p>
              <Button size="sm" className="w-full group-hover:bg-primary/90 transition-colors">
                Start Recovery Journey
                <ArrowRight className="w-3 h-3 ml-2" />
              </Button>
            </div>
          </div>
        </Card>

<Card
  className="p-4 border-2 border-transparent hover:border-primary/20 transition-colors cursor-pointer group"
  onClick={() => window.open("https://guardian-eth.vercel.app/", "_blank")}
>

  <div className="flex items-start gap-3">
    <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-full group-hover:scale-105 transition-transform">
      <Shield className="w-5 h-5 text-blue-400" />
    </div>
    <div className="flex-1">
      <h3 className="font-semibold mb-1 text-sm">I'm a Guardian</h3>
      <p className="text-xs text-muted-foreground mb-3">
        Help someone in recovery by approving requests to modify restrictions.
      </p>
      <Button
        size="sm"
        variant="outline"
        className="w-full group-hover:bg-secondary transition-colors"
      >
        Access Dashboard
        <ArrowRight className="w-3 h-3 ml-2" />
      </Button>
    </div>
  </div>
</Card>


      </div>

      <div className="text-center">
        <p className="text-xs text-muted-foreground">
          Recovery is a team effort 💪
        </p>
      </div>
    </div>
  );
}