import { useState, useCallback } from "react";

export const useRejectionModal = (initialState: boolean = false) => {
  const [isOpen, setIsOpen] = useState(initialState);
  const [userName, setUserName] = useState<string>("");

  const openModal = useCallback((name: string) => {
    setUserName(name);
    setIsOpen(true);
  }, []);
  const closeModal = useCallback(() => {
    setIsOpen(false);
    setUserName("");
  }, []);
  const toggleModal = useCallback(() => setIsOpen((prev) => !prev), []);

  return { isOpen, openModal, closeModal, toggleModal, userName };
};
