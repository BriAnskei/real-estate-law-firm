import { useNavigate, useParams } from "react-router";
import useTaskReview from "./useTaskReview";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  CaseTransactionTask,
  file_type,
  Stages,
} from "../../../store/Slice/case.slice";
import { TaskApi } from "../../../util/api/task.api";
import useFormUploads, {
  encodeFetchedFiles,
  UploadedFile,
} from "./useFormUploads";
import { TaskFileApi } from "../../../util/api/task_file.api";
import { useToast } from "../../useToast";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../store/selector/user/userSelector";
import { useCaseTransaction } from "../../../context/CaseTransactionContext";
import useMarkCompleteModal from "./useMarkCompleteModal";

const usePdfFileTask = (payload: {
  taskId?: string;
  stage?: Stages;
  caseId: string;
  originalUploadedFiles?: UploadedFile[];
  getUploadedFiles: () => FormData | undefined;
}) => {
  const { taskId, getUploadedFiles, caseId, stage } = payload;

  const { promiseToast } = useToast();

  const [referenceFiles, setReferenceFiles] = useState<
    UploadedFile[] | undefined
  >(undefined);
  const [isfetchingFiles, setIsFetchingFiles] = useState(false);

  // handles the fetching of reference documents
  useEffect(() => {
    async function fetchReferenceFiles() {
      if (!taskId) return;
      setIsFetchingFiles(true);
      try {
        // fetch the uploads files from the assignner(reference)
        const response = await TaskFileApi.fetchFiles({
          taskId,
          file_type: file_type.uploader,
        });

        if (response.length === 0) return; // no reference files

        setReferenceFiles(await encodeFetchedFiles(response));
      } catch (error) {
        console.error(error);
      } finally {
        setIsFetchingFiles(false);
      }
    }

    fetchReferenceFiles();
  }, [taskId]);

  const submitFiles = useCallback(async () => {
    try {
      const uploadedFiles = getUploadedFiles();

      if (!uploadedFiles) return;

      await promiseToast(
        async () => {
          await TaskFileApi.uploadFiles({
            case_id: caseId!,
            stage_name: stage!,
            taskId: taskId!,
            file_type: file_type.submitter,
            fileForm: uploadedFiles,
          });
        },
        {
          loading: "Submitting documents....",
          success: "documents successfully submitted",
          error: (err) => `Failed to update task: ${err || "Unknown error"}`,
        }
      );
    } catch (error) {
      console.error(error);
    }
  }, [getUploadedFiles]);

  //component functions
  const handleDownloadAll = () => {
    referenceFiles?.forEach((fileData) => {
      const blobUrl = URL.createObjectURL(fileData.file);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = fileData.file.name;

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

  return {
    referenceFiles,
    isfetchingFiles,
    handleDownloadAll,
    handleDownloadFile,
    handleViewFile,
    submitFiles,
  };
};

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

  const isAssignersUser =
    curUser?.id === taskData?.assign_to &&
    taskData?.assign_by === taskData?.assign_to;

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
    caseId: id as string,
    stage: stage as Stages,
  });

  // task review state
  const reviewState = useTaskReview({ taskId, stage: stage as Stages });

  // mark complete confirmation modal
  const modalState = useMarkCompleteModal();

  useEffect(() => {
    async function fetchTask() {
      if (!taskId) return;
      setFetchTaskLoading(true);
      try {
        const response = await TaskApi.getById(taskId);

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
        await TaskApi.markComplete(taskId!);
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
    navigate(`/case/transaction/${id}`);
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
    markTaskAsComplete,

    // file state
    ...filesState,
    ...pdfState,

    // review state
    ...reviewState,

    ...modalState,
  };
};

export default useViewTask;
