import { useCallback, useState } from "react";

const useMarkCompleteModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [markingLoading, setMarkingLoading] = useState(false);

  const open = useCallback(() => {
    setIsOpen(true);
  }, [setIsOpen]);

  const close = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  return {
    isOpen,
    open,
    close,

    markingLoading,
    setMarkingLoading,
  };
};
export default useMarkCompleteModal;
