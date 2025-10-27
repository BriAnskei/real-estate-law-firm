import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode; // Button text or content
  size?: "sm" | "md"; // Button size
  variant?: "primary" | "outline"; // Button variant
  startIcon?: ReactNode; // Icon before the text
  endIcon?: ReactNode; // Icon after the text
  onClick?: () => void; // Click handler
  disabled?: boolean; // Disabled state
  className?: string; // Additional classes
}

const Button: React.FC<ButtonProps> = ({
  children,
  size = "md",
  variant = "primary",
  startIcon,
  endIcon,
  onClick,
  className = "",
  disabled = false,
}) => {
  // Size Classes
  const sizeClasses = {
    sm: "px-4 py-3 text-sm",
    md: "px-5 py-3.5 text-sm",
  };

  // Variant Classes - Updated with AuthLayout theme (Gold & Black)
  const variantClasses = {
    primary:
      "bg-[#D4AF37] text-black font-medium shadow-lg hover:bg-[#C19B2B] disabled:bg-[#D4AF37]/50 disabled:text-black/50 dark:bg-[#D4AF37] dark:text-black dark:hover:bg-[#E5C158]",
    outline:
      "bg-transparent text-[#D4AF37] ring-2 ring-inset ring-[#D4AF37] hover:bg-[#D4AF37] hover:text-black dark:bg-transparent dark:text-[#D4AF37] dark:ring-[#D4AF37] dark:hover:bg-[#D4AF37] dark:hover:text-black",
  };

  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-lg transition-all duration-300 ${className} ${
        sizeClasses[size]
      } ${variantClasses[variant]} ${
        disabled ? "cursor-not-allowed opacity-50" : ""
      }`}
      onClick={onClick}
      disabled={disabled}
    >
      {startIcon && <span className="flex items-center">{startIcon}</span>}
      {children}
      {endIcon && <span className="flex items-center">{endIcon}</span>}
    </button>
  );
};

export default Button;
