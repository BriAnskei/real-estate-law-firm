import { useCallback, useEffect, useState } from "react";
import { ProcessServerTask } from "../../types/ProcessServerTaskType";
import { useParams } from "react-router";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../store/selector/user/userSelector";
import { TaskApi } from "../../util/api/task.api";
import {
  CaseTransactionTask,
  CaseType,
  file_type,
  Stages,
} from "../../store/Slice/case.slice";
import useCaseDetailsModal from "./useCaseDetailsModal";
import { caseApi } from "../../util/api/case.api";
import { ClientType } from "../../store/Slice/client.slice";
import { ClientApi } from "../../util/api/client.api";
import useClientDetailsModal from "./useClientDetailsModal";
import useFormUploads from "../case/ongoing/useFormUploads";
import usePdfFileTask from "../case/ongoing/usePdfFileTask";
import useTaskReview from "../case/ongoing/useTaskReview";

const useProcessServerTaskView = () => {
  const { taskId } = useParams();
  const currUser = useSelector(selectCurrentUser);

  const [taskData, setTaskData] = useState<CaseTransactionTask | undefined>(
    undefined
  );

  const [caseData, setCaseData] = useState<CaseType | undefined>(undefined);
  const [clientData, setClientData] = useState<ClientType | undefined>(
    undefined
  );

  const [fetchingLoading, setFetchingLoading] = useState(false);

  const caseDetialsModalState = useCaseDetailsModal();
  const clientDetailsModalState = useClientDetailsModal();

  const reviewState = useTaskReview({
    taskId: taskId,
    stage: taskData?.stage_name as Stages,
  });

  const pdfState = useFormUploads({
    isUpdating: true,
    taskId,
    fileType: file_type.submitter,
  });

  const refPdfFilesForm = usePdfFileTask({
    taskId,
    stage: taskData?.stage_name! as Stages,
    caseId: caseData?.id!,
    uploadedFiles: pdfState.uploadedFiles,
    originalUploadedFiles: pdfState.originalFiles,
    setOriginalFiles: pdfState.setOriginalFiles,
    getUploadedFiles: pdfState.getFormData,
  });

  // handle fetch
  useEffect(() => {
    async function fetchTaskCaseData() {
      if (!currUser || !taskId) return;
      setFetchingLoading(true);
      try {
        const taskDataResponse = await fetchTaskData(taskId);
        setTaskData(taskDataResponse);

        const caseDataResponse = await fetchCaseData(
          taskDataResponse.case_stage_id
        );
        setCaseData(caseDataResponse);

        const clientDataResponse = await fetchClientData(
          caseDataResponse.client_id!
        );

        setClientData(clientDataResponse);
      } catch (error) {
        console.error(error);
      } finally {
        setFetchingLoading(false);
      }
    }

    fetchTaskCaseData();
  }, [taskId, currUser]);

  const fetchTaskData = useCallback(
    async (taskId: string): Promise<CaseTransactionTask> => {
      try {
        const response = await TaskApi.getById(taskId);

        return response;
      } catch (error) {
        throw error;
      }
    },
    []
  );

  const fetchCaseData = useCallback(
    async (stage_id: string): Promise<CaseType> => {
      try {
        const response = await caseApi.findByStageId(stage_id);
        return response;
      } catch (error) {
        throw error;
      }
    },
    []
  );

  const fetchClientData = useCallback(
    async (client_id: string): Promise<ClientType> => {
      try {
        const response = await ClientApi.findById(client_id);

        if (!response.success)
          throw new Error(response.message || "Unknown Error");

        return response.data!;
      } catch (error) {
        throw error;
      }
    },
    []
  );

  return {
    loading: fetchingLoading || reviewState.fetchingReviewsLoading,
    taskData,
    caseData,
    clientData,

    reviewState,

    caseDetialsModalState,
    clientDetailsModalState,

    ...pdfState,
    ...refPdfFilesForm,
  };
};

export default useProcessServerTaskView;
