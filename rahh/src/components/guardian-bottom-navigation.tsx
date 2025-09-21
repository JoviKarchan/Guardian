import { FileSignature } from "lucide-react";
import { Button } from "./ui/button";

type GuardianPage = "signing";

interface GuardianBottomNavigationProps {
  currentPage: GuardianPage;
  onNavigate: (page: GuardianPage) => void;
}

export function GuardianBottomNavigation({ currentPage, onNavigate }: GuardianBottomNavigationProps) {
  return (
    <div className="border-t border-border p-4">
      
      
    </div>
  );
}