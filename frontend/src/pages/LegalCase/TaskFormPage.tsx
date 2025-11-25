import { X, ChevronDown, ArrowLeft, Upload, FileText } from "lucide-react";
import { useState, useRef } from "react";
import { TaskFormType } from "../../hooks/case/ongoing/useCaseTransaction";
import { UserType, Roles } from "../../store/Slice/userSlice";

type AddTaskPageProps = {
  onClose: () => void;
  onSubmit: () => void;
  // header text
  taskTypeLabel: string;

  isSelectionRoleEnabled?: boolean;
  RolesOption: {
    value: string;
    text: string;
  }[];

  // data
  selectedUsersByRole: UserType[] | undefined;
  fetchLoading: boolean;

  // input
  taskInput: TaskFormType;
  taskInputOnchangeHandler: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  setSelectedRole: React.Dispatch<
    React.SetStateAction<
      Roles.lawyer | Roles.paralegal | Roles.processServer | undefined
    >
  >;
  selectedRole:
    | Roles.lawyer
    | Roles.paralegal
    | Roles.processServer
    | undefined;

  handleSelectAssignedUser: (payload: { userId: string; name: string }) => void;
  setNameInput: (query: string) => void;
  nameInput: string;
};

interface UploadedFile {
  id: string;
  file: File;
}

export default function TaskFormPage({
  onClose,
  onSubmit,
  taskTypeLabel,
  isSelectionRoleEnabled = true,
  RolesOption,
  selectedUsersByRole,
  fetchLoading,
  taskInput,
  setSelectedRole,
  selectedRole,
  taskInputOnchangeHandler,
  handleSelectAssignedUser,
  setNameInput,
  nameInput,
}: AddTaskPageProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files).filter(
      (file) => file.type === "application/pdf"
    );

    if (files.length > 0) {
      addFiles(files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length > 0) {
      addFiles(files);
    }
  };

  const addFiles = (files: File[]) => {
    const newFiles = files.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
    }));
    setUploadedFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 
            hover:text-[#D4AF37] dark:hover:text-[#D4AF37] transition-colors mb-6"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="text-sm font-medium">Back</span>
        </button>

        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Add New Task
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Create a new {taskTypeLabel.toLowerCase()} task
          </p>
        </div>

        {/* Task Details Section */}
        <div className="rounded-lg border-2 border-gray-200 bg-white p-8 dark:border-gray-700 dark:bg-gray-800 mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            Task Details
          </h2>

          <div className="space-y-5">
            {/* Task Title */}
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Task Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={taskInput.title}
                onChange={taskInputOnchangeHandler}
                placeholder="Enter task title"
                className="w-full rounded-lg border-2 border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-500 transition-all focus:border-[#D4AF37] focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder-gray-400"
              />
            </div>

            {/* Task Description */}
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={taskInput.description}
                onChange={taskInputOnchangeHandler}
                rows={4}
                placeholder="Provide detailed description of the task"
                className="w-full rounded-lg border-2 border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-500 transition-all focus:border-[#D4AF37] focus:outline-none resize-none dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder-gray-400"
              />
            </div>

            <div className="h-px w-full bg-gray-200 dark:bg-gray-700"></div>

            {/* Role and Due Date - Side by Side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Role Selection - Only shown when isSelectionRoleEnabled is true */}
              {isSelectionRoleEnabled && (
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Role <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value as any)}
                    className="w-full rounded-lg border-2 border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 transition-all focus:border-[#D4AF37] focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white cursor-pointer"
                  >
                    <option value="">Select a role</option>
                    {RolesOption &&
                      RolesOption.map((option, index) => (
                        <option key={index} value={option.value}>
                          {option.text}
                        </option>
                      ))}
                  </select>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Choose the role for this task assignment
                  </p>
                </div>
              )}

              {/* Due Date */}
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Due Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="due_date"
                  value={taskInput.due_date}
                  onChange={taskInputOnchangeHandler}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full rounded-lg border-2 border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 transition-all focus:border-[#D4AF37] focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Set the deadline for task completion
                </p>
              </div>
            </div>

            {/* Assign To - Full Width */}
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Assign To <span className="text-red-500">*</span>
              </label>

              {/* Loading Skeleton */}
              {fetchLoading ? (
                <div className="w-full rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 px-4 py-3 animate-pulse">
                  <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
                </div>
              ) : (
                <div className="relative">
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => {
                      setNameInput(e.target.value);
                      setShowDropdown(true);
                    }}
                    onFocus={() => setShowDropdown(true)}
                    onBlur={() => {
                      setTimeout(() => setShowDropdown(false), 200);
                    }}
                    placeholder={
                      !isSelectionRoleEnabled
                        ? "Type to search users..."
                        : selectedRole
                        ? "Type to search users..."
                        : "Select a role first"
                    }
                    disabled={isSelectionRoleEnabled && !selectedRole}
                    className="w-full rounded-lg border-2 border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-500 transition-all focus:border-[#D4AF37] focus:outline-none disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder-gray-400 dark:disabled:bg-gray-800"
                  />
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />

                  {/* Dropdown List */}
                  {showDropdown &&
                    (!isSelectionRoleEnabled ||
                      (isSelectionRoleEnabled && selectedRole)) &&
                    selectedUsersByRole && (
                      <div className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg shadow-lg min-h-[180px] max-h-48 overflow-y-auto custom-scrollbar">
                        {selectedUsersByRole?.map((user) => (
                          <button
                            key={user.id}
                            type="button"
                            className="w-full px-4 py-3 text-left text-sm text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                            onClick={() =>
                              handleSelectAssignedUser({
                                userId: user.id?.toString()!,
                                name: `${user.firstName}  ${user.lastName}`,
                              })
                            }
                          >
                            <div className="font-medium">{`${user.firstName} ${user.lastName}`}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                              {user.role.replace("-", " ")}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}

                  {/* No Results Message */}
                  {showDropdown &&
                    (!isSelectionRoleEnabled ||
                      (isSelectionRoleEnabled && selectedRole)) &&
                    selectedUsersByRole?.length === 0 && (
                      <div className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg shadow-lg px-4 py-3">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          No users found matching "{nameInput}"
                        </p>
                      </div>
                    )}
                </div>
              )}

              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                {!isSelectionRoleEnabled
                  ? "Type to search and select a process server"
                  : "Type to search and select a user with the chosen role"}
              </p>
            </div>
          </div>
        </div>

        {/* File Upload Section */}
        <div className="rounded-lg border-2 border-gray-200 bg-white p-8 dark:border-gray-700 dark:bg-gray-800 mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Attach Documents (Optional)
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            Upload PDF files for this task
          </p>

          <div
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`transition border-2 border-dashed cursor-pointer rounded-xl hover:border-[#D4AF37] dark:hover:border-[#D4AF37] mb-6 ${
              isDragging
                ? "border-[#D4AF37] bg-gray-100 dark:bg-gray-800 dark:border-[#D4AF37]"
                : "border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              multiple
              onChange={handleFileInputChange}
              className="hidden"
            />
            <div className="p-7 lg:p-10">
              <div className="flex flex-col items-center m-0">
                <div className="mb-5 flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-400">
                    <Upload className="h-7 w-7" />
                  </div>
                </div>
                <h4 className="mb-3 font-semibold text-gray-800 text-lg dark:text-white/90">
                  {isDragging
                    ? "Drop PDF Files Here"
                    : "Drag & Drop PDF Files Here"}
                </h4>
                <span className="text-center mb-5 block w-full max-w-[290px] text-sm text-gray-700 dark:text-gray-400">
                  Drag and drop your PDF files here or browse
                </span>
                <span className="font-medium underline text-sm text-[#D4AF37]">
                  Browse File
                </span>
              </div>
            </div>
          </div>

          {/* Uploaded Files List */}
          {uploadedFiles.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                UPLOADED FILES ({uploadedFiles.length})
              </h3>
              {uploadedFiles.map((uploadedFile) => (
                <div
                  key={uploadedFile.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 hover:border-[#D4AF37] dark:hover:border-[#D4AF37] transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded bg-red-100 dark:bg-red-900/30">
                      <FileText className="h-5 w-5 text-red-600 dark:text-red-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {uploadedFile.file.name}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {formatFileSize(uploadedFile.file.size)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(uploadedFile.id);
                    }}
                    className="flex-shrink-0 ml-3 p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border-2 border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition-all hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-gray-600 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSubmit}
            className="rounded-lg bg-[#D4AF37] px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-[#C4A037] active:scale-95"
          >
            Create Task
          </button>
        </div>
      </div>

      <style>{`
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

        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #4b5563;
        }

        .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #6b7280;
        }

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
