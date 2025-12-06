import { useCallback, useEffect, useState } from "react";
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
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../store/selector/user/userSelector";

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
    stageName: Stages,
    caseId: string
  ) => (status: CaseStageStatus) => void;
  taskLoading: boolean;
}) => {
  const { id } = useParams();
  const currUser = useSelector(selectCurrentUser);
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
    stageData.stage_name,
    id as string
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

  const viewTask = useCallback(
    (payload: {
      assignTo: string;
      taskId: string;
      isTaskComplete: boolean;
      isTaskOnHearingAndCancelled?: boolean;
    }) => {
      const { assignTo, taskId, isTaskComplete, isTaskOnHearingAndCancelled } =
        payload;
      // wait for the curUserData before navigating
      if (!currUser) return;

      console.log("navigating", payload);

      if (
        assignTo.toString() === currUser.id!.toString() &&
        !isTaskComplete &&
        !isTaskOnHearingAndCancelled
      ) {
        // if user asigneee and task is pending go to task view
        navigate(`${stageData.stage_name}/task/${taskId}`);
      } else {
        // if user is not the asignnee or task is complete, process to review page,
        navigate(`${stageData.stage_name}/task/review/${taskId}`);
      }
    },
    [currUser, stageData]
  );

  return {
    handleStatusOnChange,
    displayHeaderText,

    updateTask,
    addtask,
    viewTask,

    taskDeleteState,

    currUser,
  };
};

export default useCaseStage;
