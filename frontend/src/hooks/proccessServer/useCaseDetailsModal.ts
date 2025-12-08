import { useState } from "react";

const useCaseDetailsModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const open = () => {
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
  };

  return {
    isOpen,
    close,
    open,
  };
};

export default useCaseDetailsModal;
