import { useCallback, useEffect, useState } from "react";
import { HearingStatusType, HearingType } from "../../../types/HearingTypes";
import { useCaseTransaction } from "../../../context/CaseTransactionContext";
import { useParams } from "react-router";
import { HearingApi } from "../../../util/api/hearing.api";
import useHearingDeletionModal from "./useHearingDeletionModal";
import useHearingScheduleFormModal from "./useHearingScheduleFormModal";
import usePosponedHearingFormModal from "./usePostponedHearingFormModal";
import useHearingPostponedHistoryModal from "./useHearingPostponedHistoryModal";
import useHearingCancellationFormModal from "./useHearingCancellationFormModal";
import useHearingCancellationViewModal from "./useHearingCancellationViewModal";

import useHearingCompletionModal from "./useHearingCompletionModal";
import { useHearingFilter } from "./useHearingFilter";

const useCaseHearings = () => {
  const { id } = useParams();

  const filteredHearingState = useHearingFilter();

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

  const updateStatus = useCallback(
    (hearingId: string, newStatus: HearingStatusType) => {
      setHearings((prev) =>
        prev?.map((h) => (h.id === hearingId ? { ...h, status: newStatus } : h))
      );
    },
    [setHearings]
  );

  const deleteHearing = useCallback(
    (hearingId: string) => {
      setHearings((prev) => prev?.filter((h) => h.id !== hearingId));
    },
    [setHearings]
  );

  const displayData = filteredHearingState.onFiltered
    ? filteredHearingState.filteredHearings
    : hearings;

  return {
    displayData,
    addNewHearing,
    updateStatus,
    fetchingHearings: fetchingHearings,
    filterLoading: filteredHearingState.loadingFilter,
    updateHearingType,
    postponeHearing,
    deleteHearing,
    filteredHearingState,
  };
};

// for hearing table dropdown
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

    isHearingStageComplete,
  } = useCaseTransaction();

  const hearingsState = useCaseHearings();

  const hearingFormModal = useHearingScheduleFormModal({
    addNewHearing: hearingsState.addNewHearing,
    updateHearingType: hearingsState.updateHearingType,
  });

  const hearingDeleteModal = useHearingDeletionModal({
    deleteHearing: hearingsState.deleteHearing,
  });

  const hearingPostponedState = usePosponedHearingFormModal({
    postponeHearing: hearingsState.postponeHearing,
  });

  const hearingPostponedHistoryState = useHearingPostponedHistoryModal();

  const hearingCancelationModal = useHearingCancellationFormModal({
    updateHearingStatus: hearingsState.updateStatus,
  });

  const hearingCancelationState = useHearingCancellationViewModal();

  const hearingCompletionModal = useHearingCompletionModal({
    updateStatus: hearingsState.updateStatus,
  });

  const handleStatusOnChange = (
    payload: {
      hearing_id: string;
      old_date: string;
      scheduled_date?: string;
      hearingType: string;
    },
    status: HearingStatus
  ) => {
    console.log("status onchange: ", payload);
    switch (status) {
      case "postponed":
        hearingPostponedState.open(payload);
        break;
      case "cancelled":
        hearingCancelationModal.open({
          hearingDataId: payload.hearing_id,
          hearingType: payload.hearingType,
        });
        break;

      case "completed":
        hearingCompletionModal.open({
          hearing_id: payload.hearing_id,
          hearing_type: payload.hearingType,
          scheduled_date: payload.scheduled_date!,
        });
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
    hearingCancelationModal,
    hearingCancelationState,
    hearingCompletionModal,

    hearingsState,

    hearings: hearingsState.displayData,
    loading,

    caseConcern: caseData?.concern,
    caseFiledAt: caseData?.created_at,
    clientName: clientData?.client_name,

    // functions
    handleStatusOnChange,

    isHearingStageComplete,
  };
};

export default useCaseHearingPage;
