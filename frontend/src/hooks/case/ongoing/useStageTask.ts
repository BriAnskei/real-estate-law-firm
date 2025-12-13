import { useEffect } from "react";
import { useCaseTransaction } from "../../../context/CaseTransactionContext";

const useStageTask = (tabName: "requirements" | "documents" | "hearings") => {
  const {
    isOnTaskFilter,
    fetchStageTask,
    getTaskData,
    getStageData,
    taskLoading,
  } = useCaseTransaction();

  const stageData = getStageData(tabName);
  const taskData = getTaskData(tabName);

  useEffect(() => {
    async function fetchTask() {
      if (taskData !== undefined || taskLoading) return;

      fetchStageTask({
        stageId: stageData!.id!,
        stageName: stageData!.stage_name,
      });
    }

    fetchTask();
  }, [stageData?.id, stageData?.stage_name, taskData, fetchStageTask]);

  return {
    isOnTaskFilter,
    taskData,
  };
};

export default useStageTask;
