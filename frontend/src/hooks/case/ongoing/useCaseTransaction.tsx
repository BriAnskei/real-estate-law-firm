import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  CaseStageStatus,
  CaseStagesType,
  CaseTransactionTask,
  Stages,
} from "../../../store/Slice/case.slice";
import {
  TabTypes,
  useCaseTransaction,
} from "../../../context/CaseTransactionContext";
import { Roles, UserType } from "../../../store/Slice/userSlice";
import { useSelector } from "react-redux";
import {
  makeSelectUsersByRole,
  selectCurrentUser,
} from "../../../store/selector/user/userSelector";
import { UserApi } from "../../../util/api/user.api";
import { debouncer } from "../../../util/debouncer";
import { createChangeHandler } from "../../../util/createOnChangeHandler";
import { useToast } from "../../useToast";
import { TaskApi } from "../../../util/api/task.api";

export type TaskFormType = {
  title: string;
  description: string;
  assign_to: string;
  due_date: string;
};

const initialInput: TaskFormType = {
  title: "",
  description: "",
  assign_to: "",
  due_date: "",
};

export const RoleBasedChoices: Record<
  Exclude<Roles, Roles.processServer | Roles.paralegal>,
  { value: string; text: string }[]
> = {
  [Roles.foundingManager]: [
    { value: "lawyer", text: "Lawyer" },
    { value: "paralegal", text: "Paralegal" },
    { value: "process-server", text: "Process Server" },
  ],
  [Roles.lawyer]: [
    { value: "paralegal", text: "Paralegal" },
    { value: "process-server", text: "Process Server" },
  ],
};

const useTaskModal = () => {
  const { addTask } = useCaseTransaction();
  const currUser = useSelector(selectCurrentUser);
  const { promiseToast, errorToast } = useToast();

  const isSelectionAllowed =
    currUser?.role === Roles.foundingManager || currUser?.role === Roles.lawyer;

  const [isOpen, setIsOpen] = useState(false);
  const [taskDetails, setTaskDetails] = useState<
    { stage: Stages; stageId: string } | undefined
  >(undefined);

  // input
  const [taskInput, setTaskInput] = useState<TaskFormType>(initialInput);
  const [selectedRole, setSelectedRole] = useState<
    Exclude<Roles, Roles.foundingManager> | undefined
  >(undefined);

  // input query
  const [nameInput, setNameInput] = useState("");

  // selected data
  const [selectedUsersByRole, setSelectedUsersByRole] = useState<
    UserType[] | undefined
  >(undefined);
  const [fetchLoading, setFetchLoding] = useState(false);

  // modal header label
  const [taskTypeLabel, setTaskTypeLabel] = useState("Case Requirment");
  useEffect(() => {
    if (!isOpen || !taskDetails) return;

    switch (taskDetails.stage) {
      case "MANAGE_REQUIREMENTS":
        setTaskTypeLabel("Case Requirment");
        break;
      case "FILING_DOCS":
        setTaskTypeLabel("Legal Document");
        break;
      case "HEARING":
        setTaskTypeLabel("Hearing/Case Proper");
        break;
      default:
        throw new Error("Invalid selected type");
    }
  }, [taskDetails, isOpen]);

  // fetcher effect deepending on the role
  const debouncedFetchSelectedRole = useMemo(
    () =>
      debouncer(async (role, isSelectionAllowed: boolean) => {
        try {
          // not selection allowed for paralegal
          if (!isSelectionAllowed) {
            const response = await UserApi.fetchByRole(Roles.processServer);
            setSelectedUsersByRole(response);
            return;
          }

          const response = await UserApi.fetchByRole(role);
          setSelectedUsersByRole(response);
        } catch (err) {
          console.error(err);
        } finally {
          setFetchLoding(false);
        }
      }, 400),
    []
  );

  useEffect(() => {
    if ((isSelectionAllowed && !selectedRole) || !isOpen) return;
    setFetchLoding(true);
    debouncedFetchSelectedRole(selectedRole!, isSelectionAllowed);
  }, [selectedRole, isSelectionAllowed]);

  const taskInputOnchangeHandler =
    createChangeHandler<TaskFormType>(setTaskInput);

  const handleSelectAssignedUser = (payload: {
    userId: string;
    name: string;
  }) => {
    const { userId, name } = payload;
    setNameInput(name);
    setTaskInput((prev) => ({ ...prev, assign_to: userId }));
  };

  const openModal = useCallback(
    (payload: { stage: Stages; stageId: string }) => {
      setTaskDetails(payload);
      setIsOpen(true);
    },
    []
  );

  const closeModal = useCallback(() => {
    setTaskInput(initialInput);
    setTaskDetails(undefined);
    setSelectedUsersByRole(undefined);
    setSelectedRole(undefined);
    setIsOpen(false);
  }, []);

  useEffect(() => {
    console.log("task Input update: ", taskInput);
  }, [taskInput]);

  const onSubmit = useCallback(async () => {
    const response = verifyInput();

    if (!response.valid) return errorToast(response.message!);

    let newTask: CaseTransactionTask;
    await promiseToast(
      async () => {
        newTask = await TaskApi.create({
          formData: taskInput,
          stageName: taskDetails?.stage!,
          stageId: taskDetails?.stageId!,
        });
      },
      {
        loading: "Adding new task",
        success: (_: void) => {
          addTask({ stage: taskDetails?.stage!, newTask });
          closeModal();
          return "New Task has been added";
        },
        error: (err) => `Failed to add new task: ${err || "Unkown error"}`,
      }
    );
  }, [taskInput, taskDetails]);

  const verifyInput = useCallback(() => {
    if (
      !taskInput.assign_to.trim() ||
      !taskInput.description.trim() ||
      !taskInput.due_date.trim() ||
      !taskInput.title.trim()
    ) {
      return { valid: false, message: "Please fill in all the fields." };
    }

    if (taskInput.due_date < new Date().toISOString().split("T")[0]) {
      return { valid: false, message: "Due date cannot be in the past" };
    }

    return { valid: true };
  }, [taskInput]);

  const displayData =
    nameInput !== ""
      ? selectedUsersByRole?.filter((user) =>
          (user.firstName + user.lastName)
            .toLowerCase()
            .includes(nameInput.toLowerCase())
        )
      : selectedUsersByRole;

  return {
    openModal,
    closeModal,

    isOpen,
    taskDetails,
    taskTypeLabel,

    isSelectionAllowed,
    // role selection option, if so return the option of selection
    ...(isSelectionAllowed
      ? {
          RolesOption:
            RoleBasedChoices[
              currUser.role as Exclude<
                Roles,
                Roles.processServer | Roles.paralegal
              >
            ],
        }
      : undefined),
    displayData,
    fetchLoading,
    onSubmit,

    handleSelectAssignedUser,
    setSelectedRole,
    selectedRole,
    taskInputOnchangeHandler,
    taskInput,

    // query
    setNameInput,
    nameInput,
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

export default useCaseStage;
