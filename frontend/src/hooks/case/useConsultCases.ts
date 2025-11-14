import { useViewConsultCaseModal } from "./useViewConsultCaseModal";

import { useAddNewConsultCase } from "./useAddNewConsultCaseModal";
import { useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { fetchAllUnpaidCases } from "../../store/Slice/case.slice";

const useConsultationCases = () => {
  const dispatch = useDispatch<AppDispatch>();
  const viewCaseModalState = useViewConsultCaseModal();

  const caseState = useSelector((state: RootState) => state.case);
  const addNewCaseModalState = useAddNewConsultCase(dispatch, caseState);
  const { unpaidIds: allIds, unpaidById: byId, totalPages } = caseState;

  useEffect(() => {
    async function fetchAll() {
      // only fetch when there is no data
      if (allIds.length > 0) return;

      try {
        await dispatch(fetchAllUnpaidCases()).unwrap();
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
    totalPages,
  };
};

export function dateDisplay(dateData: Date): string {
  const today = isToday(dateData);

  return today
    ? dateData.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : dateData.toLocaleString([], {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
}

function isToday(date: Date): boolean {
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}

export function isTodayOrWithin3Days(date: Date): boolean {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const consultDate = new Date(date);
  consultDate.setHours(0, 0, 0, 0);

  const diff = consultDate.getTime() - now.getTime();
  const threeDays = 3 * 24 * 60 * 60 * 1000;

  return diff >= 0 && diff <= threeDays;
}

export default useConsultationCases;
