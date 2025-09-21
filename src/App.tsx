import { useState } from "react";
import { Header } from "./components/header";
import { StreakDisplay } from "./components/streak-display";
import { BottomNavigation } from "./components/bottom-navigation";
import { GoalSetup } from "./components/goal-setup";
import { WebsitesPage } from "./components/websites-page";
import { SupportPage } from "./components/support-page";
import { AIChatPage } from "./components/ai-chat-page";
import { UserTypeSelection } from "./components/user-type-selection";
import { GuardianBottomNavigation } from "./components/guardian-bottom-navigation";
import { MessageSigningPage } from "./components/message-signing-page";
import { WalletConnectPrompt } from "./components/wallet-connect-prompt";

type ClientPage = "user-select" | "goal-setup" | "home" | "websites" | "support" | "ai-chat";
type GuardianPage = "signing";
type UserType = "guardian" | "client" | null;

interface UserData {
  goal: number | null;
  streak: number;
  startDate: Date;
  isWalletConnected: boolean;
}

export default function App() {
  const [userType, setUserType] = useState<UserType>(null);
  const [currentClientPage, setCurrentClientPage] = useState<ClientPage>("user-select");
  const [currentGuardianPage, setCurrentGuardianPage] = useState<GuardianPage>("signing");
  const [userData, setUserData] = useState<UserData>({
    goal: null,
    streak: 0,
    startDate: new Date(Date.now() - 47 * 24 * 60 * 60 * 1000),
    isWalletConnected: false,
  });

  const handleUserTypeSelect = (type: UserType) => {
    setUserType(type);
    if (type === "client") {
      setCurrentClientPage("goal-setup");
    }
  };

  const handleGoalSet = (goal: number) => {
    setUserData(prev => ({ ...prev, goal }));
    setCurrentClientPage("home");
  };

  const handleWalletConnect = () => {
    setUserData(prev => ({ ...prev, isWalletConnected: !prev.isWalletConnected }));
  };

  const handleClientNavigate = (page: ClientPage) => {
    setCurrentClientPage(page);
  };

  const handleGuardianNavigate = (page: GuardianPage) => {
    setCurrentGuardianPage(page);
  };

  const renderClientPage = () => {
    switch (currentClientPage) {
      case "goal-setup":
        return <GoalSetup onGoalSet={handleGoalSet} />;
      case "home":
        return <StreakDisplay userData={userData} />;
      case "websites":
        return <WebsitesPage />;
      case "support":
        return <SupportPage />;
      case "ai-chat":
        return <AIChatPage />;
      default:
        return <StreakDisplay userData={userData} />;
    }
  };

  const renderGuardianPage = () => {
    return <MessageSigningPage />;
  };

  const renderCurrentPage = () => {
    if (!userType) {
      return <UserTypeSelection onUserTypeSelect={handleUserTypeSelect} />;
    }
    
    // Show wallet connect prompt if wallet is not connected
    if (!userData.isWalletConnected) {
      return <WalletConnectPrompt userType={userType} onWalletConnect={handleWalletConnect} />;
    }
    
    if (userType === "guardian") {
      return renderGuardianPage();
    }
    
    return renderClientPage();
  };

  const showHeader = userType && userData.isWalletConnected && (
    (userType === "client" && currentClientPage !== "goal-setup") ||
    userType === "guardian"
  );

  const showNavigation = userType && userData.isWalletConnected && (
    (userType === "client" && currentClientPage !== "goal-setup") ||
    userType === "guardian"
  );

  return (
    <div className="w-[350px] h-[500px] bg-background flex flex-col">
      {showHeader && (
        <Header 
          isWalletConnected={userData.isWalletConnected}
          onWalletConnect={handleWalletConnect}
        />
      )}
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        {renderCurrentPage()}
      </main>
      {showNavigation && (
        userType === "guardian" ? (
          <GuardianBottomNavigation 
            currentPage={currentGuardianPage}
            onNavigate={handleGuardianNavigate}
          />
        ) : (
          <BottomNavigation 
            currentPage={currentClientPage}
            onNavigate={handleClientNavigate}
          />
        )
      )}
    </div>
  );
}