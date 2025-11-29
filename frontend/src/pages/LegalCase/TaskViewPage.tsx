import React, { useState, useRef, useEffect } from "react";
import {
  ArrowLeft,
  Calendar,
  MessageSquare,
  Clock,
  User,
  FileText,
  Upload,
  X,
  Send,
  Download,
  ExternalLink,
} from "lucide-react";

// Type definitions
interface ReferenceFile {
  id: string;
  name: string;
  size: string;
  uploaded: string;
  url?: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  due_date: string;
  status: "pending" | "approved" | "rejected";
  comments_count: number;
  stage_name: string;
  assigner_name: string;
  created_at: string;
  reference_files?: ReferenceFile[];
}

interface Comment {
  id: string;
  reviewer_name: string;
  reviewer_role: string;
  reviewed_at: string;
  content: string;
}

interface UploadedFile {
  id: string;
  file: File;
}

interface ViewTaskProps {
  task: Task;
  comments: Comment[];
  formatDate: (date: string) => string;
  onBack: () => void;
  onSubmit: (files: File[]) => void;
  onAddComment: (comment: string) => void;
  onFileUpload: (files: File[]) => void;
}

const ViewTask: React.FC<ViewTaskProps> = ({
  task,
  comments,
  formatDate,
  onBack,
  onSubmit,
  onAddComment,
  onFileUpload,
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [commentText, setCommentText] = useState<string>("");
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
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
    const newFiles: UploadedFile[] = files.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
    }));
    setUploadedFiles((prev) => [...prev, ...newFiles]);
    onFileUpload(files);
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const handleSubmit = () => {
    const files = uploadedFiles.map((f) => f.file);
    onSubmit(files);
  };

  const handleAddComment = () => {
    if (commentText.trim()) {
      onAddComment(commentText);
      setCommentText("");
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const handleDownloadAll = () => {
    console.log("Download all reference files");
    // Implementation: Download all reference files
  };

  const handleViewFile = (file: ReferenceFile) => {
    console.log("View file in new tab:", file.name);
    // Implementation: Open file URL in new tab
    if (file.url) {
      window.open(file.url, "_blank");
    }
  };

  const handleDownloadFile = (file: ReferenceFile) => {
    console.log("Download file:", file.name);
    // Implementation: Download individual file
  };

  useEffect(() => {
    console.log("task render: ", task);
  }, [task]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 
            hover:text-[#D4AF37] dark:hover:text-[#D4AF37] transition-colors mb-6"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="text-sm font-medium">Back to Tasks</span>
        </button>

        {/* Task Details Section */}
        <div className="rounded-lg border-2 border-gray-200 bg-white p-8 dark:border-gray-700 dark:bg-gray-800 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {task.title}
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  <span>Due: {formatDate(task.due_date)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MessageSquare className="h-4 w-4" />
                  <span>{task.comments_count} Comments</span>
                </div>
              </div>
            </div>
            <div
              className={`rounded-full px-4 py-2 text-sm font-medium ${
                task.status === "approved"
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  : task.status === "rejected"
                  ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                  : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
              }`}
            >
              {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
            </div>
          </div>

          <div className="h-px w-full bg-gradient-to-r from-[#D4AF37] via-[#D4AF37]/50 to-transparent mb-6"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
                STAGE
              </h3>
              <p className="text-base font-medium text-gray-900 dark:text-white">
                {task.stage_name}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
                ASSIGNED BY
              </h3>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                <p className="text-base font-medium text-gray-900 dark:text-white">
                  {task.assigner_name}
                </p>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
                ASSIGNED AT
              </h3>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                <p className="text-base text-gray-900 dark:text-white">
                  {formatDate(task.created_at)}
                </p>
              </div>
            </div>
          </div>

          <div className="h-px w-full bg-gradient-to-r from-[#D4AF37] via-[#D4AF37]/50 to-transparent mb-6"></div>

          <div>
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
              DESCRIPTION
            </h3>
            <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300">
              {task.description}
            </p>
          </div>
        </div>

        {/* Reference Documents Section */}
        {task.reference_files && task.reference_files.length > 0 && (
          <div className="rounded-lg border-2 border-gray-200 bg-white p-8 dark:border-gray-700 dark:bg-gray-800 mb-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Reference Documents
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Files provided by {task.assigner_name} for this task
                </p>
              </div>
              <button
                onClick={handleDownloadAll}
                className="flex items-center gap-2 rounded-lg bg-gray-200 dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-900 dark:text-white transition-all hover:bg-gray-300 dark:hover:bg-gray-600 active:scale-95"
              >
                <Download className="h-4 w-4" />
                Download All
              </button>
            </div>

            <div className="space-y-3">
              {task.reference_files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 hover:border-[#D4AF37] dark:hover:border-[#D4AF37] transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded bg-red-100 dark:bg-red-900/30">
                      <svg
                        className="h-5 w-5 text-red-600 dark:text-red-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {file.name}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
                        <span>{file.size}</span>
                        <span>•</span>
                        <span>Uploaded {file.uploaded}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-3">
                    <button
                      onClick={() => handleViewFile(file)}
                      className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-[#D4AF37] dark:hover:text-[#D4AF37] transition-colors"
                      title="View in new tab"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDownloadFile(file)}
                      className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-[#D4AF37] dark:hover:text-[#D4AF37] transition-colors"
                      title="Download"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* File Upload Section */}
        <div className="rounded-lg border-2 border-gray-200 bg-white p-8 dark:border-gray-700 dark:bg-gray-800 mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Submit Documents
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

          {/* Submit Button */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={uploadedFiles.length === 0}
              className="flex items-center gap-2 rounded-lg bg-[#D4AF37] px-6 py-3 text-sm font-medium text-white transition-all hover:bg-[#C4A037] active:scale-95 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#D4AF37]"
            >
              <Upload className="h-4 w-4" />
              Submit Task
            </button>
          </div>
        </div>

        {/* Comments Section */}
        <div className="rounded-lg border-2 border-gray-200 bg-white p-8 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            Comments ({comments.length})
          </h2>

          {/* Comments List */}
          <div className="space-y-4 mb-6">
            {comments.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  No comments yet. Be the first to comment!
                </p>
              </div>
            ) : (
              comments.map((comment) => (
                <div
                  key={comment.id}
                  className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#D4AF37]/20 text-[#D4AF37]">
                        <User className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          {comment.reviewer_name}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {comment.reviewer_role}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      {formatDate(comment.reviewed_at)}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300 ml-13">
                    {comment.content}
                  </p>
                </div>
              ))
            )}
          </div>

          {/* Add Comment Form */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">
              ADD A COMMENT
            </h3>
            <div className="flex gap-3">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write your comment here..."
                className="flex-1 min-h-[100px] px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent resize-none"
              />
              <button
                onClick={handleAddComment}
                disabled={!commentText.trim()}
                className="self-end flex items-center gap-2 rounded-lg bg-[#D4AF37] px-6 py-3 text-sm font-medium text-white transition-all hover:bg-[#C4A037] active:scale-95 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#D4AF37]"
              >
                <Send className="h-4 w-4" />
                Post
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Demo wrapper with mock data
const Demo: React.FC = () => {
  const mockTask: Task = {
    id: "task-001",
    title: "Q4 Financial Report Review",
    description:
      "Please review the Q4 financial statements and provide feedback on the revenue projections, expense allocations, and cash flow analysis. Pay special attention to the discrepancies noted in the Southeast region. Your approval is required before we can proceed with the board presentation.",
    due_date: "2024-12-15T23:59:59Z",
    status: "pending",
    comments_count: 3,
    stage_name: "Financial Review",
    assigner_name: "Sarah Johnson",
    created_at: "2024-11-20T10:30:00Z",
    reference_files: [
      {
        id: "file-001",
        name: "Q4_Financial_Statements.pdf",
        size: "2.4 MB",
        uploaded: "2 days ago",
        url: "https://example.com/file1.pdf",
      },
      {
        id: "file-002",
        name: "Revenue_Analysis_2024.pdf",
        size: "1.8 MB",
        uploaded: "2 days ago",
        url: "https://example.com/file2.pdf",
      },
      {
        id: "file-003",
        name: "Budget_Variance_Report.pdf",
        size: "896 KB",
        uploaded: "3 days ago",
        url: "https://example.com/file3.pdf",
      },
    ],
  };

  const mockComments: Comment[] = [
    {
      id: "comment-001",
      reviewer_name: "Michael Chen",
      reviewer_role: "Senior Financial Analyst",
      reviewed_at: "2024-11-25T14:20:00Z",
      content:
        "I've reviewed the initial drafts. The revenue projections look solid, but we need more detail on the marketing expenses breakdown. Could you provide additional documentation?",
    },
    {
      id: "comment-002",
      reviewer_name: "Sarah Johnson",
      reviewer_role: "Finance Director",
      reviewed_at: "2024-11-26T09:15:00Z",
      content:
        "Thanks Michael. I'll upload the marketing expense breakdown by EOD. Also noting that we should schedule a meeting to discuss the Southeast region discrepancies.",
    },
    {
      id: "comment-003",
      reviewer_name: "Emily Rodriguez",
      reviewer_role: "CFO",
      reviewed_at: "2024-11-27T11:30:00Z",
      content:
        "Good progress team. Once the marketing breakdown is added and Michael approves, we can move forward with the board presentation prep.",
    },
  ];

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleBack = () => {
    console.log("Navigate back to tasks list");
  };

  const handleSubmit = (files: File[]) => {
    console.log("Submitting task with files:", files);
    alert(`Task submitted with ${files.length} file(s)!`);
  };

  const handleAddComment = (comment: string) => {
    console.log("Adding comment:", comment);
    alert("Comment posted successfully!");
  };

  const handleFileUpload = (files: File[]) => {
    console.log("Files uploaded:", files);
  };

  return (
    <ViewTask
      task={mockTask}
      comments={mockComments}
      formatDate={formatDate}
      onBack={handleBack}
      onSubmit={handleSubmit}
      onAddComment={handleAddComment}
      onFileUpload={handleFileUpload}
    />
  );
};

export default Demo;
