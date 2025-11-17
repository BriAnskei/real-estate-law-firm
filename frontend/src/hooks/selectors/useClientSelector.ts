import { useSelector } from "react-redux";
import {
  selectClientEntities,
  selectClientIds,
  selectClientLoading,
} from "../../store/selector/clientSelector";
import { useEffect } from "react";

const useClientSelector = () => {
  const loading = useSelector(selectClientLoading);
  const allIds = useSelector(selectClientIds);
  const byId = useSelector(selectClientEntities);

  useEffect(() => {
    console.log("updated: ", allIds, loading);
  }, [loading, allIds]);

  return {
    loading,
    byId,
    allIds,
  };
};

export default useClientSelector;
