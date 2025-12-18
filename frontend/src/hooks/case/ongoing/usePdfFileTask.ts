import { useState, useEffect, useCallback } from "react";
import { Stages, file_type } from "../../../store/Slice/case.slice";
import { TaskFileApi } from "../../../util/api/task_file.api";
import { useToast } from "../../useToast";
import { UploadedFile, encodeFetchedFiles } from "./useFormUploads";

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

export default usePdfFileTask;
