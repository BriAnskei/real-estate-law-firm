import { useSelector } from "react-redux";
import {
  selectClientEntities,
  selectClientIds,
  selectClientLoading,
  selectFilterClientEntities,
  selectFilterClientIds,
  selectFilterClientLoading,
} from "../../store/selector/clientSelector";

const useClientSelector = () => {
  const loading = useSelector(selectClientLoading);
  const allIds = useSelector(selectClientIds);
  const byId = useSelector(selectClientEntities);

  const filterloading = useSelector(selectFilterClientLoading);
  const filterIds = useSelector(selectFilterClientIds);
  const filterbyId = useSelector(selectFilterClientEntities);

  return {
    loading,
    byId,
    allIds,
    filterloading,
    filterIds,
    filterbyId,
  };
};

export default useClientSelector;
