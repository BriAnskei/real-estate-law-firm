import React from "react";

interface CaseTransactionLoaderProps {
  isLoading?: boolean;
  loadingText?: string;
}

const CaseTransactionLoader: React.FC<CaseTransactionLoaderProps> = ({
  isLoading = true,
  loadingText = "Initializing case transaction...",
}) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white dark:bg-gray-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="case-grid"
              width="50"
              height="50"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 0 0 L 50 0 M 0 0 L 0 50"
                stroke="#D4AF37"
                strokeWidth="0.5"
                fill="none"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#case-grid)" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative flex flex-col items-center">
        {/* ANINO Logo */}
        <div className="mb-8 animate-pulse">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-2">
            ANINO
          </h1>
          <div className="h-1 w-24 bg-[#D4AF37] mx-auto"></div>
        </div>

        {/* Loading Text */}
        <h2 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">
          {loadingText}
        </h2>

        {/* Animated Dots Loader */}
        <div className="flex items-center justify-center space-x-2">
          <div
            className="w-3 h-3 bg-[#D4AF37] rounded-full animate-bounce"
            style={{ animationDelay: "0ms" }}
          ></div>
          <div
            className="w-3 h-3 bg-[#D4AF37] rounded-full animate-bounce"
            style={{ animationDelay: "150ms" }}
          ></div>
          <div
            className="w-3 h-3 bg-[#D4AF37] rounded-full animate-bounce"
            style={{ animationDelay: "300ms" }}
          ></div>
        </div>

        {/* Brand tagline */}
        <p className="mt-8 text-sm text-gray-500 dark:text-gray-400">
          ANINO Law Firm & Real Estate Consultancy
        </p>
      </div>
    </div>
  );
};

export default CaseTransactionLoader;
