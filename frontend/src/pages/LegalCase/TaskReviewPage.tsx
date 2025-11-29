import React, { useState } from "react";
import {
  ChevronLeft,
  Calendar,
  MessageCircle,
  User,
  Clock,
  Download,
  ExternalLink,
  CheckCircle,
  Send,
} from "lucide-react";

export default function TaskReviewPage() {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([
    {
      id: 1,
      author: "Atty. Maria Santos",
      role: "Senior Attorney",
      date: "November 21, 2025",
      text: "Please make sure the affidavit includes all relevant dates and witnesses. We need this to be as detailed as possible for the hearing.",
    },
    {
      id: 2,
      author: "Juan Dela Cruz",
      role: "Paralegal Assistant",
      date: "November 22, 2025",
      text: "I've completed the affidavit and uploaded all required documents. Please review at your earliest convenience.",
    },
    {
      id: 3,
      author: "Atty. Maria Santos",
      role: "Senior Attorney",
      date: "November 22, 2025",
      text: "The documents look good overall. However, please ensure the witness signatures are properly notarized before final submission.",
    },
  ]);

  const referenceFiles = [
    {
      name: "Case_Guidelines_Template.pdf",
      size: "1.2 MB",
      uploaded: "November 20, 2025",
    },
    {
      name: "Affidavit_Sample_Format.pdf",
      size: "856 KB",
      uploaded: "November 20, 2025",
    },
    {
      name: "Notarization_Requirements.pdf",
      size: "642 KB",
      uploaded: "November 20, 2025",
    },
  ];

  const submittedFiles = [
    {
      name: "Client_Affidavit_Final.pdf",
      size: "2.34 MB",
      uploaded: "November 22, 2025",
    },
    {
      name: "Witness_Statement_1.pdf",
      size: "1.76 MB",
      uploaded: "November 22, 2025",
    },
    {
      name: "Notarized_Documents.pdf",
      size: "3.00 MB",
      uploaded: "November 22, 2025",
    },
  ];

  const handlePostComment = () => {
    if (comment.trim()) {
      const newComment = {
        id: comments.length + 1,
        author: "Current User",
        role: "Reviewer",
        date: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        text: comment,
      };
      setComments([...comments, newComment]);
      setComment("");
    }
  };

  const handleDownloadAll = (type) => {
    console.log(`Download all ${type} files`);
  };

  const handleViewFile = (file) => {
    console.log("View file in new tab:", file.name);
  };

  const handleDownloadFile = (file) => {
    console.log("Download file:", file.name);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <button className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-500 transition-colors mb-6">
          <ChevronLeft className="h-5 w-5" />
          <span className="text-sm font-medium">Back to Tasks</span>
        </button>

        {/* Task Details Section */}
        <div className="rounded-lg border-2 border-gray-200 bg-white p-8 dark:border-gray-700 dark:bg-gray-800 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Submit Client Affidavit
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  <span>Due: November 30, 2025</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MessageCircle className="h-4 w-4" />
                  <span>{comments.length} Comments</span>
                </div>
              </div>
            </div>
            <div className="rounded-full px-4 py-2 text-sm font-medium bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
              Pending
            </div>
          </div>

          <div className="h-px w-full bg-gradient-to-r from-yellow-600 via-yellow-600/50 to-transparent mb-6"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
                STAGE
              </h3>
              <p className="text-base font-medium text-gray-900 dark:text-white">
                Case Requirements
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
                ASSIGNED BY
              </h3>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                <div>
                  <p className="text-base font-medium text-gray-900 dark:text-white">
                    Atty. Maria Santos
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Senior Attorney
                  </p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
                ASSIGNED TO
              </h3>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                <div>
                  <p className="text-base font-medium text-gray-900 dark:text-white">
                    Juan Dela Cruz
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Paralegal Assistant
                  </p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
                ASSIGNED AT
              </h3>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                <p className="text-base text-gray-900 dark:text-white">
                  November 20, 2025
                </p>
              </div>
            </div>
          </div>

          <div className="h-px w-full bg-gradient-to-r from-yellow-600 via-yellow-600/50 to-transparent mb-6"></div>

          <div>
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
              DESCRIPTION
            </h3>
            <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300">
              Prepare and submit the sworn statement from the client regarding
              the incident. Ensure all facts are accurately represented and the
              document is properly notarized.
            </p>
          </div>
        </div>

        {/* Reference Documents Section */}
        <div className="rounded-lg border-2 border-gray-200 bg-white p-8 dark:border-gray-700 dark:bg-gray-800 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Reference Documents
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Files provided by Atty. Maria Santos for this task
              </p>
            </div>
            <button
              onClick={() => handleDownloadAll("reference")}
              className="flex items-center gap-2 rounded-lg bg-gray-200 dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-900 dark:text-white transition-all hover:bg-gray-300 dark:hover:bg-gray-600 active:scale-95"
            >
              <Download className="h-4 w-4" />
              Download All
            </button>
          </div>

          <div className="space-y-3">
            {referenceFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 hover:border-yellow-600 dark:hover:border-yellow-500 transition-colors"
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
                    className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-500 transition-colors"
                    title="View in new tab"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDownloadFile(file)}
                    className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-500 transition-colors"
                    title="Download"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submitted Files Section */}
        <div className="rounded-lg border-2 border-gray-200 bg-white p-8 dark:border-gray-700 dark:bg-gray-800 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Submitted Documents
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Review files submitted by Juan Dela Cruz
              </p>
            </div>
            <button
              onClick={() => handleDownloadAll("submitted")}
              className="flex items-center gap-2 rounded-lg bg-gray-200 dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-900 dark:text-white transition-all hover:bg-gray-300 dark:hover:bg-gray-600 active:scale-95"
            >
              <Download className="h-4 w-4" />
              Download All
            </button>
          </div>

          <div className="space-y-3 mb-6">
            {submittedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 hover:border-yellow-600 dark:hover:border-yellow-500 transition-colors"
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
                    className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-500 transition-colors"
                    title="View in new tab"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDownloadFile(file)}
                    className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-500 transition-colors"
                    title="Download"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Approve Button */}
          <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
            <button className="flex items-center gap-2 rounded-lg bg-green-600 px-6 py-3 text-sm font-medium text-white transition-all hover:bg-green-700 active:scale-95 shadow-sm">
              <CheckCircle className="h-4 w-4" />
              Approve Task
            </button>
          </div>
        </div>

        {/* Comments Section */}
        <div className="rounded-lg border-2 border-gray-200 bg-white p-8 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            Comments ({comments.length})
          </h2>

          <div className="space-y-4 mb-6">
            {comments.map((c) => (
              <div
                key={c.id}
                className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-600/20 text-yellow-600">
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {c.author}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {c.role}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    {c.date}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300 ml-13">
                  {c.text}
                </p>
              </div>
            ))}
          </div>

          {/* Add Comment Form */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">
              ADD A REVIEW COMMENT
            </h3>
            <div className="flex gap-3">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write your review comment here..."
                className="flex-1 min-h-[100px] px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent resize-none"
              />
              <button
                onClick={handlePostComment}
                className="self-end flex items-center gap-2 rounded-lg bg-yellow-600 px-6 py-3 text-sm font-medium text-white transition-all hover:bg-yellow-700 active:scale-95 shadow-sm"
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
}
