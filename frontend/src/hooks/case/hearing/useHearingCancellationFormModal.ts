import { useCallback, useState } from "react";
import { useToast } from "../../useToast";
import { HearingApi } from "../../../util/api/hearing.api";

const useHearingCancellationFormModal = ({
  cancelHearing,
}: {
  cancelHearing: (hearingId: string) => void;
}) => {
  const { promiseToast } = useToast();

  const [isOpen, setIsOpen] = useState(false);

  const [hearingId, setHearingId] = useState<string | undefined>(undefined);
  const [hearingType, setHearingType] = useState<string | undefined>(undefined);

  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const open = (payload: { hearingDataId: string; hearingType: string }) => {
    const { hearingDataId, hearingType } = payload;

    setHearingId(hearingDataId);
    setHearingType(hearingType);

    setIsOpen(true);
  };

  const close = () => {
    setReason("");
    setHearingId(undefined);
    setIsOpen(false);
  };

  const onConfirm = useCallback(async () => {
    setIsSubmitting(true);
    await promiseToast(
      async () => {
        await HearingApi.cancel({ hearing_id: hearingId!, reason: reason });
      },
      {
        loading: "Proccessing request....",
        success: () => {
          setIsSubmitting(false);
          cancelHearing(hearingId!);
          return "Hearing is setted to canceled";
        },
        error: (err) =>
          `Failed to set to cancellation: ${err || "Unknown error"}`,
      }
    );
  }, [reason, hearingId]);

  return {
    isSubmitting,
    hearingId,
    open,
    close,
    onConfirm,
    isOpen,
    setReason,
    reason,
    hearingType,
  };
};

export default useHearingCancellationFormModal;
