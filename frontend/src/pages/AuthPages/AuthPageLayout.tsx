import React from "react";
import { ThemeToggleButton } from "../../components/common/ThemeToggleButton";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="relative min-h-screen bg-white dark:bg-gray-900">
        <div className="fixed top-6 right-6 z-50">
          <ThemeToggleButton />
        </div>
        <div className="flex flex-col lg:flex-row min-h-screen">
          {/* Left Side - Sign In Form */}

          {children}
          {/* Right Side - Branding Panel */}
          <div className="hidden lg:flex items-center justify-center w-1/2 bg-black relative overflow-hidden">
            <BackgroundIcons />
            <div className="relative z-10 flex flex-col items-center max-w-lg px-8 text-center">
              {/* Logo */}
              <div className="mb-8">
                <h1 className="text-4xl font-bold text-white mb-2">ANINO</h1>
                <div className="h-1 w-24 bg-[#D4AF37] mx-auto mb-4"></div>
                <p className="text-lg text-[#D4AF37] font-medium tracking-wide">
                  LAW FIRM & REAL ESTATE CONSULTANCY
                </p>
              </div>

              {/* Tagline */}
              <p className="text-xl text-gray-300 leading-relaxed mb-8">
                Where Legal Expertise Meets Real Estate Insight
              </p>

              {/* Decorative Elements */}
              <div className="flex items-center gap-4 text-[#D4AF37]">
                <div className="h-px w-12 bg-[#D4AF37]"></div>
                <svg
                  className="w-8 h-8"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M12 3v18M8 6l-4 4v4h8V10l-4-4zM16 6l4 4v4h-8V10l4-4z" />
                  <circle cx="6" cy="14" r="3" />
                  <circle cx="18" cy="14" r="3" />
                </svg>
                <div className="h-px w-12 bg-[#D4AF37]"></div>
              </div>

              {/* Additional Info */}
              <div className="mt-12 text-sm text-gray-400">
                <p>Trusted Legal & Real Estate Solutions</p>
                <p className="mt-1">Est. 2024</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// used in logo
const BackgroundIcons = () => (
  <div className="absolute inset-0 opacity-5 overflow-hidden">
    {/* Scales of Justice - Top Left */}
    <svg
      className="absolute top-10 left-10 w-32 h-32 text-[#D4AF37]"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="0.5"
    >
      <path d="M12 3v18M8 6l-4 4v4h8V10l-4-4zM16 6l4 4v4h-8V10l4-4z" />
      <circle cx="6" cy="14" r="3" />
      <circle cx="18" cy="14" r="3" />
    </svg>

    {/* Building - Top Right */}
    <svg
      className="absolute top-20 right-16 w-24 h-24 text-[#D4AF37]"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="0.5"
    >
      <rect x="4" y="4" width="16" height="18" />
      <rect x="7" y="8" width="2" height="2" fill="currentColor" />
      <rect x="11" y="8" width="2" height="2" fill="currentColor" />
      <rect x="15" y="8" width="2" height="2" fill="currentColor" />
      <rect x="7" y="12" width="2" height="2" fill="currentColor" />
      <rect x="11" y="12" width="2" height="2" fill="currentColor" />
      <rect x="15" y="12" width="2" height="2" fill="currentColor" />
      <rect x="7" y="16" width="2" height="2" fill="currentColor" />
      <rect x="15" y="16" width="2" height="2" fill="currentColor" />
      <rect x="11" y="18" width="2" height="4" />
    </svg>

    {/* Gavel - Middle Left */}
    <svg
      className="absolute top-1/2 left-20 w-28 h-28 text-[#D4AF37] -rotate-45"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="0.5"
    >
      <rect x="14" y="3" width="3" height="8" />
      <rect x="12" y="10" width="7" height="3" />
      <path d="M3 21h8" strokeWidth="1" />
      <circle cx="7" cy="19" r="2" fill="currentColor" />
    </svg>

    {/* Key - Bottom Right */}
    <svg
      className="absolute bottom-20 right-10 w-28 h-28 text-[#D4AF37]"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="0.5"
    >
      <circle cx="7" cy="7" r="4" />
      <path d="M7 11l10 10M13 17l2-2M17 21l2-2" />
    </svg>

    {/* Document - Bottom Left */}
    <svg
      className="absolute bottom-16 left-16 w-24 h-24 text-[#D4AF37]"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="0.5"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="8" y1="13" x2="16" y2="13" />
      <line x1="8" y1="17" x2="16" y2="17" />
    </svg>

    {/* House - Center */}
    <svg
      className="absolute top-1/3 right-1/3 w-32 h-32 text-[#D4AF37]"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="0.5"
    >
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  </div>
);
