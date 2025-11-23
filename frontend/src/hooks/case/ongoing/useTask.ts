import { useEffect, useState } from "react";
import { CaseTransactionTask } from "../../../store/Slice/case.slice";
import { TaskApi } from "../../../util/api/task.api";

const useTask = (taskId?: string) => {
  const [task, setTask] = useState<CaseTransactionTask | undefined>(undefined);

  // loading flags
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetch() {
      setLoading(true);
      try {
        if (!taskId) return;

        const taskData = await TaskApi.getById(taskId);

        setTask(taskData);
      } catch (error) {
        console.error(error);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 2000);
      }
    }
    fetch();
  }, [taskId]);

  return {
    task,
    loading,
  };
};

export default useTask;
