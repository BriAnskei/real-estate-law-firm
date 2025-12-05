import { useEffect, useState } from "react";
import { HearingCancellationType } from "../../../types/HearingCancellationType";
import { HearingCancellationApi } from "../../../util/api/hearing_cancellation.api";

const useHearingCancellationViewModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const [hearingData, setHearingData] = useState<
    | { hearing_id: string; hearing_type: string; schedule_date: string }
    | undefined
  >(undefined);

  const [cancellationData, setCancellationData] = useState<
    HearingCancellationType | undefined
  >(undefined);
  const [fetchingLoading, setFetchingLoading] = useState(false);

  //Fetcher
  useEffect(() => {
    async function fetchHearingCancellation() {
      if (!open || hearingData === undefined) return;
      setFetchingLoading(true);

      try {
        const response =
          await HearingCancellationApi.fetchHearingCancellationData(
            hearingData.hearing_id
          );

        setCancellationData(response);
        setFetchingLoading(false);
      } catch (error) {
        console.error(error);
      }
    }

    fetchHearingCancellation();
  }, [isOpen, hearingData]);

  const open = (paylaod: {
    hearing_id: string;
    hearing_type: string;
    schedule_date: string;
  }) => {
    setHearingData(paylaod);
    setIsOpen(true);
  };

  const close = () => {
    setHearingData(undefined);
    setIsOpen(false);
  };

  const loading = fetchingLoading || !cancellationData;

  return {
    isOpen,
    open,
    close,
    loading,

    hearingType: hearingData?.hearing_type,
    scheduleDate: hearingData?.schedule_date,
    cancellationDate: cancellationData?.created_at,
    reason: cancellationData?.reason,
  };
};

export default useHearingCancellationViewModal;
