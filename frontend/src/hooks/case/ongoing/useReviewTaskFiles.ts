import { useState, useEffect } from "react";
import { file_type } from "../../../store/Slice/case.slice";
import { TaskFileApi } from "../../../util/api/task_file.api";
import { UploadedFile, encodeFetchedFiles } from "./useFormUploads";

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

export default useReviewTaskFiles;
