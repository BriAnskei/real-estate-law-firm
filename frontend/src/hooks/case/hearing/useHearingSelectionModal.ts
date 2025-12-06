import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";
import { HearingType } from "../../../types/HearingTypes";
import { HearingApi } from "../../../util/api/hearing.api";
import { useToast } from "../../useToast";
import { useHearingFilter } from "./useHearingFilter";
import { CaseStagesApi } from "../../../util/api/case_stages.api";

const useHearingSelectionModal = ({
  setSelectedHearingSched,
}: {
  setSelectedHearingSched: (payload: {
    hearingData: HearingType;
    hearingId: string;
  }) => void;
}) => {
  const { promiseToast } = useToast();

  const filteredHearingState = useHearingFilter();

  const { id } = useParams();
  const [isOpen, setIsOpen] = useState(false);

  const [hearings, setHearings] = useState<HearingType[] | undefined>(
    undefined
  );
  const [isFetching, setIsfetching] = useState(false);

  // selection loading flag
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function fetchHearings() {
      if (!open) return;
      setIsfetching(true);
      try {
        const response = await HearingApi.getAll(id as string);
        setHearings(response);
      } catch (error) {
        console.error(error);
      } finally {
        setIsfetching(false);
      }
    }
    fetchHearings();
  }, [isOpen]);

  const open = () => {
    setIsOpen(true);
  };

  const close = () => {
    setHearings(undefined);
    setIsOpen(false);
  };

  const onConfirm = useCallback(
    async (hearingId: string) => {
      setIsSubmitting(true);
      await promiseToast(
        async () => {
          const response = await CaseStagesApi.setSelectedHearing({
            caseId: id as string,
            hearing_id: hearingId,
          });

          setSelectedHearingSched({ hearingId, hearingData: response });
        },
        {
          loading: "Updating selected hearing...",
          success: () => {
            setIsSubmitting(false);
            close();
            return "Hearing successfully set for  task management.";
          },
          error: (err) => `Failed: ${err || "Unknown error"}`,
        }
      );
    },
    [setSelectedHearingSched]
  );

  const displayData = filteredHearingState.onFiltered
    ? filteredHearingState.filteredHearings
    : hearings;

  const loading = isFetching || filteredHearingState.loadingFilter;

  return {
    filteredHearingState,
    displayData,
    isFetching,
    onConfirm,
    loading,
    isSubmitting,

    isOpen,
    open,
    close,
  };
};

export default useHearingSelectionModal;
