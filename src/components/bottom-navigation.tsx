import { HelpCircle, Shield, MessageCircle, Home } from "lucide-react";
import { Button } from "./ui/button";

type ClientPage = "user-select" | "goal-setup" | "home" | "websites" | "support" | "ai-chat";

interface BottomNavigationProps {
  onNavigate: (page: ClientPage) => void;
}

export function BottomNavigation({ onNavigate }: BottomNavigationProps) {
  const handleHome = () => {
    onNavigate("home");
  };

  const handleSupport = () => {
    console.log("Opening support...");
    // Mock action - would open support page
  };

  const handleWebsiteSettings = () => {
    onNavigate("websites");
  };

  const handleAISupport = () => {
    onNavigate("ai-chat");
  };

  return (
    <div className="border-t border-border p-4">
      <div className="grid grid-cols-3 gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={handleWebsiteSettings}
          className="flex flex-col items-center gap-1 h-auto py-3"
        >
          <Shield className="w-5 h-5" />
          <span className="text-xs">Websites</span>
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleHome}
          className="flex flex-col items-center gap-1 h-auto py-3"
        >
          <Home className="w-5 h-5" />
          <span className="text-xs">Home</span>
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleAISupport}
          className="flex flex-col items-center gap-1 h-auto py-3"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="text-xs">AI Chat</span>
        </Button>
      </div>
    </div>
  );
}