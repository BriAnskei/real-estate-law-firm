import { useCallback, useEffect, useState } from "react";
import {
  CaseTransactionTask,
  file_type,
  Stages,
} from "../../../store/Slice/case.slice";
import { replace, useNavigate, useParams } from "react-router";
import { TaskApi } from "../../../util/api/task.api";
import { encodeFetchedFiles, UploadedFile } from "./useFormUploads";
import { TaskFileApi } from "../../../util/api/task_file.api";
import useTaskReview from "./useTaskReview";
import { useToast } from "../../useToast";
import useMarkCompleteModal from "./useMarkCompleteModal";
import { useCaseTransaction } from "../../../context/CaseTransactionContext";

const useReviewTaskFiles = (taskId?: string) => {
  const [referenceFiles, setReferenceFiles] = useState<
    UploadedFile[] | undefined
  >(undefined);
  const [fetchingRefFilesLoading, setFetchingFilesRef] = useState(false);

  const [submittedFiles, setSubmittedFiles] = useState<
    UploadedFile[] | undefined
  >(undefined);
  const [fetchingSubFilesLoading, setFetchingSubFilesLoading] = useState(false);

  useEffect(() => {
    async function fetchReferenceFiles() {
      if (!taskId) return;
      setFetchingFilesRef(true);
      try {
        const response = await TaskFileApi.fetchFiles({
          taskId,
          file_type: file_type.uploader,
        });

        if (!response || response.length === 0) return;

        setReferenceFiles(await encodeFetchedFiles(response));
      } catch (error) {
        console.error(error);
      } finally {
        setFetchingFilesRef(false);
      }
    }

    async function fetchSubmittedFiles() {
      if (!taskId) return;
      setFetchingSubFilesLoading(true);
      try {
        const response = await TaskFileApi.fetchFiles({
          taskId,
          file_type: file_type.submitter,
        });
        if (!response || response.length === 0) return;
        setSubmittedFiles(await encodeFetchedFiles(response));
      } catch (error) {
        console.error(error);
      } finally {
        setFetchingSubFilesLoading(false);
      }
    }

    fetchReferenceFiles();
    fetchSubmittedFiles();
  }, [taskId]);

  //component functions
  const handleDownloadAll = (files: UploadedFile[]) => {
    files.forEach((f) => {
      const blobUrl = URL.createObjectURL(f.file);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = f.file.name;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(blobUrl);
    });
  };

  const handleViewFile = (fileData: UploadedFile) => {
    const fileUrl = URL.createObjectURL(fileData.file);

    window.open(fileUrl, "_blank");
  };

  const handleDownloadFile = (fileData: UploadedFile) => {
    const blobUrl = URL.createObjectURL(fileData.file);

    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = fileData.file.name; // keeps original file name

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(blobUrl); // cleanup
  };

  const isFetchingFiles = fetchingRefFilesLoading || fetchingSubFilesLoading;

  return {
    handleDownloadAll,
    handleViewFile,
    handleDownloadFile,
    isFetchingFiles,

    referenceFiles,
    submittedFiles,
  };
};

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
        await TaskApi.markComplete(taskId!);
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
