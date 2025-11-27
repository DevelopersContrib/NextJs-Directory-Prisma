import React, { useState, useEffect } from "react";
import {
  X,
  Sparkles,
  Rocket,
  Crown,
  Zap,
  ArrowRight,
  Clock,
  CheckCircle,
} from "lucide-react";

export interface First100FoundersModalProps {
  /**
   * URL path to navigate to when CTA button is clicked
   * @default '/first100founders'
   */
  targetUrl?: string;

  /**
   * Delay in milliseconds before showing the modal
   * @default 15000 (15 seconds)
   */
  delay?: number;

  /**
   * Array of path prefixes to exclude the modal from showing
   * @default ['/first100founders', '/admin']
   */
  excludedPaths?: string[];

  /**
   * Custom session storage key for tracking if modal was shown
   * @default 'first100founders_modal_shown'
   */
  sessionKey?: string;

  /**
   * Custom navigation handler function (for Next.js router.push, etc.)
   * If not provided, will use window.location.href
   */
  onNavigate?: (url: string) => void;

  /**
   * Custom function to get current pathname
   * If not provided, will use window.location.pathname
   */
  getCurrentPath?: () => string;

  /**
   * Custom content overrides
   */
  content?: {
    title?: string;
    subtitle?: string;
    description?: string;
    ctaText?: string;
    dismissText?: string;
    footerText?: string;
  };

  /**
   * Custom benefits list
   */
  benefits?: Array<{
    icon: React.ReactNode;
    text: string;
    color?: string;
    bg?: string;
  }>;

  /**
   * Pricing information
   */
  pricing?: {
    startingPrice?: string;
    freePlanText?: string;
    plans?: Array<{
      name: string;
      price: string;
    }>;
    limitedSlots?: string;
    expiryDate?: string;
  };

  /**
   * Z-index for the modal
   * @default 9999
   */
  zIndex?: number;

  /**
   * Whether to show the modal (controlled mode)
   * If provided, component becomes controlled
   */
  isOpen?: boolean;

  /**
   * Callback when modal is closed
   */
  onClose?: () => void;

  /**
   * Callback when CTA is clicked
   */
  onCTAClick?: () => void;

  /**
   * Test mode - shows immediately and ignores sessionStorage
   * @default false
   */
  testMode?: boolean;
}

export const First100FoundersModal: React.FC<First100FoundersModalProps> = ({
  targetUrl = "/first100founders",
  delay = 15000,
  excludedPaths = ["/first100founders", "/admin"],
  sessionKey = "first100founders_modal_shown",
  onNavigate,
  getCurrentPath,
  content,
  benefits,
  pricing,
  zIndex = 9999,
  isOpen: controlledIsOpen,
  onClose,
  onCTAClick,
  testMode = false,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const isControlled = controlledIsOpen !== undefined;

  // Get current pathname
  const getPathname = () => {
    if (getCurrentPath) {
      return getCurrentPath();
    }
    if (typeof window !== "undefined") {
      return window.location.pathname;
    }
    return "";
  };

  useEffect(() => {
    // Check if current date is after December 31, 2025
    const cutoffDate = new Date("2026-01-01T00:00:00");
    const currentDate = new Date();
    if (currentDate >= cutoffDate) {
      console.log(
        "[First100FoundersModal] Modal expired after December 31, 2025"
      );
      setIsVisible(false);
      return;
    }

    // If controlled, use controlled state (but still respect date cutoff)
    if (isControlled) {
      setIsVisible(controlledIsOpen || false);
      return;
    }

    // Check if path is excluded FIRST (before test mode or anything else)
    const currentPath = getPathname();
    console.log(
      "[First100FoundersModal] Current path:",
      currentPath,
      "Excluded paths:",
      excludedPaths
    );
    const isExcluded = excludedPaths.some((path) =>
      currentPath.startsWith(path)
    );

    if (isExcluded) {
      console.log("[First100FoundersModal] Path excluded:", currentPath);
      return;
    }

    console.log("[First100FoundersModal] Path NOT excluded, continuing...");

    // Test mode - show immediately (only if not excluded)
    if (testMode) {
      console.log("[First100FoundersModal] Test mode - showing immediately");
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 100);
      return () => clearTimeout(timer);
    }

    // Check if user has already dismissed this modal in this session
    if (typeof window !== "undefined") {
      // Allow clearing via URL parameter for testing: ?clearModal=true
      const urlParams = new URLSearchParams(window.location.search);
      const clearModal = urlParams.get("clearModal") === "true";

      if (clearModal) {
        console.log(
          "[First100FoundersModal] Clearing sessionStorage due to ?clearModal=true parameter"
        );
        sessionStorage.removeItem(sessionKey);
      }

      const wasShown = sessionStorage.getItem(sessionKey);

      if (wasShown && !testMode && !clearModal) {
        console.log("[First100FoundersModal] Already shown in this session.");
        console.log(
          '[First100FoundersModal] To test again, add ?clearModal=true to URL or run: sessionStorage.removeItem("' +
            sessionKey +
            '")'
        );
        setHasShown(true);
        return;
      }

      console.log(
        "[First100FoundersModal] Will show after",
        delay,
        "ms on path:",
        currentPath
      );

      // Show modal after delay
      const timer = setTimeout(() => {
        // Double-check path hasn't changed
        const finalPath = getPathname();
        const stillExcluded = excludedPaths.some((path) =>
          finalPath.startsWith(path)
        );

        if (stillExcluded) {
          console.log(
            "[First100FoundersModal] Path became excluded, not showing:",
            finalPath
          );
          return;
        }

        console.log(
          "[First100FoundersModal] Showing modal now on path:",
          finalPath
        );
        setIsVisible(true);
        if (!testMode) {
          sessionStorage.setItem(sessionKey, "true");
        }
      }, delay);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [
    delay,
    excludedPaths,
    sessionKey,
    isControlled,
    controlledIsOpen,
    testMode,
  ]);

  const handleClose = () => {
    setIsVisible(false);
    setHasShown(true);
    if (onClose) {
      onClose();
    }
  };

  const handleNavigate = () => {
    if (onCTAClick) {
      onCTAClick();
    }

    if (onNavigate) {
      onNavigate(targetUrl);
    } else if (typeof window !== "undefined") {
      window.location.href = targetUrl;
    }

    setIsVisible(false);
    setHasShown(true);
  };

  // Default benefits
  const defaultBenefits = benefits || [
    {
      icon: <Rocket className="w-8 h-8" />,
      text: "Full platform access on January 15, 2026",
      color: "text-blue-300",
      bg: "from-blue-500/20 to-cyan-500/20",
    },
    {
      icon: <Zap className="w-8 h-8" />,
      text: "Auto-built contractor website with ALL AI agents",
      color: "text-purple-300",
      bg: "from-purple-500/20 to-pink-500/20",
    },
    {
      icon: <Crown className="w-8 h-8" />,
      text: "Early access to DomainFund Secret Auction",
      color: "text-yellow-300",
      bg: "from-yellow-500/20 to-orange-500/20",
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      text: "Founders Badge & exclusive community access",
      color: "text-pink-300",
      bg: "from-pink-500/20 to-red-500/20",
    },
  ];

  // Default pricing
  const defaultPricing = pricing || {
    startingPrice: "$99",
    freePlanText: "1-month free Starter Plan included",
    plans: [
      { name: "Professional Plan", price: "$299/month" },
      { name: "Enterprise Plan", price: "$999/month" },
    ],
    limitedSlots: "Only 100 available",
    expiryDate: "December 31, 2025",
  };

  // Prevent body scroll when modal is visible
  useEffect(() => {
    if (isVisible) {
      // Prevent body scroll
      const originalOverflow = document.body.style.overflow;
      const originalHtmlOverflow = document.documentElement.style.overflow;
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";

      return () => {
        // Restore scroll on cleanup
        document.body.style.overflow = originalOverflow;
        document.documentElement.style.overflow = originalHtmlOverflow;
      };
    }
  }, [isVisible]);

  // Debug logging
  useEffect(() => {
    const currentPath = getPathname();
    const isExcluded = excludedPaths.some((path) =>
      currentPath.startsWith(path)
    );

    console.log("[First100FoundersModal] Component mounted", {
      isVisible,
      hasShown,
      isControlled,
      testMode,
      currentPath,
      isExcluded,
      delay,
      excludedPaths,
    });

    if (isVisible) {
      console.log(
        "[First100FoundersModal] Modal is visible - should render now"
      );
    }
  }, [isVisible, hasShown, isControlled, testMode, excludedPaths, delay]);

  // Check if current date is after December 31, 2025
  const cutoffDate = new Date("2026-01-01T00:00:00");
  const currentDate = new Date();
  if (currentDate >= cutoffDate) {
    return null;
  }

  // Early return if path is excluded (even before checking visibility)
  const currentPath = getPathname();
  const isExcluded = excludedPaths.some((path) => currentPath.startsWith(path));
  if (isExcluded) {
    return null;
  }

  if (!isVisible || hasShown) {
    console.log("[First100FoundersModal] Not rendering:", {
      isVisible,
      hasShown,
    });
    return null;
  }

  console.log("[First100FoundersModal] RENDERING MODAL NOW");

  return (
    <div
      className="fixed inset-0 w-full h-full overflow-y-auto animate-fade-in-scale"
      style={{
        zIndex: zIndex || 99999,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100vw",
        height: "100vh",
        position: "fixed",
      }}
      data-testid="first100founders-modal"
    >
      {/* Full-screen animated background - fully opaque */}
      <div
        className="absolute inset-0"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: "100vw",
          height: "100vh",
          background:
            "linear-gradient(to bottom right, #581c87, #1e3a8a, #312e81)",
          zIndex: 0,
        }}
      >
        {/* Animated gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 via-purple-500/20 to-blue-500/20 animate-pulse"></div>

        {/* Large decorative blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-yellow-400/30 to-orange-500/30 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-purple-500/30 to-blue-500/30 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-pink-500/20 to-red-500/20 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Content Container */}
      <div
        className="relative z-10 min-h-full flex flex-col items-center justify-center p-4 md:p-8 lg:p-12"
        style={{
          minHeight: "100vh",
          width: "100%",
        }}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-6 right-6 z-20 p-3 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all duration-300 border border-white/20"
          aria-label="Close"
        >
          <X className="w-6 h-6 text-white" />
        </button>

        {/* Main Content */}
        <div className="max-w-6xl w-full space-y-8 md:space-y-12">
          {/* Header Section */}
          <div className="text-center space-y-6">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full px-8 py-3 shadow-2xl mb-4">
              <Sparkles className="w-6 h-6 text-white animate-pulse" />
              <span className="text-white font-bold text-base uppercase tracking-wider">
                {content?.title || "Limited Time Offer"}
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-white mb-6 leading-tight">
              <span className="bg-gradient-to-r from-yellow-300 via-white to-blue-300 bg-clip-text text-transparent">
                🎉 Be One of the
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-300 via-pink-300 to-red-300 bg-clip-text text-transparent">
                {content?.subtitle || "First 100 Founders!"}
              </span>
            </h1>

            <p className="text-2xl md:text-3xl lg:text-4xl text-white/90 font-semibold mb-4">
              {content?.description || "Don't wait for the public launch!"}
            </p>
            <p className="text-xl md:text-2xl text-white/70 max-w-3xl mx-auto">
              Secure your spot now and get exclusive access to VentureOS
              platform with incredible benefits.
            </p>
          </div>

          {/* Benefits Grid - Larger for full screen */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {defaultBenefits.map((benefit, index) => (
              <div
                key={index}
                className={`relative p-6 md:p-8 bg-gradient-to-br ${
                  benefit.bg || "from-gray-500/20 to-gray-600/20"
                } backdrop-blur-md rounded-2xl border border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-105 hover:shadow-2xl`}
              >
                <div className="flex items-start space-x-4">
                  <div
                    className={`flex-shrink-0 ${
                      benefit.color || "text-white"
                    } p-3 bg-white/10 rounded-xl`}
                  >
                    {benefit.icon}
                  </div>
                  <span className="text-white text-lg md:text-xl font-semibold leading-relaxed">
                    {benefit.text}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Buttons - Larger and more prominent */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <a
              href="https://www.ventureos.com/first100founders"
              target="_blank"
              rel="noopener noreferrer"
              className="group px-12 py-6 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white font-bold text-xl md:text-2xl rounded-2xl hover:from-purple-700 hover:via-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-2xl hover:shadow-purple-500/50 transform hover:scale-110 flex items-center space-x-3 w-full sm:w-auto justify-center text-center"
            >
              <span>{content?.ctaText || "Reserve My Founder Spot"}</span>
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </a>
            <button
              onClick={handleClose}
              className="px-10 py-6 bg-white/10 backdrop-blur-md text-white font-semibold text-lg rounded-2xl hover:bg-white/20 border border-white/30 transition-all w-full sm:w-auto"
            >
              {content?.dismissText || "Maybe Later"}
            </button>
          </div>

          {/* Footer Note */}
          <p className="text-center text-white/60 text-lg md:text-xl mt-8">
            {content?.footerText ||
              "🔥 Only 100 slots available • Act fast before they're gone!"}
          </p>
        </div>
      </div>
    </div>
  );
};

// Export default for easier imports
export default First100FoundersModal;
