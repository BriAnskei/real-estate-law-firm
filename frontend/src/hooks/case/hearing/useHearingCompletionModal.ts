import { useCallback, useState } from "react";
import { useToast } from "../../useToast";
import { HearingApi } from "../../../util/api/hearing.api";
import { HearingStatusType } from "../../../types/HearingTypes";
import { useCaseTransaction } from "../../../context/CaseTransactionContext";

const useHearingCompletionModal = ({
  updateStatus,
}: {
  updateStatus: (hearingId: string, newStatus: HearingStatusType) => void;
}) => {
  const { updateHearing } = useCaseTransaction();
  const { promiseToast } = useToast();
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

  const confirm = useCallback(async () => {
    setSubmitLoading(true);
    await promiseToast(
      async () => {
        await HearingApi.completed(hearingData?.hearing_id!);
      },
      {
        loading: "Marking hearing as complete",
        success: () => {
          setSubmitLoading(false);

          updateStatus(hearingData?.hearing_id!, "completed");

          //update hearing context, if this hearing is currently selected.
          updateHearing({
            hearingId: hearingData?.hearing_id!,
            updatedData: { status: "completed" },
          });

          close();
          return "Hearing market as complete";
        },
        error: (err) => `${err || "Unknown error"}`,
      }
    );
  }, [hearingData]);

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
