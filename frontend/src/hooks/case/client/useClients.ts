import { useCallback, useEffect, useState } from "react";
import useClientSelector from "../../selectors/useClientSelector";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "../../../store/selector/authSelector";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../store/store";
import {
  deleteClient,
  fetchAllClients,
} from "../../../store/Slice/client.slice";
import { useToast } from "../../useToast";

export const useClient = () => {
  const { loading, byId, allIds } = useClientSelector();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const dispatch = useDispatch<AppDispatch>();

  const { errorToast, successToast } = useToast();

  const [search, setSearch] = useState<string | undefined>(undefined);

  const [fetchingLoading, setFetchingLoading] = useState(false);

  useEffect(() => {
    async function initialFetch() {
      setFetchingLoading(true);
      try {
        // cancel inital fetch if not authentiacet or already has data
        if (allIds.length > 0) return;
        else if (!isAuthenticated) return;

        await dispatch(fetchAllClients()).unwrap();
        setFetchingLoading(false);
      } catch (error) {
        console.error(error);
      }
    }

    initialFetch();
  }, [isAuthenticated]);

  const deleteData = useCallback(async (id: string) => {
    try {
      dispatch(deleteClient(id)).unwrap();

      successToast("Client successfully removed");
    } catch (error) {
      errorToast(error as string);
    }
  }, []);

  const clearFilter = () => {
    setSearch(undefined);
    // TODO: implememnt a dispatcher to to clear the filter state
  };

  return {
    setSearch,
    search,
    loading: loading || fetchingLoading,
    byId,
    allIds,
    deleteData,
    clearFilter,
  };
};
