import { X, ChevronDown } from "lucide-react";
import { useState } from "react";

type AddTaskModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (taskData: TaskFormData) => void;
  taskType: "requirements" | "documents" | "hearings";
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
  taskType,
}: AddTaskModalProps) {
  // Mock users - replace with actual users from your API
  const mockUsers = [
    { id: "1", name: "John Doe", role: "lawyer" },
    { id: "2", name: "Jane Smith", role: "paralegal" },
    { id: "3", name: "Mike Johnson", role: "lawyer" },
    { id: "4", name: "Sarah Williams", role: "process-server" },
    { id: "5", name: "Robert Brown", role: "paralegal" },
    { id: "6", name: "Emily Davis", role: "lawyer" },
  ];

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  // Filter users based on selected role and name input
  const filteredUsers = mockUsers.filter(
    (user) =>
      user.role === selectedRole &&
      user.name.toLowerCase().includes(nameInput.toLowerCase())
  );

  const getTaskTypeLabel = () => {
    switch (taskType) {
      case "requirements":
        return "Case Requirement";
      case "documents":
        return "Legal Document";
      case "hearings":
        return "Hearing/Case Proper";
      default:
        return "Task";
    }
  };

  const handleSubmit = () => {
    if (
      !title ||
      !description ||
      !selectedRole ||
      !selectedUserId ||
      !dueDate
    ) {
      alert("Please fill in all required fields");
      return;
    }

    const taskData: TaskFormData = {
      title,
      description,
      role: selectedRole,
      assignTo: selectedUserId,
      assignToName: nameInput,
      dueDate,
    };

    onSubmit(taskData);
  };

  const handleUserSelect = (user: {
    id: string;
    name: string;
    role: string;
  }) => {
    setSelectedUserId(user.id);
    setNameInput(user.name);
    setShowDropdown(false);
  };

  const handleRoleChange = (value: string) => {
    setSelectedRole(value);
    setNameInput("");
    setSelectedUserId("");
  };

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
                Create a new {getTaskTypeLabel().toLowerCase()} task
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
                value={title}
                onChange={(e) => setTitle(e.target.value)}
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
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="Provide detailed description of the task"
                className="w-full rounded-lg border-2 border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-500 transition-all focus:border-[#D4AF37] focus:outline-none resize-none dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder-gray-400"
              />
            </div>

            <div className="h-px w-full bg-gray-200 dark:bg-gray-700"></div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Role <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedRole}
                onChange={(e) => handleRoleChange(e.target.value)}
                className="w-full rounded-lg border-2 border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 transition-all focus:border-[#D4AF37] focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white cursor-pointer"
              >
                <option value="">Select a role</option>
                <option value="lawyer">Lawyer</option>
                <option value="paralegal">Paralegal</option>
                <option value="process-server">Process Server</option>
              </select>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Choose the role for this task assignment
              </p>
            </div>

            {/* Assign To - Name Input with Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Assign To <span className="text-red-500">*</span>
              </label>
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
                    // Delay to allow clicking dropdown items
                    setTimeout(() => setShowDropdown(false), 200);
                  }}
                  placeholder={
                    selectedRole
                      ? "Type to search users..."
                      : "Select a role first"
                  }
                  disabled={!selectedRole}
                  className="w-full rounded-lg border-2 border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-500 transition-all focus:border-[#D4AF37] focus:outline-none disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder-gray-400 dark:disabled:bg-gray-800"
                />
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />

                {/* Dropdown List */}
                {showDropdown &&
                  selectedRole &&
                  nameInput &&
                  filteredUsers.length > 0 && (
                    <div className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-48 overflow-y-auto custom-scrollbar">
                      {filteredUsers.map((user) => (
                        <button
                          key={user.id}
                          type="button"
                          onClick={() => handleUserSelect(user)}
                          className="w-full px-4 py-3 text-left text-sm text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                        >
                          <div className="font-medium">{user.name}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                            {user.role.replace("-", " ")}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                {/* No Results Message */}
                {showDropdown &&
                  selectedRole &&
                  nameInput &&
                  filteredUsers.length === 0 && (
                    <div className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg shadow-lg px-4 py-3">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        No users found matching "{nameInput}"
                      </p>
                    </div>
                  )}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Type to search and select a user with the chosen role
              </p>
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Due Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
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
              onClick={handleSubmit}
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
