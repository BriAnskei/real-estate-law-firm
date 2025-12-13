import { useEffect, useRef } from "react";
import { useCaseTransaction } from "../../../context/CaseTransactionContext";
import { debouncer } from "../../../util/debouncer";
import { CaseStagesType } from "../../../store/Slice/case.slice";

const useTaskFilter = (stageData: CaseStagesType) => {
  const {
    taskFilterOption,
    setTaskFilterOption,
    handleTaskFilter,
    isOnTaskFilter,
  } = useCaseTransaction();

  const debouncerFilterRef = useRef<ReturnType<typeof debouncer> | null>(null);

  useEffect(() => {
    if (!debouncerFilterRef.current)
      debouncerFilterRef.current = debouncer(handleTaskFilter, 400);
  }, []);

  useEffect(() => {
    if (isOnTaskFilter) {
      debouncerFilterRef.current!({
        filter: taskFilterOption,
        stageId: stageData.id!,
      });
    }
  }, [taskFilterOption, isOnTaskFilter, stageData.id, stageData.stage_name]);

  return {
    filterOption: taskFilterOption,
    setFilterOption: setTaskFilterOption,
  };
};

export default useTaskFilter;
