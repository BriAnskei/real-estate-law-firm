import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Roles, UserType } from "../../../store/Slice/userSlice";
import { createChangeHandler } from "../../../util/createOnChangeHandler";
import { useNavigate, useParams } from "react-router-dom";
import { UserApi } from "../../../util/api/user.api";
import { debouncer } from "../../../util/debouncer";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../store/selector/user/userSelector";
import { RootState } from "../../../store/store";
import { useToast } from "../../useToast";
import { CaseTransactionTask, Stages } from "../../../store/Slice/case.slice";
import { TaskApi } from "../../../util/api/task.api";
import {
  CaseTransactionContextType,
  useCaseTransaction,
} from "../../../context/CaseTransactionContext";
import useFormUploads from "./useFormUploads";

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

// handle form inputs
const useFormInput = () => {
  const [input, setInput] = useState<TaskFormType>(initialInput);
  const [submitLoading, setSubmitLoading] = useState(false);

  const onChangeHandler = createChangeHandler<TaskFormType>(setInput);

  const handleSelectedUser = (id: string) => {
    setInput((prev) => ({ ...prev, assign_to: id }));
  };

  return {
    input,
    setInput,
    onChangeHandler,
    handleSelectedUser,
    submitLoading,
    setSubmitLoading,
  };
};

// handles user selection for this task
const useUsersByRole = (payload: {
  setAssignedUser: (id: string) => void;
  currentUser: UserType;
  isUpdating: boolean;
  assignedUserIdForUpdate?: string; // this param will be filled if the isUpdating is true
}) => {
  const { setAssignedUser, currentUser, isUpdating, assignedUserIdForUpdate } =
    payload;

  const [assignmentType, setAssignmentType] = useState<"user" | "myself">(
    "user"
  );

  // currUser role validation for role selection
  const isUserRoleValidForSelection =
    (currentUser.role &&
      currentUser.role !== Roles.paralegal &&
      currentUser.role !== Roles.processServer) ||
    false;

  const [nameInput, setNameInput] = useState("");
  const [selectedRole, setSelectedRole] = useState<
    Exclude<Roles, Roles.foundingManager> | undefined
  >(undefined);

  const [userByRole, setUserByRole] = useState<UserType[] | undefined>(
    undefined
  );
  const [fetchingUsersLoading, setFetchingUsersLoading] = useState(false);

  const debouncedFetchSelectedRole = useMemo(
    () =>
      debouncer(async (role: Roles, isSelectionAllowed: boolean) => {
        try {
          // not selection allowed for paralegal
          if (!isSelectionAllowed) {
            const response = await UserApi.fetchByRole(Roles.processServer);
            setUserByRole(response);
            return;
          }

          const response = await UserApi.fetchByRole(role);
          setUserByRole(response);
        } catch (err) {
          console.error(err);
        } finally {
          setFetchingUsersLoading(false);
        }
      }, 400),
    []
  );
  useEffect(() => {
    if (isUserRoleValidForSelection && !selectedRole) return;
    setFetchingUsersLoading(true);
    debouncedFetchSelectedRole(selectedRole!, isUserRoleValidForSelection!);
  }, [selectedRole, isUserRoleValidForSelection]);

  // update effect
  useEffect(() => {
    async function fetchSelectedUser() {
      if (!assignedUserIdForUpdate || !isUpdating) return;

      try {
        if (assignedUserIdForUpdate.toString() === currentUser.id!.toString()) {
          setAssignmentType("myself");
          return;
        }

        const userData = await UserApi.fetchById(assignedUserIdForUpdate);

        setSelectedRole(userData.role as Exclude<Roles, Roles.foundingManager>);
        setNameInput(`${userData.firstName} ${userData.lastName}`);
      } catch (error) {
        console.error(error);
      }
    }
    fetchSelectedUser();
  }, [assignedUserIdForUpdate, isUpdating]);

  // onfilter data
  const displayData =
    nameInput !== ""
      ? userByRole?.filter((user) =>
          (user.firstName + user.lastName)
            .toLowerCase()
            .includes(nameInput.toLowerCase())
        )
      : userByRole;

  // user selection
  const hanldeDropdownSelection = (payload: {
    userId: string;
    name: string;
  }) => {
    const { userId, name } = payload;

    setNameInput(name);
    setAssignedUser(userId);
  };

  // user role selection
  const handleRoleSelection = (role: Exclude<Roles, Roles.foundingManager>) => {
    setSelectedRole(role);
    setNameInput("");
  };

  const selectAssignType = useCallback((selectection: "user" | "myself") => {
    if (selectection === "myself") {
      setAssignedUser(currentUser.id!.toString());
    }

    setAssignmentType(selectection);
  }, []);

  // manage roles selection
  const rolesOption = isUserRoleValidForSelection
    ? RoleBasedChoices[
        currentUser.role as Exclude<
          Roles,
          Roles.processServer | Roles.paralegal
        >
      ]
    : undefined;

  return {
    selectedUsersByRole: displayData,
    fetchingUsersLoading,

    setNameInput,
    nameInput,

    hanldeDropdownSelection,
    rolesOption,
    selectedRole,
    handleRoleSelection,

    // assigntype selection
    selectAssignType,
    assignmentType,

    isUserRoleValidForSelection,
  };
};

/**
 * hanlde new task
 */
const useAddtask = (payload: {
  caseId: string;
  stage: Stages;
  stageId: string;
  context: CaseTransactionContextType;
  hearingId?: string;
}) => {
  const navigate = useNavigate();
  const { stage, stageId, context, caseId, hearingId } = payload;

  const {
    input,
    onChangeHandler,
    handleSelectedUser,
    setSubmitLoading,
    submitLoading,
  } = useFormInput();

  const pdfFileState = useFormUploads({ isUpdating: false });

  const { promiseToast, errorToast } = useToast();

  const inputValitation = useCallback((): {
    valid: boolean;
    message?: string;
  } => {
    if (
      !input.assign_to.trim() ||
      !input.title.trim() ||
      !input.description.trim()
    ) {
      return { valid: false, message: "please complete the form input" };
    }

    if (!input.due_date || !input.due_date.trim()) {
      return {
        valid: false,
        message: "please select a due date for this task",
      };
    }

    return { valid: true };
  }, [input]);

  const handleSubmit = useCallback(async () => {
    const inputValidation = inputValitation();

    if (!inputValidation.valid)
      return errorToast(inputValidation.message ?? "Input error");

    let newTask: CaseTransactionTask;
    await promiseToast(
      async () => {
        setSubmitLoading(true);
        newTask = await TaskApi.create({
          formData: input,
          stage_name: stage,
          stageId,
          fileForm: pdfFileState.getFormData(),
          case_id: caseId,
          ...(stage === "HEARING" && { hearingId: hearingId }),
        });

        return newTask; // VERY IMPORTANT
      },
      {
        loading: "Adding new task....",
        success: () => {
          context.addTask({ stage, newTask });
          navigate(`/case/transaction/${caseId}`, { replace: true });
          return "New Task has been added";
        },
        error: (err) => `Failed to add new task: ${err || "Unknown error"}`,
      }
    );
    setSubmitLoading(false);
  }, [input, pdfFileState.uploadedFiles]);

  return {
    input,
    onChangeHandler,

    handleSelectedUser,
    handleSubmit,
    fetchingTaskLoading: false, // constant false, no need to fetch
    ...pdfFileState,
    submitLoading,

    originalData: undefined, // no  original data for updating
    assignedUserIdForUpdate: undefined, // updatee state
  };
};

/**
 *
 * handles update task
 */
const useUpdateTask = (payload: {
  taskId?: string;
  caseId?: string;
  context: CaseTransactionContextType;
  stage: Stages;
  stageId: string;
}) => {
  const navigate = useNavigate();
  const { taskId, context, stage, caseId } = payload;

  const {
    input,
    setInput,
    onChangeHandler,
    handleSelectedUser,
    setSubmitLoading,
    submitLoading,
  } = useFormInput();

  // file state hook
  const pdfFileState = useFormUploads({ isUpdating: true, taskId });

  const [originalData, setOriginalData] = useState<TaskFormType | undefined>(
    undefined
  );
  const [fetchingTaskLoading, setFetchingTaskLoading] = useState(false);

  const { promiseToast } = useToast();

  // refence flag for fetch
  const isInitialized = useRef(false);

  useEffect(() => {
    async function fetchInput() {
      if (!taskId || !context || isInitialized.current) return;

      setFetchingTaskLoading(true);
      try {
        // initialize  input from context
        const taskData = await TaskApi.getById(taskId);

        setOriginalData(taskData);

        // initialize input
        setInput((prev) => ({
          ...prev!,
          title: taskData.title,
          description: taskData.description,
          assign_to: taskData.assign_to,
          due_date: new Date(taskData.due_date).toISOString().split("T")[0],
        }));
      } catch (error) {
        console.error(error);
      } finally {
        setFetchingTaskLoading(false);
        isInitialized.current = true;
      }
    }
    fetchInput();
  }, [taskId]);

  // check input updates before we process submit
  const enCodeUpdateData = useCallback((): FormData | undefined => {
    if (!originalData) return undefined;
    const formData = new FormData();
    const uploadedFiles = pdfFileState.getFormData();

    // compare the original data with the current input
    for (var key in input) {
      const k = key as keyof TaskFormType;

      if (input[k] !== originalData[k]) {
        formData.append(k, input[k]);
      }
    }

    // add the formData from the pdf file hook
    if (uploadedFiles) {
      for (var [key, value] of uploadedFiles.entries()) {
        formData.append(key, value);
      }
    }

    const isEmpty = Array.from(formData.entries()).length === 0;

    return isEmpty ? undefined : formData;
  }, [
    originalData,
    input,
    pdfFileState.uploadedFiles,
    pdfFileState.getFormData,
  ]);

  const handleSubmit = useCallback(async () => {
    const updatedDataForm = enCodeUpdateData();

    setSubmitLoading(true);

    let updateTask: CaseTransactionTask;
    await promiseToast(
      async () => {
        if (!updatedDataForm && !pdfFileState.isThereFilesUploaded) return;

        updateTask = await TaskApi.update({
          case_id: caseId!,
          stage_name: stage,
          updateForm: updatedDataForm!,
          task_id: taskId!,
        });
      },
      {
        loading: "Updating task....",
        success: () => {
          updateTaskContextState(updateTask);
          navigate(`/case/transaction/${caseId}`, { replace: true });
          return "Task has been updated";
        },
        error: (err) => `Failed to update task: ${err || "Unknown error"}`,
      }
    );

    setSubmitLoading(true);
  }, [enCodeUpdateData, context.updateTask]);

  const updateTaskContextState = useCallback(
    (updatedTask: CaseTransactionTask) => {
      context.updateTask({ taskId: taskId!, updatedTask, stage });
      navigate(-1);
    },
    [handleSubmit, taskId, input, stage]
  );

  return {
    ...pdfFileState,
    input,
    onChangeHandler,
    fetchingTaskLoading,
    handleSelectedUser,
    handleSubmit,
    submitLoading,

    originalData,

    assignedUserIdForUpdate: originalData?.assign_to,
  };
};

const useTaskForm = () => {
  const context = useCaseTransaction();
  const curUser = useSelector(selectCurrentUser);
  const { accessToken } = useSelector((state: RootState) => state.auth);

  const { taskId, stage, stageId, id } = useParams();

  const navigate = useNavigate();

  // conditional stateg usage for add or updatee
  const isUpdating = Boolean(taskId);
  const taskFormState = isUpdating
    ? useUpdateTask({
        taskId,
        stage: stage as Stages,
        stageId: stageId!,
        context,
        caseId: id,
      })
    : useAddtask({
        caseId: id as string,
        stage: stage as Stages,
        stageId: stageId!,
        context,
        hearingId: context.selectedHearing?.id,
      });

  const [taskLabel, setTaskLabel] = useState("Case Requirement");

  // handle thee assign task assign selection
  const userSelectionState = useUsersByRole({
    setAssignedUser: taskFormState.handleSelectedUser,
    currentUser: curUser!,
    isUpdating,
    assignedUserIdForUpdate: taskFormState.assignedUserIdForUpdate,
  });

  // // initialize role selection and files  for update
  // const initializeSel;

  // handle task lable
  useEffect(() => {
    if (!stage) return;

    switch (stage) {
      case "MANAGE_REQUIREMENTS":
        setTaskLabel("Case Requirement");
        break;
      case "FILING_DOCS":
        setTaskLabel("Legal Document");
        break;
      case "HEARING":
        setTaskLabel("Hearing/Case Proper");
        break;
      default:
        throw new Error("Invalid selected type");
    }
  }, [stage]);

  const isPageNotReady = !accessToken || !curUser;

  const goBack = () => {
    navigate(`/case/transaction/${id}`, { replace: true });
  };

  return {
    ...taskFormState,
    ...userSelectionState,

    taskLabel,

    isPageNotReady,
    goBack,
    isUpdating,
  };
};

export default useTaskForm;
