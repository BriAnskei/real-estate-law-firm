import { useEffect, useMemo, useState } from "react";
import { Roles } from "../../../store/Slice/userSlice";
import { createChangeHandler } from "../../../util/createOnChangeHandler";
import { useParams } from "react-router";

export type TaskFormType = {
  title: string;
  description: string;
  assign_to: string;
  due_date: string;
};

interface UploadedFile {
  id: string;
  file: File;
}

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

const useAddtask = () => {
  const [input, setInput] = useState<TaskFormType>(initialInput);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const onChangeHandler = createChangeHandler<TaskFormType>(setInput);

  return { input, onChangeHandler, uploadedFiles };
};

const useUpdateTask = (taskId?: string) => {
  const [input, setInput] = useState<TaskFormType>(initialInput);

  const onChangeHandler = createChangeHandler<TaskFormType>(setInput);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const [fetchLoading, setFetchLoading] = useState(false);

  useEffect(() => {
    async function fetchInput() {
      if (!taskId) return;
      setFetchLoading(true);
      try {
        // fetch task input
        setFetchLoading(true);
      } catch (error) {
        console.error(error);
      }
    }
    fetchInput();
  }, [taskId]);

  return { input, onChangeHandler, uploadedFiles, fetchLoading };
};

const useTaskForm = () => {
  const { taskId } = useParams();

  const addTaskState = useAddtask();
  const updateTaskState = useUpdateTask(taskId);

  const taskFormState = useMemo(
    () => (taskId !== undefined ? updateTaskState : addTaskState),
    [addTaskState, updateTaskState, taskId]
  );

  return taskFormState;
};

export default useTaskForm;
