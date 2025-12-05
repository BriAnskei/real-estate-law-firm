import { useEffect, useState } from "react";
import { HearingPostponementsType } from "../../../types/HearingPostponementsType";
import { HearingPostponeApi } from "../../../util/api/hearing_postpone.api";

const usePostponedHistory = (hearingId?: string) => {
  const [postponements, setPostponements] = useState<
    HearingPostponementsType[] | undefined
  >([]);
  const [fetchingLoading, setFetchingLoading] = useState(false);

  useEffect(() => {
    async function fetchHearingPostponements() {
      if (!hearingId) return;
      setFetchingLoading(true);

      try {
        const response = await HearingPostponeApi.fetchPostponeHistory(
          hearingId
        );
        setPostponements(response);
      } catch (error) {
      } finally {
        setFetchingLoading(false);
      }
    }
    fetchHearingPostponements();
  }, [hearingId]);

  useEffect(() => {
    console.log(postponements);
  }, [postponements]);

  const loading = fetchingLoading || !postponements;

  return {
    postponements,
    fetchingLoading,
    loading,
  };
};

const useHearingPostponedHistoryModal = () => {
  const [hearingId, setHearingid] = useState<string | undefined>(undefined);
  const [hearingType, setHearingType] = useState<string | undefined>(undefined);
  const [isOpen, setIsOpen] = useState(false);

  const hearingPostponementsState = usePostponedHistory(hearingId);

  const open = (payload: { hearingId: string; hearingDataType: string }) => {
    const { hearingId, hearingDataType } = payload;

    setHearingType(hearingDataType);
    setHearingid(hearingId);
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
  };

  return {
    ...hearingPostponementsState,
    isOpen,
    open,
    close,
    hearingType,
  };
};

export default useHearingPostponedHistoryModal;
