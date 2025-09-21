import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Shield, Plus, Ban } from "lucide-react";
import { ethers } from "ethers";
import { getGuardianAddress } from "./wallet-connect-prompt";

const ETHERSCAN_API_KEY = "UXXVWFG1QFKBM1TPCZ53I9VIX155PHNYQ6";

// --- Chrome extension support ---
declare const chrome: any;

// --- Helper functions ---
function hexToBytes(hex: string) {
  if (hex.startsWith("0x")) hex = hex.slice(2);
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
  }
  return bytes;
}

function parsePayload(inputHex: string): { message: string; signature: string } {
  const raw = hexToBytes(inputHex);
  if (raw.length < 1 + 65) throw new Error("Input too short");
  const msgLen = raw[0];
  if (raw.length < 1 + msgLen + 65) throw new Error("Input too short for declared length");
  const msg = new TextDecoder().decode(raw.slice(1, 1 + msgLen));
  const sig =
    "0x" +
    Array.from(raw.slice(1 + msgLen, 1 + msgLen + 65))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  return { message: msg, signature: sig };
}

async function fetchTx(txHash: string) {
  const res = await fetch(
    `https://api-sepolia.etherscan.io/api?module=proxy&action=eth_getTransactionByHash&txhash=${txHash}&apikey=${ETHERSCAN_API_KEY}`
  );
  const data = await res.json();
  return data.result;
}

function generateRandomMessage() {
  return Math.random().toString(36).substring(2, 18);
}

// --- React component ---
export function WebsitesPage() {
  const [blockedSites, setBlockedSites] = useState<{ url: string; addedDate: string }[]>([]);
  const [siteMessages, setSiteMessages] = useState<{ [url: string]: string }>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSite, setSelectedSite] = useState<string | null>(null);
  const [txHash, setTxHash] = useState("");
  const [claimedAddress, setClaimedAddress] = useState("");
  const [verifyStatus, setVerifyStatus] = useState<string>("");
  const [newSiteUrl, setNewSiteUrl] = useState("");

  // --- Streak management ---
  const [streak, setStreak] = useState<number>(0);
  const [streakStartDate, setStreakStartDate] = useState<Date | null>(null);

  useEffect(() => {
    // Load blocked sites, messages, and streak from storage
    chrome.storage.local.get(["blockedSites", "siteMessages", "streakStartDate", "streakCount"], (result: any) => {
      if (result.blockedSites) setBlockedSites(result.blockedSites);
      if (result.siteMessages) setSiteMessages(result.siteMessages);
      if (result.streakStartDate) setStreakStartDate(new Date(result.streakStartDate));
      if (result.streakCount) setStreak(parseInt(result.streakCount, 10) || 0);
    });

    setClaimedAddress(getGuardianAddress());
  }, []);

  const resetStreak = () => {
    const today = new Date();
    setStreak(0);
    setStreakStartDate(today);
    chrome.storage.local.set({
      streakStartDate: today.toISOString(),
      streakCount: 0,
    });
  };

  // Save blocked sites + messages to storage whenever updated
  useEffect(() => {
    chrome.storage.local.set({ blockedSites, siteMessages });

    // Initialize missing random messages for new sites
    setSiteMessages((prev) => {
      const updated = { ...prev };
      let changed = false;
      blockedSites.forEach((site) => {
        if (!updated[site.url]) {
          updated[site.url] = generateRandomMessage();
          changed = true;
        }
      });
      if (changed) chrome.storage.local.set({ siteMessages: updated });
      return updated;
    });
  }, [blockedSites, siteMessages]);

  // Refresh random messages every 3 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      setSiteMessages((prev) => {
        const updated: { [url: string]: string } = {};
        for (const url of Object.keys(prev)) {
          updated[url] = generateRandomMessage();
        }
        chrome.storage.local.set({ siteMessages: updated });
        return updated;
      });
    }, 3 * 60 * 1000); // 3 minutes
    return () => clearInterval(interval);
  }, []);

  const handleAddSite = () => {
    if (!newSiteUrl) return;
    const newSites = [
      ...blockedSites,
      { url: newSiteUrl, addedDate: new Date().toISOString().split("T")[0] },
    ];
    setBlockedSites(newSites);
    setNewSiteUrl("");
  };

  const openRemoveModal = (siteUrl: string) => {
    setSelectedSite(siteUrl);
    setTxHash("");
    setVerifyStatus("");
    setClaimedAddress(getGuardianAddress());
    setModalOpen(true);
  };

  const handleRemoveConfirm = async () => {
    if (!selectedSite) return;

    setVerifyStatus("⏳ Verifying...");
    try {
      const tx = await fetchTx(txHash);
      if (!tx?.input) throw new Error("No input data in tx");

      const { message, signature } = parsePayload(tx.input);
      const recovered = ethers.utils.verifyMessage(message, signature);

      if (recovered.toLowerCase() !== claimedAddress.toLowerCase()) {
        setVerifyStatus("❌ Verification failed. Signer mismatch.");
        return;
      }
      if (message !== siteMessages[selectedSite]) {
        setVerifyStatus("❌ Verification failed. Message does not match.");
        return;
      }

      const newSites = blockedSites.filter((s) => s.url !== selectedSite);
      setBlockedSites(newSites);

      // remove the site’s message too
      const updatedMessages = { ...siteMessages };
      delete updatedMessages[selectedSite];
      setSiteMessages(updatedMessages);
      chrome.storage.local.set({ siteMessages: updatedMessages });

      setVerifyStatus("✅ Verified! Site removed.");
      setTimeout(() => setModalOpen(false), 1000);

      // 🔹 Reset streak whenever a site is removed
      resetStreak();
    } catch (e: any) {
      console.error(e);
      setVerifyStatus("❌ Error verifying tx: " + e.message);
    }
  };

  return (
    <div className="w-full max-w-[310px] space-y-3">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full mx-auto">
          <Shield className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-lg font-semibold">Website Control</h2>
        <p className="text-xs text-muted-foreground">Manage blocked websites</p>
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="Enter website to block..."
          value={newSiteUrl}
          onChange={(e) => setNewSiteUrl(e.target.value)}
          className="h-8 text-sm flex-1"
        />
        <Button size="sm" onClick={handleAddSite}>
          <Plus className="w-3 h-3 mr-1" /> Block
        </Button>
      </div>

      <Separator />

      <div>
        <div className="flex items-center gap-2 mb-2">
          <Ban className="w-3 h-3 text-destructive" />
          <h3 className="font-medium text-sm">Blocked Sites</h3>
          <Badge variant="destructive">{blockedSites.length}</Badge>
        </div>
        <div className="space-y-2">
          {blockedSites.map((site, idx) => (
            <Card key={idx} className="p-2 flex justify-between items-center">
              <div>
                <p className="font-medium text-xs">{site.url}</p>
                <p className="text-xs text-muted-foreground">{site.addedDate}</p>
              </div>
              <Button size="sm" variant="ghost" onClick={() => openRemoveModal(site.url)}>
                Remove
              </Button>
            </Card>
          ))}
        </div>
      </div>

      {modalOpen && selectedSite && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-5 rounded-lg w-[300px] space-y-3">
            <h3 className="font-semibold">Confirm Removal</h3>
            <p className="text-xs text-muted-foreground">
              Sign the message with your guardian address and send a tx with payload.
            </p>
            <p className="font-mono p-2 bg-gray-100 rounded text-xs">
              {siteMessages[selectedSite]}
            </p>
            <Input
              placeholder="Claimed signer address (0x...)"
              value={claimedAddress}
              readOnly
              className="text-sm bg-gray-100 cursor-not-allowed"
            />
            <Input
              placeholder="Tx hash (0x...)"
              value={txHash}
              onChange={(e) => setTxHash(e.target.value)}
              className="text-sm"
            />
            <div className="flex justify-end gap-2">
              <Button size="sm" variant="ghost" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleRemoveConfirm} disabled={!txHash || !claimedAddress}>
                Verify & Remove
              </Button>
            </div>
            {verifyStatus && <p className="text-xs mt-2">{verifyStatus}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
