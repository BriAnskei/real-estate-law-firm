import { useEffect } from "react";
import {
  CaseStageStatus,
  CaseStagesType,
  CaseTransactionTask,
  Stages,
} from "../../../store/Slice/case.slice";
import { TabTypes } from "../../../context/CaseTransactionContext";
import { useNavigate } from "react-router-dom";

const useCaseStage = (payload: {
  stageData: CaseStagesType;
  stageTask: CaseTransactionTask[] | undefined;
  fetchStageTask: (payload: {
    stageId: string;
    stageName: Stages;
  }) => Promise<void>;
  statusHandler: (
    stageId: string,
    stageName: Stages
  ) => (status: CaseStageStatus) => void;
  taskLoading: boolean;
}) => {
  const navigate = useNavigate();

  const { stageData, stageTask, fetchStageTask, statusHandler, taskLoading } =
    payload;

  useEffect(() => {
    async function fetchTask() {
      if (stageTask !== undefined || taskLoading) return;

      fetchStageTask({
        stageId: stageData.id!,
        stageName: stageData.stage_name,
      });
    }

    fetchTask();
  }, [stageData.id, stageData.stage_name, stageTask, fetchStageTask]);

  const handleStatusOnChange = statusHandler(
    stageData.id!,
    stageData.stage_name
  );

  const displayHeaderText: Record<
    Exclude<TabTypes, "details">,
    { title: string; description: string }
  > = {
    requirements: {
      title: "Case Requirements",
      description:
        "Track all required documents and prerequisites for this case",
    },
    documents: {
      title: "Legal Documents",
      description: "         Manage all legal documents related to this case",
    },
    hearings: {
      title: "       Hearing/Case Proper",
      description: "   Schedule and track all hearings and court proceedings",
    },
  };

  const updateTask = (taskId: string) => {
    navigate(`form/${stageData.id}/${stageData.stage_name}/${taskId}`);
  };

  const addtask = () => {
    navigate(`form/${stageData.id!}/${stageData.stage_name}`);
  };

  const viewTask = (taskId: string) => {
    navigate(`task/${taskId}`);
  };

  return {
    handleStatusOnChange,
    displayHeaderText,

    updateTask,
    addtask,
    viewTask,
  };
};

export default useCaseStage;
