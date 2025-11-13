import { useViewConsultCaseModal } from "./useViewConsultCaseModal";

import { useAddNewConsultCase } from "./useAddNewConsultCaseModal";
import { useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { fetchAllCases } from "../../store/Slice/case.slice";

export const useCases = () => {
  const dispatch = useDispatch<AppDispatch>();
  const viewCaseModalState = useViewConsultCaseModal();
  const addNewCaseModalState = useAddNewConsultCase(dispatch);
  const { byId, allIds } = useSelector((state: RootState) => state.case);

  useEffect(() => {
    async function fetchAll() {
      // only fetch when there is no data
      if (allIds.length > 0) return;

      try {
        await dispatch(fetchAllCases()).unwrap();
      } catch (error) {
        console.log(error);
      }
    }

    fetchAll();
  }, []);

  return {
    viewCaseModalState,
    addNewCaseModalState,
    allIds,
    byId,
  };
};
