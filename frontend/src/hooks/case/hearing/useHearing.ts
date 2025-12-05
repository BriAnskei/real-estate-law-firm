import { useCallback, useEffect, useState } from "react";

import { HearingType } from "../../../types/HearingTypes";
import { useCaseTransaction } from "../../../context/CaseTransactionContext";
import { useParams } from "react-router";
import { HearingApi } from "../../../util/api/hearing.api";
import useHearingDeletionModal from "./useHearingDeletionModal";
import useHearingScheduleFormModal from "./useHearingScheduleFormModal";
import usePosponedHearingFormModal from "./usePostponedHearingFormModal";
import useHearingPostponedHistoryModal from "./useHearingPostponedHistoryModal";

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

  const postponeHearing = (payload: {
    hearingId: string;
    new_date: string;
  }) => {
    const { hearingId, new_date } = payload;
    setHearings((prev) =>
      prev?.map((h) =>
        h.id === hearingId ? { ...h, scheduled_date: new_date } : h
      )
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
    postponeHearing,
    deleteHearing,
  };
};

export type HearingStatus =
  | "scheduled"
  | "postponed"
  | "completed"
  | "cancelled";

const useCaseHearingPage = () => {
  const {
    clientData,
    caseData,
    loading: caseDataLoading,
  } = useCaseTransaction();

  // handles all the hearing schdule data state
  const hearingsState = useCaseHearings();

  /**
   * Handles the adding/update(only the type of hearing) schdule
   */
  const hearingFormModal = useHearingScheduleFormModal({
    addNewHearing: hearingsState.addNewHearing,
    updateHearingType: hearingsState.updateHearingType,
  });

  const hearingDeleteModal = useHearingDeletionModal({
    deleteHearing: hearingsState.deleteHearing,
  });

  /**
   * Handles the posponed form submition/type edit
   */
  const hearingPostponedState = usePosponedHearingFormModal({
    postponeHearing: hearingsState.postponeHearing,
  });

  /**
   * Hearing postponements history
   */
  const hearingPostponedHistoryState = useHearingPostponedHistoryModal();

  const handleStatusOnChange = (
    payload: { hearing_id: string; old_date: string },
    status: HearingStatus
  ) => {
    switch (status) {
      case "postponed":
        hearingPostponedState.open(payload);
        break;

      default:
        throw new Error("Unkown Status");
    }
  };

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
    hearingPostponedState,
    hearingPostponedHistoryState,

    hearings: hearingsState.hearings,
    loading,

    caseConcern: caseData?.concern,
    caseFiledAt: caseData?.created_at,
    clientName: clientData?.client_name,

    // functions
    handleStatusOnChange,
  };
};

export default useCaseHearingPage;
