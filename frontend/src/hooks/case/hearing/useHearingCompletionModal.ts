import { useCallback, useState } from "react";

const useHearingCompletionModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const [hearingData, setHearingData] = useState<
    | {
        hearing_id: string;
        hearing_type: string;
        scheduled_date: string;
      }
    | undefined
  >(undefined);

  const [submitLoading, setSubmitLoading] = useState(false);

  const confirm = useCallback(async () => {}, []);

  const open = (payload: {
    hearing_id: string;
    hearing_type: string;
    scheduled_date: string;
  }) => {
    setHearingData(payload);
    setIsOpen(true);
  };

  const close = () => {
    setHearingData(undefined);
    setIsOpen(false);
  };

  return {
    isOpen,
    open,
    close,
    confirm,
    submitLoading,
    hearingType: hearingData?.hearing_type,
    scheduleDate: hearingData?.scheduled_date,
  };
};

export default useHearingCompletionModal;
