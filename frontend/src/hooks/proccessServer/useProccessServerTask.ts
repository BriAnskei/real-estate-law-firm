import { useCallback, useEffect, useRef, useState } from "react";
import { CaseTransactionTask } from "../../store/Slice/case.slice";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../store/selector/user/userSelector";
import { Roles, UserType } from "../../store/Slice/userSlice";
import { TaskApi } from "../../util/api/task.api";
import { debouncer } from "../../util/debouncer";
import { ProcessServerTask } from "../../types/ProcessServerTaskType";

const useTaskFiler = ({ currUser }: { currUser?: UserType }) => {
  const [query, setQuery] = useState("");

  const [filteredTask, setFilteredTask] = useState<
    ProcessServerTask[] | undefined
  >(undefined);
  const [isFiltering, setIsFiltering] = useState(false);

  // debouncer
  const debounceRef = useRef<ReturnType<typeof debouncer> | undefined>(
    undefined
  );

  // handler filter
  useEffect(() => {
    if (query.trim() && debounceRef.current) {
      setIsFiltering(true);

      debounceRef.current(query);
    } else {
      clearFilter();
      setIsFiltering(false);
    }
  }, [query]);

  const handleFilter = useCallback(
    async (query: string) => {
      if (!currUser) return;

      try {
        const response = await TaskApi.filterByProcessServer({
          query,
          assignee_id: currUser.id!,
        });

        setFilteredTask(response);
      } catch (error) {
        console.error(error);
      } finally {
        setIsFiltering(false);
      }
    },
    [currUser]
  );

  useEffect(() => {
    debounceRef.current = debouncer(handleFilter, 400);
  }, [handleFilter]);

  const clearFilter = () => {
    setQuery("");
    setFilteredTask(undefined);
  };

  return {
    query,
    setQuery,
    isFiltering,
    onFiltered: !!query.length,

    filteredTask,
    clearFilter,
  };
};

const useProcessServerTask = () => {
  const currUser = useSelector(selectCurrentUser);

  const [AllTask, setAllTask] = useState<ProcessServerTask[] | undefined>(
    undefined
  );
  const [isLoading, setIsLoading] = useState(false);

  const filterTaskState = useTaskFiler({ currUser: currUser ?? undefined });

  useEffect(() => {
    async function fetchTask() {
      if (!currUser || currUser.role !== Roles.processServer) return;
      setIsLoading(true);
      try {
        const response = await TaskApi.getByProcessServer(currUser.id!);

        setAllTask(response);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchTask();
  }, [currUser]);

  const loading = isLoading || filterTaskState.isFiltering;

  const tasksData = filterTaskState.onFiltered
    ? filterTaskState.filteredTask
    : AllTask;

  return {
    loading,
    tasksData,

    filterTaskState,
  };
};

export default useProcessServerTask;
