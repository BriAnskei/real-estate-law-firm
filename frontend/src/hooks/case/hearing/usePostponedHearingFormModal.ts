import { useCallback, useState } from "react";
import { useToast } from "../../useToast";
import { HearingApi } from "../../../util/api/hearing.api";
import { decodeInputDateAndTimeToDate } from "../../../util/DateDecoder";
import { createChangeHandler } from "../../../util/createOnChangeHandler";

export type PostponeInputType = {
  new_date: string;
  new_time: string;
  reason: string;
};

const initialInput: PostponeInputType = {
  new_date: "",
  new_time: "",
  reason: "",
};

const usePosponedHearingFormModal = ({
  postponeHearing,
}: {
  postponeHearing: (payload: { hearingId: string; new_date: string }) => void;
}) => {
  const { promiseToast } = useToast();

  const [hearingData, setHearingData] = useState<
    { hearing_id: string; old_date: string } | undefined
  >(undefined);
  const [input, setInput] = useState<PostponeInputType>(initialInput);

  const [isOpen, setIsOpen] = useState(false);

  const open = (payload: { hearing_id: string; old_date: string }) => {
    setHearingData(payload);
    setIsOpen(true);
  };

  const close = () => {
    setHearingData(undefined);
    setInput(initialInput);
    setIsOpen(false);
  };

  const onchangeHanlder = createChangeHandler<PostponeInputType>(setInput);

  const onSubmit = useCallback(async () => {
    await promiseToast(
      async () => {
        await HearingApi.postpone({
          hearing_id: hearingData?.hearing_id!,
          old_date: hearingData?.old_date!,
          new_date: decodeInputDateAndTimeToDate(
            input.new_date!,
            input.new_time!
          ),
          reason: input.reason,
        });
      },
      {
        loading: "Submitting schedule update",

        success: (_: void) => {
          postponeHearing({
            hearingId: hearingData?.hearing_id!,
            new_date: decodeInputDateAndTimeToDate(
              input.new_date!,
              input.new_time!
            ),
          });

          close();
          return "Hearing schedule is successfully updated";
        },
        error: (err) => `Failed to posponed hearing: ${err || "unknown err"}`,
      }
    );
  }, [hearingData, input]);

  return {
    open,
    isOpen,
    onchangeHanlder,
    close,
    onSubmit,
    input,
  };
};

export default usePosponedHearingFormModal;
