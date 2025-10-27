import type React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  success?: boolean;
  error?: boolean;
  hint?: string;
}

const Input: React.FC<InputProps> = ({
  className = "",
  success = false,
  error = false,
  hint,
  disabled = false,
  ...props
}) => {
  // Base classes with your gold theme
  let inputClasses = `h-11 w-full rounded-lg border appearance-none px-4 py-3 text-sm placeholder:text-gray-400 outline-none transition-all dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500`;

  // State-based styling
  if (disabled) {
    inputClasses += ` text-gray-500 border-gray-300 opacity-40 bg-gray-100 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600`;
  } else if (error) {
    inputClasses += ` border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 dark:border-red-500 dark:focus:border-red-400`;
  } else if (success) {
    inputClasses += ` border-green-500 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 dark:border-green-500 dark:focus:border-green-400`;
  } else {
    inputClasses += ` bg-white border-gray-300 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 dark:bg-gray-800 dark:border-gray-700 dark:focus:border-[#D4AF37]`;
  }

  // Add custom className
  inputClasses += ` ${className}`;

  return (
    <div className="relative">
      <input className={inputClasses} disabled={disabled} {...props} />

      {hint && (
        <p
          className={`mt-1.5 text-xs ${
            error
              ? "text-red-500 dark:text-red-400"
              : success
              ? "text-green-500 dark:text-green-400"
              : "text-gray-500 dark:text-gray-400"
          }`}
        >
          {hint}
        </p>
      )}
    </div>
  );
};

export default Input;
