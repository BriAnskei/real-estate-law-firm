import { useCallback, useState } from "react";
import { useToast } from "../../useToast";
import { createChangeHandler } from "../../../util/createOnChangeHandler";
import { HearingApi } from "../../../util/api/hearing.api";
import { HearingType } from "../../../types/HearingTypes";
import { useParams } from "react-router";
import { decodeInputDateAndTimeToDate } from "../../../util/DateDecoder";

export type HearingInputType = {
  id?: string;
  type: string;
  date: string;
  time: string;
};

const initialInput: HearingInputType = {
  id: "",
  type: "",
  date: "",
  time: "",
};

const useHearingScheduleModal = ({
  addNewHearing,
  updateHearingType,
}: {
  addNewHearing: (payload: HearingType) => void;
  updateHearingType: (payload: { id: string; newType: string }) => void;
}) => {
  const { id } = useParams();
  const { promiseToast } = useToast();

  const [input, setInput] = useState<HearingInputType>(initialInput);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mode, setMode] = useState<"new" | "edit">("new");

  const [isOpen, setIsOpen] = useState(false);

  const openNewSchedModal = (payload?: HearingInputType) => {
    if (payload) setInput(payload);

    setMode(payload ? "edit" : "new");
    setIsOpen(true);
  };

  const closeNewSchedModal = () => {
    setInput(initialInput);
    setIsOpen(false);
  };

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);
    await promiseToast(
      async () => {
        if (mode === "new") {
          await handleNewHearingSubmission();
        } else {
          await handleHearingUpdate();
        }
        closeNewSchedModal();
      },
      {
        loading: "Submitting new schedule....",
        success(_: void) {
          setIsSubmitting(false);
          return "New schedule has beed added";
        },
        error: (err) =>
          `Failed to submit new schedule: ${err || "unknown error"}`,
      }
    );
  }, [input, id, mode]);

  const handleNewHearingSubmission = useCallback(async () => {
    const response = await HearingApi.create({
      case_id: id as string,
      hearingData: {
        type: input.type,
        scheduled_date: decodeInputDateAndTimeToDate(input.date, input.time),
      },
    });

    addNewHearing(response);
  }, [handleSubmit]);

  const handleHearingUpdate = useCallback(async () => {
    await HearingApi.update({
      id: input.id!,
      newType: input.type,
    });

    updateHearingType({ id: input.id!, newType: input.type });
  }, [handleSubmit]);

  const onChangeHanlder = createChangeHandler<HearingInputType>(setInput);

  return {
    input,
    isOpen,
    openNewSchedModal,
    closeNewSchedModal,
    handleSubmit,
    onChangeHanlder,
    isSubmitting,
    mode,
  };
};

export default useHearingScheduleModal;
