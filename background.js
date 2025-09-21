console.log("✅ Background worker loaded!");

// Listen for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status !== "complete" || !tab.url) return;

  chrome.storage.local.get("blockedSites", ({ blockedSites }) => {
    if (!blockedSites || blockedSites.length === 0) return;

    try {
      const url = new URL(tab.url);

      // Skip chrome://, extension://, or about:// pages
      if (["chrome:", "chrome-extension:", "about:"].some(proto => url.protocol.startsWith(proto))) {
        return;
      }

      const hostname = url.hostname.replace(/^www\./, "");

      // Normalize: blockedSites may be objects or strings
      const siteList = blockedSites.map(site =>
        typeof site === "string" ? site.toLowerCase() : site.url.toLowerCase()
      );

      // Check for exact or subdomain match
      const isBlocked = siteList.some(site =>
        hostname === site || hostname.endsWith(`.${site}`)
      );

      if (isBlocked) {
        console.log(`🚫 Blocking access to: ${hostname}`);
        chrome.tabs.update(tabId, { url: chrome.runtime.getURL("blocked.html") });
      }
    } catch (err) {
      console.error("❌ Error parsing tab URL:", err);
    }
  });
});
