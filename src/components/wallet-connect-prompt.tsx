import { Wallet, Shield } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

interface WalletConnectPromptProps {
  userType: "guardian" | "client";
  onWalletConnect: (walletAddress: string) => void;
}

export const getGuardianAddress = (): string =>
  localStorage.getItem("guardianAddress") || "";

export function WalletConnectPrompt({
  userType,
  onWalletConnect,
}: WalletConnectPromptProps) {
  const [account, setAccount] = useState<string | null>(null);
  const [guardianAddress, setGuardianAddress] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedWallet = localStorage.getItem("walletAddress");
    const savedGuardian = localStorage.getItem("guardianAddress");

    if (savedWallet) setAccount(savedWallet);

    // ✅ If guardian is already stored, auto-skip UI and trigger callback
    if (savedGuardian) {
      setGuardianAddress(savedGuardian);
      onWalletConnect(savedGuardian);
    }
  }, [onWalletConnect]);

  const connectWallet = async () => {
    try {
      if (!(window as any).ethereum) {
        setError("MetaMask is not installed");
        return;
      }

      const accounts: string[] = await (window as any).ethereum.request({
        method: "eth_requestAccounts",
      });

      const walletAddress = accounts[0];
      setAccount(walletAddress);
      localStorage.setItem("walletAddress", walletAddress);
      setError(null);

      onWalletConnect(walletAddress);
    } catch (err: any) {
      setError(err.message || "Failed to connect wallet");
    }
  };

  const submitGuardianAddress = () => {
    if (!guardianAddress) {
      setError("Please enter your guardian's wallet address");
      return;
    }

    localStorage.setItem("guardianAddress", guardianAddress);
    setError(null);
    onWalletConnect(guardianAddress);
  };

  // ✅ If guardian is already set, don’t render this page at all
  if (userType === "client" && getGuardianAddress()) {
    return null;
  }

  return (
    <div className="w-full max-w-[310px] space-y-4">
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full mx-auto">
          <Wallet className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">
            {userType === "guardian"
              ? "Connect Your Wallet"
              : "Enter Guardian Address"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {userType === "guardian"
              ? "Connect your Ethereum wallet to sign messages and approve client requests"
              : "Enter your guardian's wallet address to secure your account"}
          </p>
        </div>
      </div>

      <Card className="p-4 space-y-4">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-primary mt-0.5" />
          <div>
            <h3 className="font-medium mb-2">Secure & Private</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Your wallet stays in your control</li>
              <li>• No private keys shared</li>
              <li>
                • {userType === "guardian"
                  ? "Sign messages to approve access"
                  : "Encrypted recovery data"}
              </li>
            </ul>
          </div>
        </div>

        {userType === "guardian" ? (
          <Button onClick={connectWallet} className="w-full" size="lg">
            <Wallet className="w-4 h-4 mr-2" />
            {account
              ? `Connected: ${account.slice(0, 6)}...${account.slice(-4)}`
              : "Connect Wallet"}
          </Button>
        ) : (
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Guardian Wallet Address"
              value={guardianAddress}
              onChange={(e) => setGuardianAddress(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded text-sm"
            />
            <Button onClick={submitGuardianAddress} className="w-full" size="lg">
              Continue
            </Button>
          </div>
        )}

        {error && <p className="text-xs text-red-500">{error}</p>}
      </Card>

      <Card className="p-3 bg-muted/50">
        <p className="text-xs text-muted-foreground text-center">
          {userType === "guardian"
            ? "As a guardian, your signature is required to approve client requests"
            : "Your guardian connection enables secure account recovery"}
        </p>
      </Card>
    </div>
  );
}
