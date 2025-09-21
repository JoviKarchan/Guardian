import { FileSignature, Copy, Check, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Textarea } from "./ui/textarea";
import { useState } from "react";
import Web3 from "web3";

const SEPOLIA_CHAIN_ID = "0xaa36a7"; // 11155111 in hex

export function MessageSigningPage() {
  const [messageToSign, setMessageToSign] = useState("");
  const [copiedMessage, setCopiedMessage] = useState(false);
  const [isSigning, setIsSigning] = useState(false);
  const [txHash, setTxHash] = useState("");
  const [copiedTx, setCopiedTx] = useState(false);
  const [output, setOutput] = useState("");

  const getMetaMaskProvider = (): any | null => {
    const ethereum = (window as any).ethereum;
    if (!ethereum) return null;

    if (ethereum.isMetaMask) return ethereum;

    if (ethereum.providers?.length) {
      const metamask = ethereum.providers.find((p: any) => p.isMetaMask);
      if (metamask) return metamask;
    }
    return null;
  };

  const handleCopyMessage = () => {
    if (messageToSign.trim()) {
      navigator.clipboard.writeText(messageToSign);
      setCopiedMessage(true);
      setTimeout(() => setCopiedMessage(false), 2000);
    }
  };

  const handleCopyTx = () => {
    if (txHash) {
      navigator.clipboard.writeText(txHash);
      setCopiedTx(true);
      setTimeout(() => setCopiedTx(false), 2000);
    }
  };

  const switchToSepolia = async (ethereum: any) => {
    const chainId = await ethereum.request({ method: "eth_chainId" });
    if (chainId.toLowerCase() !== SEPOLIA_CHAIN_ID) {
      try {
        await ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: SEPOLIA_CHAIN_ID }],
        });
      } catch (switchError: any) {
        // Chain not added
        if (switchError.code === 4902) {
          await ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: SEPOLIA_CHAIN_ID,
                chainName: "Sepolia Testnet",
                rpcUrls: ["https://rpc.sepolia.org"],
                nativeCurrency: {
                  name: "SepoliaETH",
                  symbol: "ETH",
                  decimals: 18,
                },
                blockExplorerUrls: ["https://sepolia.etherscan.io"],
              },
            ],
          });
        } else {
          throw switchError;
        }
      }
    }
  };

  const handleSignAndSend = async () => {
    if (!messageToSign.trim()) return;

    const metamask = getMetaMaskProvider();
    if (!metamask) {
      setOutput("MetaMask not detected!");
      return;
    }

    setIsSigning(true);
    setOutput("");

    try {
      await switchToSepolia(metamask);

      // Request accounts
      const accounts: string[] = await metamask.request({ method: "eth_requestAccounts" });
      const from = accounts[0];

      // Sign the message
      const signature = await metamask.request({
        method: "personal_sign",
        params: [messageToSign, from],
      });

      const web3 = new Web3(metamask);
      const recovered = web3.eth.accounts.recover(messageToSign, signature);

      if (from.toLowerCase() !== recovered.toLowerCase()) {
        setOutput("❌ Signature mismatch!");
        setIsSigning(false);
        return;
      }

      // Encode message into data field
      const msgBytes = new TextEncoder().encode(messageToSign);
      const sigBytes = new Uint8Array(signature.slice(2).match(/.{2}/g)!.map((h) => parseInt(h, 16)));
      const payload = new Uint8Array(1 + msgBytes.length + sigBytes.length);
      payload[0] = msgBytes.length;
      payload.set(msgBytes, 1);
      payload.set(sigBytes, 1 + msgBytes.length);
      const payloadHex = "0x" + Array.from(payload).map((b) => b.toString(16).padStart(2, "0")).join("");

      // Send transaction
      const toAddress = "0x7a4F9654434669FA941CE37Eb12F3edB0Df4fD55"; // Example
      const txHashResult: string = await metamask.request({
        method: "eth_sendTransaction",
        params: [
          {
            from,
            to: toAddress,
            value: "0x0",
            data: payloadHex,
          },
        ],
      });

      setTxHash(txHashResult);
      setMessageToSign("");
      setOutput(`✅ Transaction sent!`);
    } catch (err: any) {
      setOutput(`Error: ${err.message}`);
    } finally {
      setIsSigning(false);
    }
  };

  return (
    <div className="w-full max-w-[320px] space-y-3">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full mx-auto">
          <FileSignature className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-lg font-semibold">Message Signing</h2>
        <p className="text-xs text-muted-foreground">Sign Ethereum messages & send on Sepolia</p>
      </div>

      <Card className="p-3 space-y-2">
        <div className="space-y-1">
          <label className="text-xs font-medium">Message to Sign:</label>
          <Textarea
            value={messageToSign}
            onChange={(e) => setMessageToSign(e.target.value)}
            placeholder="Enter message..."
            className="text-xs resize-none h-20"
            rows={3}
          />
        </div>

        <div className="flex gap-1">
          <Button
            onClick={handleCopyMessage}
            disabled={!messageToSign.trim()}
            variant="outline"
            className="flex-1 h-7 text-xs"
          >
            {copiedMessage ? (
              <>
                <Check className="w-3 h-3 mr-1" /> Copied!
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 mr-1" /> Copy
              </>
            )}
          </Button>

          <Button
            onClick={handleSignAndSend}
            disabled={!messageToSign.trim() || isSigning}
            className="flex-1 h-7 text-xs"
          >
            {isSigning ? (
              <>
                <Loader2 className="w-3 h-3 mr-1 animate-spin" /> Sending...
              </>
            ) : (
              <>
                <FileSignature className="w-3 h-3 mr-1" /> Sign & Send
              </>
            )}
          </Button>
        </div>

        {txHash && (
          <Button
            onClick={handleCopyTx}
            variant="outline"
            size="sm"
            className="mt-1 w-full text-xs flex items-center justify-center gap-1"
          >
            {copiedTx ? (
              <>
                <Check className="w-3 h-3" /> Copied!
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                {txHash.slice(0, 6)}...{txHash.slice(-4)}
              </>
            )}
          </Button>
        )}

        {output && (
          <pre className="text-xs bg-muted p-2 rounded font-mono whitespace-pre-wrap">{output}</pre>
        )}
      </Card>
    </div>
  );
}
