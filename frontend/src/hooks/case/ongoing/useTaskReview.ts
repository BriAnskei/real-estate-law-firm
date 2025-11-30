import { useCallback, useEffect, useRef, useState } from "react";
import { TaskReviewType } from "../../../types/TaskReviewType";
import { TaskReviewApi } from "../../../util/api/task_review.api";
import { useCaseTransaction } from "../../../context/CaseTransactionContext";
import { Stages } from "../../../store/Slice/case.slice";

const useTaskReviewInput = () => {
  const [commentInput, setCommentInput] = useState("");

  const reviewCommentInputOnChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setCommentInput(e.target.value);
  };

  return {
    commentInput,
    reviewCommentInputOnChange,
    setCommentInput,
  };
};

const useTaskReview = (payload: { taskId?: string; stage: Stages }) => {
  const { taskId, stage } = payload;

  const context = useCaseTransaction();

  // ref for reviews scroll
  const commentsEndRef = useRef<HTMLDivElement>(null);
  const [taskReviews, setTaskReviews] = useState<TaskReviewType[] | undefined>(
    undefined
  );
  const [fetchingReviewsLoading, setFetchingReviewsLoading] = useState(false);
  const commentInputState = useTaskReviewInput();

  useEffect(() => {
    async function fetchReviews() {
      if (!taskId) return;
      setFetchingReviewsLoading(true);
      try {
        const response = await TaskReviewApi.getAllByTaskId(taskId);

        setTaskReviews(response);
      } catch (error) {
        console.error(error);
      } finally {
        setFetchingReviewsLoading(false);
      }
    }
    fetchReviews();
  }, [taskId]);

  const addNewReview = useCallback(async () => {
    if (!commentInputState.commentInput.trim()) return;

    try {
      const newTaskData = await TaskReviewApi.add({
        task_id: taskId!,
        comment: commentInputState.commentInput,
      });

      setTaskReviews((prev) => [...(prev ?? []), newTaskData]);
      context.addTaskCommentCount({ stage, taskId: taskId! });
      commentInputState.setCommentInput("");
      scrollToBottom();
    } catch (error) {
      console.error(error);
    }
  }, [setTaskReviews, commentInputState.commentInput]);

  const scrollToBottom = () => {
    setTimeout(() => {
      commentsEndRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 300);
  };

  return {
    fetchingReviewsLoading,
    taskReviews,
    addNewReview,

    ...commentInputState,
    commentsEndRef,
  };
};

export default useTaskReview;
