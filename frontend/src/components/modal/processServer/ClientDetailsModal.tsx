import { X, User, Mail, Phone, MapPin } from "lucide-react";
import { ClientType } from "../../../store/Slice/client.slice";

interface ClientDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientData?: ClientType;
}

export default function ClientDetailsModal({
  isOpen,
  onClose,

  clientData,
}: ClientDetailsModalProps) {
  if (!isOpen) return null;

  if (!clientData) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Loading Container */}
        <div className="relative z-10 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border-2 border-gray-200 dark:border-gray-700 p-12">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 border-4 border-gray-200 dark:border-gray-700 border-t-[#D4AF37] rounded-full animate-spin" />
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Waiting for Client detials response...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative z-10 w-full max-w-3xl mx-4 animate-fadeIn">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border-2 border-gray-200 dark:border-gray-700 max-h-[90vh] overflow-y-auto custom-scrollbar">
          {/* Modal Header */}
          <div className="sticky top-0 bg-white dark:bg-gray-800 flex items-center justify-between border-b-2 border-gray-200 dark:border-gray-700 px-6 py-4 z-10">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Client Details
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                View complete client information
              </p>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-gray-500 transition-all hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="px-6 py-6 space-y-6">
            {/* Client Name Section */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <User className="h-5 w-5 text-[#D4AF37]" />
                <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">
                  Name
                </h4>
              </div>
              <p className="text-base font-medium text-gray-900 dark:text-white leading-relaxed">
                {clientData.client_name}
              </p>
            </div>

            <div className="h-px w-full bg-gradient-to-r from-[#D4AF37] via-[#D4AF37]/50 to-transparent"></div>

            {/* Email and Contact Number in Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Email */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Mail className="h-5 w-5 text-[#D4AF37]" />
                  <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">
                    Email
                  </h4>
                </div>
                <p className="text-base text-gray-900 dark:text-white break-words">
                  {clientData.email}
                </p>
              </div>

              {/* Contact Number */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Phone className="h-5 w-5 text-[#D4AF37]" />
                  <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">
                    Contact Number
                  </h4>
                </div>
                <p className="text-base text-gray-900 dark:text-white">
                  {clientData.contact_number}
                </p>
              </div>
            </div>

            <div className="h-px w-full bg-gradient-to-r from-[#D4AF37] via-[#D4AF37]/50 to-transparent"></div>

            {/* Address Section */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="h-5 w-5 text-[#D4AF37]" />
                <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">
                  Address
                </h4>
              </div>
              <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300">
                {clientData.address}
              </p>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="sticky bottom-0 bg-white dark:bg-gray-800 flex items-center justify-end gap-3 border-t-2 border-gray-200 dark:border-gray-700 px-6 py-4">
            <button
              onClick={onClose}
              className="rounded-lg bg-[#D4AF37] px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-[#C4A037] active:scale-95"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        /* Custom Scrollbar Styling */
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
          transition: background 0.3s ease;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }

        /* Dark mode scrollbar */
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #4b5563;
        }

        .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #6b7280;
        }

        /* Firefox scrollbar */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #cbd5e1 transparent;
        }

        .dark .custom-scrollbar {
          scrollbar-color: #4b5563 transparent;
        }
      `}</style>
    </div>
  );
}
