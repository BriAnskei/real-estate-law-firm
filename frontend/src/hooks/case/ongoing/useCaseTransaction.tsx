import { useCallback, useEffect, useRef, useState } from "react";
import {
  CaseStageStatus,
  CaseStagesType,
  CaseTransactionTask,
  Stages,
} from "../../../store/Slice/case.slice";
import { TabTypes } from "../../../context/CaseTransactionContext";

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
  const { stageData, stageTask, fetchStageTask, statusHandler, taskLoading } =
    payload;
  const addTaskState = useTaskModal();

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

  return { handleStatusOnChange, displayHeaderText, addTaskState };
};

const useTaskModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [taskDetails, setTaskDetails] = useState<
    { stage: Stages; stageId: string } | undefined
  >(undefined);

  const openModal = useCallback(
    (payload: { stage: Stages; stageId: string }) => {
      setTaskDetails(payload);
      setIsOpen(true);
    },
    []
  );

  const closeModal = useCallback(() => {
    setTaskDetails(undefined);
    setIsOpen(false);
  }, []);

  return {
    openModal,
    closeModal,
    isOpen,
    taskDetails,
  };
};

export default useCaseStage;
