import { useCallback } from "react";
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
  AlertCircle,
} from "lucide-react";
import useReviewTaskPage from "../../hooks/case/ongoing/useReviewTaskPage";
import CaseTransactionLoader from "../../components/ui/loading/CaseTransactionLoader";
import { MarkCompleteModal } from "../../components/modal/caseModal/MarkCompleteModal";
import { useParams } from "react-router";
import { useCaseTransaction } from "../../context/CaseTransactionContext";
import { Stages } from "../../store/Slice/case.slice";

export default function TaskReviewPage() {
  const { stage } = useParams();
  const { selectedHearing } = useCaseTransaction();
  const {
    curUser,

    taskData,
    loading,
    goBack,
    formatDate,

    // files
    referenceFiles,
    submittedFiles,

    // files functions
    formatFileSize,
    handleDownloadAll,
    handleDownloadFile,
    handleViewFile,

    taskReviews,
    reviewCommentInputOnChange,
    addNewReview,
    commentInput,
    commentsContainerRef,

    // mark complete modal
    markCompleteModalState,
    markTaskComplete,
  } = useReviewTaskPage();

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

  if (loading || !taskData || !curUser) {
    return (
      <CaseTransactionLoader
        loadingText="Initializing task"
        isLoading={loading || !taskData || !curUser}
      />
    );
  }

  // enable Mark complete if the current user is the assinee
  const isCurUserAssignee = curUser?.id === taskData.assign_by;

  // if task is compltete or if tast is from hearing stage
  // amd hearing status is cancelled, disable actions(comments, approve)
  const isTaskComplete =
    taskData.status === "complete" ||
    (stage === "HEARING" && selectedHearing?.status === "cancelled");
  return (
    <>
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Header */}
          <button
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-500 transition-colors mb-6"
            onClick={goBack}
          >
            <ChevronLeft className="h-5 w-5" />
            <span className="text-sm font-medium">Back to Tasks</span>
          </button>

          {/* Task Details Section */}
          <div className="rounded-lg border-2 border-gray-200 bg-white p-8 dark:border-gray-700 dark:bg-gray-800 mb-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {taskData?.title}
                </h1>
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    <span>Due: {formatDate(taskData?.due_date!)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MessageCircle className="h-4 w-4" />
                    <span>{taskData?.comments_count} Comments</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-medium ${getStatusColor(
                    taskData!.status
                  )}`}
                >
                  {getStatusIcon(taskData!.status)}
                  <span className="capitalize">{taskData!.status}</span>
                </div>
                {!isTaskComplete && isCurUserAssignee && (
                  <button
                    className="flex items-center gap-2 rounded-lg bg-green-600 px-6 py-2.5 text-sm font-medium text-white transition-all hover:bg-green-700 active:scale-95 shadow-sm"
                    onClick={() => markCompleteModalState.open()}
                  >
                    <CheckCircle className="h-4 w-4" />
                    Approve Task
                  </button>
                )}
              </div>
            </div>

            <div className="h-px w-full bg-gradient-to-r from-yellow-600 via-yellow-600/50 to-transparent mb-6"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
                  STAGE
                </h3>
                <p className="text-base font-medium text-gray-900 dark:text-white">
                  {taskData?.stage_name}
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
                      {taskData?.assigner_name}
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
                      {taskData?.assignee_name}
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
                    {formatDate(taskData?.created_at!)}
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
                {taskData?.description}
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
                  Files provided by {taskData.assigner_name} for this task
                </p>
              </div>
              <button
                disabled={!referenceFiles || referenceFiles.length === 0}
                className="flex items-center gap-2 rounded-lg bg-gray-200 dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-900 dark:text-white transition-all hover:bg-gray-300 dark:hover:bg-gray-600 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed "
                onClick={() => handleDownloadAll(referenceFiles!)}
              >
                <Download className="h-4 w-4" />
                Download All
              </button>
            </div>

            {/* Scrollable File List */}
            <div
              className={`space-y-3 ${
                referenceFiles && referenceFiles.length > 4
                  ? "max-h-[400px] overflow-y-auto custom-scrollbar pr-2"
                  : ""
              }`}
            >
              {(referenceFiles ?? []).map((file, index) => (
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
                        {file.file.name}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
                        <span>{formatFileSize(file.file.size)}</span>
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
                  Review files submitted by {taskData.assignee_name}
                </p>
              </div>
              <button
                disabled={!submittedFiles || !submittedFiles.length}
                className="flex items-center gap-2 rounded-lg bg-gray-200 dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-900 dark:text-white transition-all hover:bg-gray-300 dark:hover:bg-gray-600 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => handleDownloadAll(submittedFiles!)}
              >
                <Download className="h-4 w-4" />
                Download All
              </button>
            </div>

            {/* Scrollable File List */}
            <div
              className={`space-y-3 mb-6 ${
                submittedFiles && submittedFiles?.length > 4
                  ? "max-h-[350px] overflow-y-auto custom-scrollbar pr-2"
                  : ""
              }`}
            >
              {(submittedFiles ?? []).map((file, index) => (
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
                        {file.file.name}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
                        <span>{formatFileSize(file.file.size)}</span>
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

          {/* Comments Section */}
          <div className="rounded-lg border-2 border-gray-200 bg-white p-8 dark:border-gray-700 dark:bg-gray-800">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Comments ({taskReviews?.length})
            </h2>

            {/* Scrollable Comments List */}
            <div
              ref={commentsContainerRef}
              className={`mb-6 ${
                taskReviews && taskReviews.length > 4
                  ? "max-h-[483px] overflow-y-auto custom-scrollbar pr-2"
                  : ""
              }`}
            >
              <div className="space-y-4">
                {(taskReviews ?? []).map((c) => (
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
                            {c.reviewer_fullname}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {c.reviewer_role}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        {c.reviewed_at}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300 ml-13">
                      {c.comment}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Add Comment Form */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">
                ADD A REVIEW COMMENT
              </h3>
              <div className="flex gap-3">
                <textarea
                  disabled={isTaskComplete}
                  value={commentInput}
                  onChange={reviewCommentInputOnChange}
                  placeholder="Write your review comment here..."
                  className="flex-1 min-h-[100px] px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent resize-none disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100 dark:disabled:bg-gray-800"
                />
                <button
                  disabled={isTaskComplete}
                  className="self-end flex items-center gap-2 rounded-lg bg-yellow-600 px-6 py-3 text-sm font-medium text-white transition-all hover:bg-yellow-700 active:scale-95 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-yellow-600"
                  onClick={addNewReview}
                >
                  <Send className="h-4 w-4" />
                  Post
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isCurUserAssignee && !isTaskComplete && (
        <MarkCompleteModal
          isOpen={markCompleteModalState.isOpen}
          onClose={markCompleteModalState.close}
          isMarking={markCompleteModalState.markingLoading}
          onConfirm={markTaskComplete}
        />
      )}
    </>
  );
}
