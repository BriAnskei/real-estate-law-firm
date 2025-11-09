import React from "react";

interface LogoProps {
  variant?: "full" | "icon";
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  variant = "full",
  className = "",
}) => {
  if (variant === "icon") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 48 48"
        fill="none"
        className={`w-10 h-10 ${className}`}
      >
        <circle
          cx="24"
          cy="24"
          r="22"
          stroke="#D4AF37"
          strokeWidth="2"
          fill="none"
        />
        <path
          d="M24 10v28M16 16l-6 6v4h12v-4l-6-6zM32 16l6 6v4H26v-4l6-6z"
          stroke="#D4AF37"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="14" cy="30" r="3" stroke="#D4AF37" strokeWidth="1.5" />
        <circle cx="34" cy="30" r="3" stroke="#D4AF37" strokeWidth="1.5" />
      </svg>
    );
  }

  return (
    <div className={`flex flex-col ${className}`}>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        ANINO
      </h1>
      <div className="h-0.5 w-16 bg-[#D4AF37] my-1"></div>
      <p className="text-[10px] text-[#D4AF37] font-medium tracking-wide leading-tight">
        LAW FIRM & REAL ESTATE
        <br />
        CONSULTANCY
      </p>
    </div>
  );
};
