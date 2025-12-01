import { useState, useRef, useEffect, useCallback } from "react";
import { file_type, taskFileType } from "../../../store/Slice/case.slice";
import { TaskFileApi } from "../../../util/api/task_file.api";

export interface UploadedFile {
  id: string;
  file: File;
}
/**
 * Task form pdf uploads handler
 */
const useFormUploads = (payload: {
  isUpdating: boolean;
  taskId?: string;
  fileType?: file_type;
}) => {
  const { isUpdating, taskId, fileType } = payload;

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [originalFiles, setOriginalFiles] = useState<
    UploadedFile[] | undefined
  >([]);

  // this ref is used for update only
  const isUploadsInitialized = useRef(false);

  // handle fetch uploaded files
  useEffect(() => {
    async function fetchUploadedFiles() {
      if (!isUpdating || isUploadsInitialized.current) return;

      if (!taskId) return;
      try {
        const res =
          (await TaskFileApi.fetchFiles({
            taskId,
            file_type: fileType ? fileType : file_type.uploader,
          })) ?? [];

        if (res.length === 0) return;

        const enCodedData = await encodeFetchedFiles(res);

        setUploadedFiles(enCodedData);
        setOriginalFiles(enCodedData);
      } catch (error) {
        console.error(error);
      } finally {
        isUploadsInitialized.current = true;
      }
    }

    fetchUploadedFiles();
  }, [isUpdating, taskId]);

  const getFormData = useCallback((): FormData | undefined => {
    if (uploadedFiles.length === 0 && originalFiles?.length === 0)
      return undefined;
    const formData = new FormData();

    uploadedFiles?.forEach((f) => {
      formData.append("uploadedPdfFiles", f.file);
    });
    return formData;
  }, [uploadedFiles, originalFiles]);

  // component functions
  const addFiles = useCallback((files: File[]) => {
    const newFiles: UploadedFile[] = files.map((file) => ({
      id: Math.random().toString(36).slice(2, 11),
      file,
    }));

    setUploadedFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const removeFile = useCallback((fileId: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== fileId));
  }, []);

  const formatFileSize = useCallback((bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  }, []);

  return {
    getFormData,
    uploadedFiles,
    addFiles,
    removeFile,
    formatFileSize,
    setUploadedFiles,

    isThereFilesUploaded: Boolean(originalFiles?.length),
    originalFiles,
    setOriginalFiles,
  };
};

/**
 * Encodes the fetched files data to a filetype component
 */
export const encodeFetchedFiles = async (
  fetchedData: taskFileType[]
): Promise<UploadedFile[]> => {
  return await Promise.all(
    fetchedData.map(async (file: taskFileType) => {
      const fileUrl = `http://localhost:4000/${file.file_path.replace(
        /\\/g,
        "/"
      )}`;

      const blob = await fetch(fileUrl).then((r) => r.blob());

      const fileObj = new File([blob], file.original_name, {
        type: blob.type,
      });

      return {
        id: file.id!.toString(),
        file: fileObj,
      };
    })
  );
};

export default useFormUploads;
