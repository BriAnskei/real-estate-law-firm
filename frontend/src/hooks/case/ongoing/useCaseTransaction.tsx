import { useEffect, useState } from "react";
import {
  CaseStageStatus,
  CaseStagesType,
  CaseTransactionTask,
  Stages,
} from "../../../store/Slice/case.slice";
import {
  CaseTransactionContextType,
  TabTypes,
  useCaseTransaction,
} from "../../../context/CaseTransactionContext";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "../../useToast";
import { TaskApi } from "../../../util/api/task.api";

const useDeleteTaskModal = (
  stage: Stages,
  caseTransactionContext: CaseTransactionContextType
) => {
  const { id } = useParams();
  const { promiseToast } = useToast();

  const [isOpen, setIsOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);

  const [deleteLoading, setDeleteLoading] = useState(false);

  const openModal = (id: string) => {
    setSelectedId(id);
    setIsOpen(true);
  };

  const closeModal = () => {
    setSelectedId(undefined);
    setIsOpen(false);
  };

  const deleteTask = async () => {
    if (!selectedId) return;

    setDeleteLoading(true);
    await promiseToast(
      async () => {
        await TaskApi.delete({
          case_id: id!,
          stage_name: stage,
          task_id: selectedId,
        });
      },
      {
        loading: "Deleting task....",
        success(_: void) {
          caseTransactionContext.deleteTask({ taskId: selectedId, stage });

          closeModal();
          return "Task deleted successfully";
        },
        error: (err) => `Failed to delete tas: ${err || "unknown error"}`,
      }
    );
    setDeleteLoading(false);
  };

  return {
    isOpen,
    openModal,
    closeModal,
    deleteTask,
    deleteLoading,
  };
};

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
  const caseTransactionContext = useCaseTransaction();

  const navigate = useNavigate();

  const { stageData, stageTask, fetchStageTask, statusHandler, taskLoading } =
    payload;

  const taskDeleteState = useDeleteTaskModal(
    stageData.stage_name,
    caseTransactionContext
  );

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

  // Navigation
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

    taskDeleteState,
  };
};

export default useCaseStage;
