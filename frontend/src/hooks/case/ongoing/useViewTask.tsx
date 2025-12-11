import { useNavigate, useParams } from "react-router";
import useTaskReview from "./useTaskReview";
import { useCallback, useEffect, useState } from "react";
import {
  CaseTransactionTask,
  file_type,
  Stages,
} from "../../../store/Slice/case.slice";
import { TaskApi } from "../../../util/api/task.api";
import useFormUploads from "./useFormUploads";
import { useToast } from "../../useToast";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../store/selector/user/userSelector";
import { useCaseTransaction } from "../../../context/CaseTransactionContext";
import useMarkCompleteModal from "./useMarkCompleteModal";
import usePdfFileTask from "./usePdfFileTask";

const useViewTask = () => {
  const context = useCaseTransaction();
  const curUser = useSelector(selectCurrentUser);

  const { stage, taskId, id } = useParams();

  const { promiseToast } = useToast();

  const [taskData, setTaskData] = useState<CaseTransactionTask | undefined>(
    undefined
  );
  const [fetchTaskLoading, setFetchTaskLoading] = useState(true);

  const navigate = useNavigate();

  // task is assign to one person and it is the current user
  const isAssignersUser =
    curUser &&
    taskData &&
    curUser.id === taskData.assign_to &&
    taskData.assign_by === taskData.assign_to;

  // reference files and functionalities state
  const pdfState = useFormUploads({
    isUpdating: true,
    taskId,
    fileType: file_type.submitter,
  });

  // handles task reference files and submit uploaded files
  const filesState = usePdfFileTask({
    taskId,
    getUploadedFiles: pdfState.getFormData,
    originalUploadedFiles: pdfState.originalFiles,
    uploadedFiles: pdfState.uploadedFiles,
    caseId: id as string,
    stage: stage as Stages,
    setOriginalFiles: pdfState.setOriginalFiles,
  });

  // task review state
  const reviewState = useTaskReview({
    taskId,
    stage: stage as Stages,
    addTaskCommentCount: context.addTaskCommentCount,
  });

  // mark complete confirmation modal
  const modalState = useMarkCompleteModal();

  useEffect(() => {
    async function fetchTask() {
      if (!taskId) return;
      setFetchTaskLoading(true);
      try {
        const response = await TaskApi.getById(taskId);

        // if the task is complete navigate to review(mock function)
        if (response && response.status === "complete") {
          navigate(`/case/transaction/${id}/stage/task/review/${taskId}`, {
            replace: true,
          });
        }

        setTaskData(response);
      } catch (error) {
        console.error(error);
      } finally {
        setFetchTaskLoading(false);
      }
    }

    fetchTask();
  }, [taskId]);

  /**
   *  this function is only usable  if the task assigners is curUser.
   * meaning if the assign_to and assign_by is one person and it is the
   * curUser(who is currently viewing the task) this function will be usable
   */
  const markTaskAsComplete = useCallback(async () => {
    if (!isAssignersUser || !taskId) return;
    modalState.setMarkingLoading(true);
    await promiseToast(
      async () => {
        await TaskApi.markComplete({ task_id: taskId, case_id: id as string });
      },
      {
        loading: "Loading....",
        success: (_: void) => {
          context.updateTask({
            taskId: taskId!,
            updatedTask: { ...taskData!, status: "complete" },
            stage: stage as Stages,
          });

          navigate(`/case/transaction/${id}`, { replace: true });
          return "Task marked as success";
        },
        error: (err) => `Failed to mark success: ${err || "Unkown error"}`,
      }
    );
    modalState.setMarkingLoading(false);
  }, [taskId, isAssignersUser]);

  const goBack = () => {
    navigate(`/case/transaction/${id}`, { replace: true });
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // global loading
  const loading =
    fetchTaskLoading ||
    filesState.isfetchingFiles ||
    reviewState.fetchingReviewsLoading;

  return {
    goBack,
    loading,
    taskData,
    formatDate,

    isAssignersUser,

    // only return the function if the user is  the assginer
    ...(isAssignersUser && { markTaskAsComplete }),

    // file state
    ...filesState,
    ...pdfState,

    // review state
    ...reviewState,

    ...modalState,
  };
};

export default useViewTask;
