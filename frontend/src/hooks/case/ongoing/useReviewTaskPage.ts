import { useCallback, useEffect, useState } from "react";
import { CaseTransactionTask, Stages } from "../../../store/Slice/case.slice";
import { useNavigate, useParams } from "react-router";
import { TaskApi } from "../../../util/api/task.api";
import useTaskReview from "./useTaskReview";
import { useToast } from "../../useToast";
import useMarkCompleteModal from "./useMarkCompleteModal";
import { useCaseTransaction } from "../../../context/CaseTransactionContext";
import useReviewTaskFiles from "./useReviewTaskFiles";

const useReviewTaskPage = () => {
  const { stage, taskId, id } = useParams();
  const navigate = useNavigate();
  const context = useCaseTransaction();

  const { promiseToast } = useToast();

  const [taskData, setTaskData] = useState<CaseTransactionTask | undefined>(
    undefined
  );

  const [isFetchingTask, setIsFetchingTask] = useState(false);

  // all files submitted in this task
  const filesState = useReviewTaskFiles(taskId);

  // returns the task review(comments) datas, also handles new review submitions
  const taskReviewState = useTaskReview({
    taskId: taskId,
    stage: stage as Stages,
    addTaskCommentCount: context.addTaskCommentCount,
  });

  // modal state
  const markCompleteModalState = useMarkCompleteModal();

  useEffect(() => {
    async function fetchTask() {
      if (!taskId) return;
      setIsFetchingTask(true);
      try {
        const response = await TaskApi.getById(taskId);

        setTaskData(response);
      } catch (error) {
        console.error(error);
      } finally {
        setIsFetchingTask(false);
      }
    }
    fetchTask();
  }, [taskId]);

  const goBack = () => {
    navigate(`/case/transaction/${id}`, { replace: true });
  };

  const markTaskComplete = useCallback(async () => {
    markCompleteModalState.setMarkingLoading(true);
    await promiseToast(
      async () => {
        await TaskApi.markComplete({ task_id: taskId!, case_id: id as string });
      },
      {
        loading: "Loading....",
        success(_: void) {
          context.updateTask({
            taskId: taskId!,
            updatedTask: { ...taskData!, status: "complete" },
            stage: stage as Stages,
          });

          markCompleteModalState.close();

          navigate(`/case/transaction/${id}`, { replace: true });
          return "Task marked as Complete";
        },
        error: (err) => `Failed: ${err || "Unknown Err"}`,
      }
    );
    markCompleteModalState.setMarkingLoading(false);
  }, [taskId]);

  const formatDate = useCallback((dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }, []);

  const formatFileSize = useCallback((bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  }, []);

  // global flag
  const loading = isFetchingTask || taskReviewState.fetchingReviewsLoading;

  return {
    taskData,
    loading,
    goBack,
    formatDate,

    ...filesState,
    formatFileSize,
    // commenrts
    ...taskReviewState,

    markCompleteModalState,
    markTaskComplete,
  };
};

export default useReviewTaskPage;
