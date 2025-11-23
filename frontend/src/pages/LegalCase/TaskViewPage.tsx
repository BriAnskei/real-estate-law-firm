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
} from "lucide-react";
import { useNavigate, useParams } from "react-router";
import useTask from "../../hooks/case/ongoing/useTask";
import CaseTransactionLoader from "../../components/ui/loading/CaseTransactionLoader";

// Types
interface TaskData {
  id: string;
  title: string;
  description: string;
  stage_name: string;
  assigned_by: string;
  assigned_to: string;
  due_date: string;
  assigned_at: string;
  comments_count: number;
  status: string;
}

interface Comment {
  id: string;
  taskId: string;
  reviewer_id: string;
  reviewer_name: string;
  reviewer_role: string;
  content: string;
  reviewed_at: string;
}

interface UploadedFile {
  id: string;
  file: File;
  preview?: string;
}

interface ViewTaskProps {
  task: TaskData;
  comments: Comment[];
  formatDate: (dateString: string) => string;
  onBack: () => void;
  onSubmit: (files: File[]) => void;
  onAddComment: (content: string) => void;
  onFileUpload: (files: File[]) => void;
}

const ViewTask: React.FC<ViewTaskProps> = ({
  comments,
  formatDate,
  onBack,
  onSubmit,
  onAddComment,
  onFileUpload,
}) => {
  const { taskId } = useParams();

  const { task, loading } = useTask(taskId);

  const navigate = useNavigate();

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [commentText, setCommentText] = useState("");
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

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  if (loading || !task)
    return (
      <CaseTransactionLoader
        isLoading={loading || !task}
        loadingText="Initializing case task details..."
      />
    );

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <button
          onClick={() => navigate(-1)}
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
                  {formatDate(task.created_at!)}
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

// Mock data
const mockTask: TaskData = {
  id: "1",
  title: "Submit Client Affidavit",
  description:
    "Prepare and submit the sworn statement from the client regarding the incident. Ensure all facts are accurately represented and the document is properly notarized.",
  stage_name: "Case Requirements",
  assigned_by: "Atty. Maria Santos",
  assigned_to: "user123",
  due_date: "2025-11-30T00:00:00Z",
  assigned_at: "2025-11-20T10:30:00Z",
  comments_count: 3,
  status: "pending",
};

const mockComments: Comment[] = [
  {
    id: "c1",
    taskId: "1",
    reviewer_id: "r1",
    reviewer_name: "Atty. Maria Santos",
    reviewer_role: "Senior Attorney",
    content:
      "Please make sure the affidavit includes all relevant dates and witnesses. We need this to be as detailed as possible for the hearing.",
    reviewed_at: "2025-11-21T14:20:00Z",
  },
  {
    id: "c2",
    taskId: "1",
    reviewer_id: "r2",
    reviewer_name: "John Paralegal",
    reviewer_role: "Legal Assistant",
    content:
      "I've reviewed the draft. Looks good but needs notarization before final submission.",
    reviewed_at: "2025-11-22T09:15:00Z",
  },
];

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Main component with mock data
const ExampleViewTask = () => {
  return (
    <ViewTask
      task={mockTask}
      comments={mockComments}
      formatDate={formatDate}
      onBack={() => console.log("Back clicked")}
      onSubmit={(files) => console.log("Submit with files:", files)}
      onAddComment={(content) => console.log("New comment:", content)}
      onFileUpload={(files) => console.log("Files uploaded:", files)}
    />
  );
};

export default ExampleViewTask;
