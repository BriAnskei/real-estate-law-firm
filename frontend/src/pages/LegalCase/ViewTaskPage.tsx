import React, { useState, useRef, useEffect, useCallback } from "react";
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
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import useViewTask from "../../hooks/case/ongoing/useViewTask";
import CaseTransactionLoader from "../../components/ui/loading/CaseTransactionLoader";
import { MarkCompleteModal } from "../../components/modal/caseModal/MarkCompleteModal";

export default function ViewTaskPage() {
  const {
    goBack,
    loading,
    taskData,
    referenceFiles,
    handleDownloadAll,
    handleViewFile,
    handleDownloadFile,
    formatDate,
    isAssignersUser,
    markTaskAsComplete,

    // file uploads
    uploadedFiles,
    addFiles,
    removeFile,
    formatFileSize,
    isThereFilesUploaded,

    // file submission
    submitFiles,

    // review states
    taskReviews,
    addNewReview,
    reviewCommentInputOnChange,
    commentInput,
    commentsEndRef,

    //modal
    open,
    close,
    isOpen,
    markingLoading,
  } = useViewTask();

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

  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case "complete":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";

      case "pending":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
    }
  }, []);

  const getStatusIcon = useCallback((status: string) => {
    switch (status) {
      case "complete":
        return <CheckCircle className="h-4 w-4" />;
      case "pending":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  }, []);

  if (loading || !taskData) {
    return (
      <CaseTransactionLoader
        loadingText="Initializing task data"
        isLoading={loading || !taskData}
      />
    );
  }

  return (
    <>
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Header */}
          <button
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 
            hover:text-[#D4AF37] dark:hover:text-[#D4AF37] transition-colors mb-6"
            onClick={goBack}
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm font-medium">Back to Tasks</span>
          </button>

          {/* Task Details Section */}
          <div className="rounded-lg border-2 border-gray-200 bg-white p-8 dark:border-gray-700 dark:bg-gray-800 mb-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {taskData.title}
                </h1>
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    <span>Due: {formatDate(taskData.due_date)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MessageSquare className="h-4 w-4" />
                    <span>{taskData.comments_count} Comments</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-medium ${getStatusColor(
                    taskData.status
                  )}`}
                >
                  {getStatusIcon(taskData.status)}
                  <span className="capitalize">{taskData.status}</span>
                </div>
                {isAssignersUser && taskData.status === "pending" && (
                  <button
                    onClick={open}
                    className="flex items-center gap-2 rounded-lg bg-green-600 px-6 py-3 text-sm font-medium text-white transition-all hover:bg-green-700 active:scale-95 shadow-sm"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Mark Complete
                  </button>
                )}
              </div>
            </div>

            <div className="h-px w-full bg-gradient-to-r from-[#D4AF37] via-[#D4AF37]/50 to-transparent mb-6"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
                  STAGE
                </h3>
                <p className="text-base font-medium text-gray-900 dark:text-white">
                  {taskData.stage_name}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
                  ASSIGNED BY
                </h3>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  <p className="text-base font-medium text-gray-900 dark:text-white">
                    {taskData.assigner_name}
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
                    {formatDate(taskData.created_at!)}
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
                {taskData.description}
              </p>
            </div>
          </div>

          {/* Reference Documents Section */}
          {referenceFiles && referenceFiles.length > 0 && (
            <div className="rounded-lg border-2 border-gray-200 bg-white p-8 dark:border-gray-700 dark:bg-gray-800 mb-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Reference Documents
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Files provided by {taskData.assigner_name} for this task
                  </p>
                </div>
                <button
                  className="flex items-center gap-2 rounded-lg bg-gray-200 dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-900 dark:text-white transition-all hover:bg-gray-300 dark:hover:bg-gray-600 active:scale-95"
                  onClick={handleDownloadAll}
                >
                  <Download className="h-4 w-4" />
                  Download All
                </button>
              </div>

              {/* Scrollable File List */}
              <div
                className={`space-y-3 ${
                  referenceFiles.length > 4
                    ? "max-h-[400px] overflow-y-auto custom-scrollbar pr-2"
                    : ""
                }`}
              >
                {referenceFiles.map((file) => (
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
                          {file.file.name}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
                          <span>{formatFileSize(file.file.size)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-3">
                      <button
                        className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-[#D4AF37] dark:hover:text-[#D4AF37] transition-colors"
                        title="View in new tab"
                        onClick={() => handleViewFile(file)}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </button>
                      <button
                        className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-[#D4AF37] dark:hover:text-[#D4AF37] transition-colors"
                        title="Download"
                        onClick={() => handleDownloadFile(file)}
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

            {/* Uploaded Files List - Scrollable */}
            {uploadedFiles.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">
                  UPLOADED FILES ({uploadedFiles.length})
                </h3>
                <div
                  className={`space-y-3 ${
                    uploadedFiles.length > 4
                      ? "max-h-[350px] overflow-y-auto custom-scrollbar pr-2"
                      : ""
                  }`}
                >
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
              </div>
            )}

            {/* Submit Button */}
            <div className="mt-6 flex justify-end">
              <button
                disabled={!isThereFilesUploaded && uploadedFiles.length === 0}
                className="flex items-center gap-2 rounded-lg bg-[#D4AF37] px-6 py-3 text-sm font-medium text-white transition-all hover:bg-[#C4A037] active:scale-95 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#D4AF37]"
                onClick={submitFiles}
              >
                <Upload className="h-4 w-4" />
                Submit Files
              </button>
            </div>
          </div>

          {/* Comments Section */}
          <div className="rounded-lg border-2 border-gray-200 bg-white p-8 dark:border-gray-700 dark:bg-gray-800">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Comments ({taskReviews?.length})
            </h2>

            {/* Comments List - Scrollable */}
            <div
              className={`mb-6 ${
                taskReviews && taskReviews.length > 4
                  ? "max-h-[483px] overflow-y-auto custom-scrollbar pr-2"
                  : ""
              }`}
            >
              <div className="space-y-4">
                {!taskReviews || taskReviews?.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageSquare className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-3" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      No comments yet. Be the first to comment!
                    </p>
                  </div>
                ) : (
                  <>
                    {taskReviews.map((rev) => (
                      <div
                        key={rev.id}
                        className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#D4AF37]/20 text-[#D4AF37]">
                              <User className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                {rev.reviewer_fullname}
                              </p>
                              <p className="text-xs text-gray-600 dark:text-gray-400">
                                {rev.reviewer_role}
                              </p>
                            </div>
                          </div>
                          <span className="text-xs text-gray-600 dark:text-gray-400">
                            {formatDate(rev.reviewed_at!)}
                          </span>
                        </div>
                        <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300 ml-13">
                          {rev.comment}
                        </p>
                      </div>
                    ))}
                    <div ref={commentsEndRef} />
                  </>
                )}
              </div>
            </div>

            {/* Add Comment Form - Fixed */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">
                ADD A COMMENT
              </h3>
              <div className="flex gap-3">
                <textarea
                  value={commentInput}
                  onChange={reviewCommentInputOnChange}
                  placeholder="Write your comment here..."
                  className="flex-1 min-h-[100px] px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent resize-none"
                />
                <button
                  disabled={!commentInput.trim()}
                  onClick={addNewReview}
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
      {isAssignersUser && taskData.status === "pending" && (
        <MarkCompleteModal
          isOpen={isOpen}
          onClose={close}
          onConfirm={markTaskAsComplete}
          isMarking={markingLoading}
        />
      )}
    </>
  );
}
