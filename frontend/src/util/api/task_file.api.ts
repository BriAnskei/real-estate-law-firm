import { file_type, taskFileType } from "../../store/Slice/case.slice";
import api from "./axiosInstance";

export class TaskFileApi {
  static async uploadFiles(payload: {
    taskId: string;
    file_type: file_type;
    fileForm: FormData;
  }): Promise<void> {
    const { taskId, file_type, fileForm } = payload;
    try {
      const res = await api.post(
        `api/file/upload/${taskId}/${file_type}`,
        fileForm
      );

      if (!res.data.sucess)
        throw new Error(res.data.message || "Failed to fetch files");
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async fetchFiles(payload: {
    taskId: string;
    file_type: file_type;
  }): Promise<taskFileType[]> {
    try {
      const { taskId, file_type } = payload;
      const res = await api.get(`/api/file/get/${taskId}/${file_type}`);

      if (!res.data.sucess)
        throw new Error(res.data.message || "Failed to fetch files");

      return res.data.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
