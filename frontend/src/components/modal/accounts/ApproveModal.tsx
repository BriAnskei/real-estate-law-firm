import { CheckCircle, X, User, Mail, UserCog } from "lucide-react";
import Button from "../../ui/button/Button";

type Roles =
  | "founding-manager/admin"
  | "lawyer"
  | "paralegal"
  | "process-server";

interface RegistrationRequest {
  id?: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Roles;
}

interface ApproveRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  registrationData: RegistrationRequest;
  onApprove: (id: string) => void;
  isLoading?: boolean;
}

export default function ApproveRegistrationModal({
  isOpen,
  onClose,
  registrationData,
  onApprove,
  isLoading = false,
}: ApproveRegistrationModalProps) {
  if (!isOpen) return null;

  const handleApprove = () => {
    if (registrationData.id) {
      onApprove(registrationData.id);
    }
  };

  const formatRole = (role: Roles): string => {
    const roleMap: Record<Roles, string> = {
      "founding-manager/admin": "Founding Manager/Admin",
      lawyer: "Lawyer/Attorney",
      paralegal: "Paralegal",
      "process-server": "Process Server",
    };
    return roleMap[role] || role;
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 
        transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="relative w-full max-w-lg bg-white dark:bg-gray-900 
            rounded-2xl shadow-2xl transform transition-all duration-300 scale-100 pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#D4AF37] bg-opacity-10">
                <CheckCircle className="w-6 h-6 text-green-900" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Approve Registration
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 
                transition-colors"
              disabled={isLoading}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-5 space-y-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              You are about to approve the following registration request. This
              will grant the user access to the system.
            </p>

            {/* User Details */}
            <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              {/* Name */}
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Full Name
                  </p>
                  <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                    {registrationData.firstName} {registrationData.lastName}
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Email Address
                  </p>
                  <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white break-all">
                    {registrationData.email}
                  </p>
                </div>
              </div>

              {/* Role */}
              <div className="flex items-start gap-3">
                <UserCog className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Role
                  </p>
                  <div className="mt-1">
                    <span className="inline-flex items-center px-3 py-1 text-sm font-medium text-gray-900 bg-[#D4AF37] bg-opacity-10 rounded-full">
                      {formatRole(registrationData.role)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Warning */}
            <div className="flex gap-3 p-4 bg-amber-50 dark:bg-amber-900 dark:bg-opacity-20 border border-amber-200 dark:border-amber-800 rounded-lg">
              <div className="flex-shrink-0">
                <svg
                  className="w-5 h-5 text-amber-600 dark:text-amber-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <p className="text-sm text-amber-800 dark:text-amber-200">
                Once approved, the user will gain access to the system with the
                assigned role. This action cannot be undone unless the user is
                later removed.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 bg-gray-50 dark:bg-gray-800/50 rounded-b-2xl border-t border-gray-200 dark:border-gray-800">
            <button
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-medium text-gray-700 
                bg-white border border-gray-300 rounded-lg hover:bg-gray-100 
                dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700
                dark:hover:bg-gray-700 transition-all duration-300 focus:outline-none 
                focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 
                dark:focus:ring-offset-gray-900"
              disabled={isLoading}
            >
              Cancel
            </button>
            <Button
              onClick={handleApprove}
              className="px-4 py-2.5 text-sm font-medium text-white 
                bg-[#D4AF37] hover:bg-[#C4A037] rounded-lg 
                transition-all duration-300 disabled:opacity-50 
                disabled:cursor-not-allowed focus:outline-none focus:ring-2 
                focus:ring-[#D4AF37] focus:ring-offset-2 
                dark:focus:ring-offset-gray-900"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Approving...
                </span>
              ) : (
                "Approve Registration"
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
