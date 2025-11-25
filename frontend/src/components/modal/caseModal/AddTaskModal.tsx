import { X, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Roles, UserType } from "../../../store/Slice/userSlice";
import { TaskFormType } from "../../../hooks/case/ongoing/useCaseTransaction";

type AddTaskModalProps = {
  isOpen: boolean;
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

export type TaskFormData = {
  title: string;
  description: string;
  role: string;
  assignTo: string;
  assignToName: string;
  dueDate: string;
};

export function AddTaskModal({
  isOpen,
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
}: AddTaskModalProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-lg mx-4 animate-fadeIn">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border-2 border-gray-200 dark:border-gray-700 max-h-[90vh] overflow-y-auto custom-scrollbar">
          {/* Modal Header */}
          <div className="flex items-center justify-between border-b-2 border-gray-200 dark:border-gray-700 px-6 py-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Add New Task
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Create a new {taskTypeLabel.toLowerCase()} task
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
          <div className="px-6 py-6 space-y-5">
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

            {/* Assign To - Name Input with Dropdown */}
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

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-3 border-t-2 border-gray-200 dark:border-gray-700 px-6 py-4">
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
