"use client";

import { Wallet } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";

export function Header() {
  const [account, setAccount] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleWalletConnect = async () => {
    try {
      if (!(window as any).ethereum) {
        setError("MetaMask is not installed");
        return;
      }

      const accounts: string[] = await (window as any).ethereum.request({
        method: "eth_requestAccounts",
      });

      setAccount(accounts[0]);
      setError(null);
      localStorage.setItem("walletAddress", accounts[0]); // optional storage
    } catch (err: any) {
      setError(err.message || "Failed to connect wallet");
    }
  };

  return (
    <header className="flex items-center justify-between p-4 border-b border-border">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <span className="text-primary-foreground font-bold">G</span>
        </div>
        <h1 className="font-medium">Guardian</h1>
      </div>

      {account ? (
        <div className="flex items-center gap-2 px-3 py-1 border border-border rounded text-sm">
          <Wallet className="w-4 h-4" />
          {account.slice(0, 6)}...{account.slice(-4)}
        </div>
      ) : (
        <Button
          variant="outline"
          size="sm"
          onClick={handleWalletConnect}
          className="flex items-center gap-2"
        >
          <Wallet className="w-4 h-4" />
          Connect
        </Button>
      )}

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </header>
  );
}
