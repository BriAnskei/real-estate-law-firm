import { useNavigate, useParams } from "react-router";
import useTaskReview from "./useTaskReview";
import { useCallback, useEffect, useState } from "react";
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
  uploadedFiles: UploadedFile[];
  getUploadedFiles: () => FormData | undefined;

  /**
   *
   *  so this function paramater is used for updating the original for
   * when user uploaded a new files, this is important because we need
   * to use the original files to campre the changes of the uploaded files
   * that will disable the compontent button
   */
  setOriginalFiles: React.Dispatch<
    React.SetStateAction<UploadedFile[] | undefined>
  >;
}) => {
  const {
    taskId,
    getUploadedFiles,
    uploadedFiles,
    originalUploadedFiles,
    caseId,
    stage,

    setOriginalFiles,
  } = payload;

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

  // check if there are changes in the uploaded files, this will handle the 'isThereChangesInUploads'
  // that will desable the submit button in the componentr
  const hasFilesChanges = useCallback(() => {
    // If there were no original files and now there are uploaded files
    if (
      (!originalUploadedFiles || originalUploadedFiles.length === 0) &&
      uploadedFiles.length > 0
    ) {
      return true;
    }

    // If files count is different
    if (uploadedFiles.length !== originalUploadedFiles?.length) {
      return true;
    }

    // Check if file IDs match (comparing sets of IDs)
    const originalIds = new Set(originalUploadedFiles?.map((f) => f.id) || []);
    const currentIds = new Set(uploadedFiles.map((f) => f.id));

    if (originalIds.size !== currentIds.size) {
      return true;
    }

    // Check if all current IDs exist in original IDs
    for (const id of currentIds) {
      if (!originalIds.has(id)) {
        return true;
      }
    }

    return false;
  }, [uploadedFiles, originalUploadedFiles]);

  const submitFiles = useCallback(async () => {
    try {
      // get the encoded formData files
      const encodedFileForm = getUploadedFiles();

      if (!encodedFileForm) return;

      await promiseToast(
        async () => {
          await TaskFileApi.uploadFiles({
            case_id: caseId!,
            stage_name: stage!,
            taskId: taskId!,
            file_type: file_type.submitter,
            fileForm: encodedFileForm,
          });
        },
        {
          loading: "Submitting documents....",
          success: (_: void) => {
            setOriginalFiles(uploadedFiles);

            return "documents successfully submitted";
          },
          error: (err) => `Failed to update task: ${err || "Unknown error"}`,
        }
      );
    } catch (error) {
      console.error(error);
    }
  }, [getUploadedFiles, uploadedFiles]);

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
    hasFilesChanges,
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
  const reviewState = useTaskReview({ taskId, stage: stage as Stages });

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
