import { useCallback, useState } from "react";
import { useToast } from "../../useToast";
import { HearingApi } from "../../../util/api/hearing.api";

const useHearingDeletionModal = ({
  deleteHearing,
}: {
  deleteHearing: (hearingId: string) => void;
}) => {
  const { promiseToast } = useToast();

  const [isOpen, setIsOpen] = useState(false);

  const [hearingData, setHearingData] = useState<
    { id: string; hearingType: string } | undefined
  >(undefined);

  const [isDeleting, setIsDeleting] = useState(false);

  const open = (payload: { id: string; hearingType: string }) => {
    setHearingData(payload);
    setIsOpen(true);
  };

  const close = () => {
    setHearingData(undefined);
    setIsOpen(false);
  };

  const confirm = useCallback(async () => {
    setIsDeleting(true);
    await promiseToast(
      async () => {
        await HearingApi.delete(hearingData?.id!);
      },
      {
        loading: "Dropping Hearing schedule",
        success: (_: void) => {
          deleteHearing(hearingData?.id!);

          setIsDeleting(false);
          close();
          return "Hearing successfully deleted";
        },
        error: (err) =>
          `Failed to delete hearing schedule: ${err || "unknown err"}`,
      }
    );
  }, [hearingData]);

  return {
    hearingType: hearingData?.hearingType,
    open,
    close,
    confirm,
    isOpen,
    isDeleting,
  };
};

export default useHearingDeletionModal;
