import { X } from "lucide-react";
import React, { useState } from "react";

interface AddCaseModalProp {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function AddCaseModal({
  isOpen,
  onClose,
  onSubmit,
}: AddCaseModalProp) {
  const [formData, setFormData] = useState({
    concern: "",
    description: "",
    clientName: "",
    contactNumber: "",
    email: "",
    address: "",
  });

  if (!isOpen) return null;

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    // Validation
    if (!formData.concern || !formData.description || !formData.clientName) {
      alert("Please fill in all required fields");
      return;
    }

    onSubmit(formData);

    // Reset form
    setFormData({
      concern: "",
      description: "",
      clientName: "",
      contactNumber: "",
      email: "",
      address: "",
    });
  };

  const handleClose = () => {
    setFormData({
      concern: "",
      description: "",
      clientName: "",
      contactNumber: "",
      email: "",
      address: "",
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center
     bg-black/50 p-4"
    >
      <div
        className="relative w-full max-w-2xl bg-white dark:bg-gray-800
       rounded-lg shadow-xl max-h-[90vh] overflow-y-auto"
      >
        {/* Modal Header */}
        <div
          className="sticky top-0 bg-white dark:bg-gray-800 flex 
        items-center justify-between border-b-2 border-gray-200 
        dark:border-gray-700 px-6 py-4 z-10"
        >
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Add New Case
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Enter consultation case details
            </p>
          </div>
          <button
            onClick={handleClose}
            className="rounded-lg p-2 text-gray-500 transition-all
             hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400
              dark:hover:bg-gray-700 dark:hover:text-gray-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="px-6 py-6 space-y-5">
          {/* Concern */}
          <div>
            <label
              className="block text-sm font-medium text-gray-900
             dark:text-white mb-2"
            >
              Case Concern <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="concern"
              value={formData.concern}
              onChange={handleChange}
              placeholder="Enter case concern"
              className="w-full rounded-lg border-2 border-gray-200 bg-white
               px-4 py-3 text-sm text-gray-900 transition-all 
               focus:border-[#D4AF37] focus:outline-none dark:border-gray-700
                dark:bg-gray-900 dark:text-white dark:focus:border-[#D4AF37]"
            />
          </div>

          {/* Description */}
          <div>
            <label
              className="block text-sm font-medium text-gray-900
             dark:text-white mb-2"
            >
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter detailed description of the case"
              className="w-full rounded-lg border-2 border-gray-200
               bg-white px-4 py-3 text-sm text-gray-900 transition-all
                focus:border-[#D4AF37] focus:outline-none resize-none 
                dark:border-gray-700 dark:bg-gray-900 dark:text-whit
                e dark:focus:border-[#D4AF37]"
            />
          </div>

          <div className="h-px w-full bg-gray-200 dark:bg-gray-700"></div>

          {/* Client Information */}
          <div>
            <h4 className="text-base font-bold text-gray-900 dark:text-white mb-4">
              Client Information
            </h4>

            <div className="space-y-4">
              {/* Client Name */}
              <div>
                <label
                  className="block text-sm font-medium text-gray-900
                 dark:text-white mb-2"
                >
                  Client Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleChange}
                  placeholder="Enter client full name"
                  className="w-full rounded-lg border-2 border-gray-200 
                  bg-white px-4 py-3 text-sm text-gray-900 transition-all
                   focus:border-[#D4AF37] focus:outline-none 
                   dark:border-gray-700 dark:bg-gray-900 dark:text-whit
                   e dark:focus:border-[#D4AF37]"
                />
              </div>

              {/* Contact Number and Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    className="block text-sm font-medium text-gray-900
                   dark:text-white mb-2"
                  >
                    Contact Number
                  </label>
                  <input
                    type="tel"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    placeholder="Enter contact number"
                    className="w-full rounded-lg border-2 border-gray-200
                     bg-white px-4 py-3 text-sm text-gray-900 transition-all
                      focus:border-[#D4AF37] focus:outline-none
                       dark:border-gray-700 dark:bg-gray-900 dark:text-white
                        dark:focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label
                    className="block text-sm font-medium text-gray-900
                   dark:text-white mb-2"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email address"
                    className="w-full rounded-lg border-2 border-gray-200
                     bg-white px-4 py-3 text-sm text-gray-900 transition-all
                      focus:border-[#D4AF37] focus:outline-none 
                      dark:border-gray-700 dark:bg-gray-900 dark:text-white
                       dark:focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label
                  className="block text-sm font-medium text-gray-900
                 dark:text-white mb-2"
                >
                  Address
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter client address"
                  className="w-full rounded-lg border-2 border-gray-200
                   bg-white px-4 py-3 text-sm text-gray-900 transition-all
                    focus:border-[#D4AF37] focus:outline-none resize-none
                     dark:border-gray-700 dark:bg-gray-900 dark:text-white
                      dark:focus:border-[#D4AF37]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="sticky bottom-0 bg-white dark:bg-gray-800 flex items-center justify-end gap-3 border-t-2 border-gray-200 dark:border-gray-700 px-6 py-4">
          <button
            onClick={handleClose}
            className="rounded-lg border-2 border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition-all hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-gray-600 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="rounded-lg bg-[#D4AF37] px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-[#C4A037] active:scale-95"
          >
            Add Case
          </button>
        </div>
      </div>
    </div>
  );
}
