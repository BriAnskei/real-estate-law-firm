import { useCallback, useEffect, useState } from "react";
import useHearingScheduleModal from "./useHearingScheduleModal";
import { HearingType } from "../../../types/HearingTypes";
import { useCaseTransaction } from "../../../context/CaseTransactionContext";
import { useParams } from "react-router";
import { HearingApi } from "../../../util/api/hearing.api";
import useHearingDeletionModal from "./useHearingDeletionModal";

const useCaseHearings = () => {
  const { id } = useParams();

  const [hearings, setHearings] = useState<HearingType[] | undefined>(
    undefined
  );

  const [fetchingHearings, setFetcingHearings] = useState(false);

  useEffect(() => {
    async function fetcHearings() {
      if (!id) return;
      setFetcingHearings(true);
      try {
        const response = await HearingApi.getAll(id);

        setHearings(response);
        setFetcingHearings(false);
      } catch (error) {
        console.error(error);
      }
    }
    fetcHearings();
  }, [id]);

  const addNewHearing = (payload: HearingType) => {
    setHearings((prev) => [...(prev ?? []), payload]);
  };

  const updateHearingType = (payload: { id: string; newType: string }) => {
    const { id, newType } = payload;
    setHearings((prev) =>
      prev?.map((h) => (h.id === id ? { ...h, type: newType } : h))
    );
  };

  const deleteHearing = useCallback(
    (hearingId: string) => {
      setHearings((prev) => prev?.filter((h) => h.id !== hearingId));
    },
    [setHearings]
  );

  return {
    hearings,
    addNewHearing,
    fetchingHearings,
    updateHearingType,
    deleteHearing,
  };
};

const useCaseHearingPage = () => {
  const {
    clientData,
    caseData,
    loading: caseDataLoading,
  } = useCaseTransaction();

  // handles all the hearing schdule data state
  const hearingsState = useCaseHearings();

  const hearingFormModal = useHearingScheduleModal({
    addNewHearing: hearingsState.addNewHearing,
    updateHearingType: hearingsState.updateHearingType,
  });

  const hearingDeleteModal = useHearingDeletionModal({
    deleteHearing: hearingsState.deleteHearing,
  });

  /**
   * global loading flag
   */
  const loading =
    caseDataLoading ||
    hearingsState.fetchingHearings ||
    !clientData ||
    !caseData;

  return {
    hearingFormModal,
    hearingDeleteModal,

    hearings: hearingsState.hearings,
    loading,

    caseConcern: caseData?.concern,
    caseFiledAt: caseData?.created_at,
    clientName: clientData?.client_name,
  };
};

export default useCaseHearingPage;
