// ============================================================
// Progchekr — Production PWA Registration
// ============================================================
// - Registers /sw.js service worker from the real static file
// - Links /manifest.json (served from public/)
// - Injects mobile meta tags for iOS & Android standalone mode
// - Captures the beforeinstallprompt event for in-app prompting
// ============================================================

let deferredInstallPrompt: BeforeInstallPromptEvent | null = null;
let installPromptListeners: Array<(available: boolean) => void> = [];

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

// Subscribe to install-prompt availability changes
export function onInstallAvailable(cb: (available: boolean) => void) {
  installPromptListeners.push(cb);
  // Immediately notify if we already have one
  cb(deferredInstallPrompt !== null);
  return () => {
    installPromptListeners = installPromptListeners.filter((l) => l !== cb);
  };
}

// Trigger the native install prompt
export async function promptInstall(): Promise<boolean> {
  if (!deferredInstallPrompt) return false;
  deferredInstallPrompt.prompt();
  const { outcome } = await deferredInstallPrompt.userChoice;
  deferredInstallPrompt = null;
  installPromptListeners.forEach((cb) => cb(false));
  return outcome === "accepted";
}

// Check if already installed as standalone
export function isStandalone(): boolean {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as any).standalone === true
  );
}

export function registerPWA() {
  // 1. Link the real manifest.json
  if (!document.querySelector('link[rel="manifest"]')) {
    const link = document.createElement("link");
    link.rel = "manifest";
    link.href = "/manifest.json";
    document.head.appendChild(link);
  }

  // 2. Mobile meta tags
  const metas: Record<string, string> = {
    "theme-color": "#282828",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-title": "Progchekr",
  };

  Object.entries(metas).forEach(([name, content]) => {
    if (!document.querySelector(`meta[name="${name}"]`)) {
      const meta = document.createElement("meta");
      meta.name = name;
      meta.content = content;
      document.head.appendChild(meta);
    }
  });

  // Apple touch icon
  if (!document.querySelector('link[rel="apple-touch-icon"]')) {
    const appleIcon = document.createElement("link");
    appleIcon.rel = "apple-touch-icon";
    appleIcon.href = "/icon-192.png";
    document.head.appendChild(appleIcon);
  }

  // 3. Capture install prompt
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredInstallPrompt = e as BeforeInstallPromptEvent;
    installPromptListeners.forEach((cb) => cb(true));
  });

  // Detect when app is installed
  window.addEventListener("appinstalled", () => {
    deferredInstallPrompt = null;
    installPromptListeners.forEach((cb) => cb(false));
  });

  // 4. Register service worker
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/" })
        .then((reg) => {
          // Check for updates every 60 minutes
          setInterval(() => reg.update(), 60 * 60 * 1000);

          // Notify user when a new version is available
          reg.addEventListener("updatefound", () => {
            const newWorker = reg.installing;
            if (!newWorker) return;
            newWorker.addEventListener("statechange", () => {
              if (
                newWorker.state === "installed" &&
                navigator.serviceWorker.controller
              ) {
                // New content available — could show an update banner here
                console.info(
                  "[Progchekr] New version available. Refresh to update."
                );
              }
            });
          });
        })
        .catch((err) => {
          console.error("[Progchekr] SW registration failed:", err);
        });
    });
  }
}
