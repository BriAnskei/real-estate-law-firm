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
import {
  CaseTransactionTask,
  file_type,
  Stages,
  taskFileType,
} from "../../../store/Slice/case.slice";
import { TaskApi } from "../../../util/api/task.api";
import {
  CaseTransactionContextType,
  useCaseTransaction,
} from "../../../context/CaseTransactionContext";
import { TaskFileApi } from "../../../util/api/task_file.api";

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
  curUserRole?: Roles;
  isUpdating: boolean;
  assignedUserIdForUpdate?: string; // this param will be filled if the isUpdating is true
}) => {
  const { setAssignedUser, curUserRole, isUpdating, assignedUserIdForUpdate } =
    payload;

  // currUser role validation for role selection
  const isUserRoleValidForSelection =
    (curUserRole &&
      curUserRole !== Roles.paralegal &&
      curUserRole !== Roles.processServer) ||
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

  // handles selected user by id for update
  useEffect(() => {
    async function fetchSelectedUser() {
      if (!assignedUserIdForUpdate || !isUpdating) return;

      try {
        const userData = await UserApi.fetchById(assignedUserIdForUpdate);

        console.log("fetchd use date for update: ", userData);

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

  // manage roles selection
  const rolesOption = isUserRoleValidForSelection
    ? RoleBasedChoices[
        curUserRole as Exclude<Roles, Roles.processServer | Roles.paralegal>
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
  };
};

interface UploadedFile {
  id: string;
  file: File;
}
/**
 * Task form pdf uploads handler
 */
const useFormUploads = (payload: { isUpdating: boolean; taskId?: string }) => {
  const { isUpdating, taskId } = payload;

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  // this ref is used for update only
  const isUploadsInitialized = useRef(false);

  // handle fetch uploaded files
  useEffect(() => {
    async function fetchUploadedFiles() {
      if (!isUpdating || isUploadsInitialized.current) return;

      if (!taskId) return;
      console.log("fetching uploads");
      try {
        const res =
          (await TaskFileApi.fetchFiles({
            taskId,
            file_type: file_type.uploader,
          })) ?? [];

        if (res.length === 0) return;

        const enCodedData = await enCodeFetchFile(res);

        setUploadedFiles(enCodedData);
      } catch (error) {
        console.error(error);
      } finally {
        isUploadsInitialized.current = true;
      }
    }

    fetchUploadedFiles();
  }, [isUpdating, taskId]);

  const enCodeFetchFile = async (
    fetchedData: taskFileType[]
  ): Promise<UploadedFile[]> => {
    return await Promise.all(
      fetchedData.map(async (file: any) => {
        const fileUrl = `http://localhost:4000/${file.file_path.replace(
          /\\/g,
          "/"
        )}`;

        // Download the file binary
        const blob = await fetch(fileUrl).then((r) => r.blob());

        // Create a File Object with the orig file name
        const fileObj = new File([blob], file.original_name, {
          type: blob.type,
        });

        return {
          id: file.id.toString(),
          file: fileObj,
        };
      })
    );
  };

  const addFiles = (files: File[]) => {
    const newFiles: UploadedFile[] = files.map((file) => ({
      id: Math.random().toString(36).slice(2, 11).toString(),
      file: file,
    }));

    setUploadedFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== fileId));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const getFormData = useCallback((): FormData | undefined => {
    if (uploadedFiles.length === 0) return undefined;
    const formData = new FormData();

    uploadedFiles.forEach((f) => {
      formData.append("uploadedPdfFiles", f.file);
    });
    return formData;
  }, [uploadedFiles]);

  return {
    getFormData,
    uploadedFiles,
    addFiles,
    removeFile,
    formatFileSize,
    setUploadedFiles,
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
}) => {
  const navigate = useNavigate();
  const { stage, stageId, context } = payload;

  const {
    input,
    onChangeHandler,
    handleSelectedUser,
    setSubmitLoading,
    submitLoading,
  } = useFormInput();

  const pdfFileState = useFormUploads({ isUpdating: false });

  const { promiseToast } = useToast();

  const handleSubmit = useCallback(async () => {
    let newTask: CaseTransactionTask;
    await promiseToast(
      async () => {
        setSubmitLoading(true);
        newTask = await TaskApi.create({
          formData: input,
          stageName: stage,
          stageId,
          fileForm: pdfFileState.getFormData(),
        });

        return newTask; // VERY IMPORTANT
      },
      {
        loading: "Adding new task....",
        success: () => {
          context.addTask({ stage, newTask });
          navigate(-1);
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
  context: CaseTransactionContextType;
  stage: Stages;
  stageId: string;
}) => {
  const { taskId, context, stage, stageId } = payload;

  const {
    input,
    setInput,
    onChangeHandler,
    handleSelectedUser,
    setSubmitLoading,
    submitLoading,
  } = useFormInput();
  const pdfFileState = useFormUploads({ isUpdating: true, taskId });

  const [originalData, setOriginalData] = useState<
    CaseTransactionTask | undefined
  >(undefined);
  const [fetchingTaskLoading, setFetchingTaskLoading] = useState(false);

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

  const handleSubmit = useCallback(() => {
    try {
      setSubmitLoading(true);

      // TODO: make api requestion for task update
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitLoading(false);
    }
  }, [input]);

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
      })
    : useAddtask({
        caseId: id as string,
        stage: stage as Stages,
        stageId: stageId!,
        context,
      });

  const [taskLabel, setTaskLabel] = useState("Case Requirement");

  // handle thee assign task assign selection
  const userSelectionState = useUsersByRole({
    setAssignedUser: taskFormState.handleSelectedUser,
    curUserRole: curUser?.role,
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

    isSelectionRoleEnabled: true,

    taskLabel,

    isPageNotReady,
    goBack,
    isUpdating,
  };
};

export default useTaskForm;
