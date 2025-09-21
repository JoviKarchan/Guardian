// Forward ethereum provider to the extension
if (window.ethereum) {
  window.postMessage({ type: "ETHEREUM_AVAILABLE" }, "*");

  window.addEventListener("message", async (event) => {
    if (event.source !== window) return;
    if (event.data.type === "ETH_REQUEST_ACCOUNTS") {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        window.postMessage({ type: "ETH_ACCOUNTS", accounts }, "*");
      } catch (err) {
        window.postMessage({ type: "ETH_ERROR", error: err.message }, "*");
      }
    }
  });
}
