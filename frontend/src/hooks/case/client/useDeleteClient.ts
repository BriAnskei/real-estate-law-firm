import { useCallback, useState } from "react";
import { useToast } from "../../useToast";
import { deleteClient } from "../../../store/Slice/client.slice";
import { AppDispatch } from "../../../store/store";

export const useDeleteClient = (dispatch: AppDispatch) => {
  const { errorToast, successToast } = useToast();

  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<{ id: string; name: string } | undefined>(
    undefined
  );
  const [isDeleting, setIsDeleting] = useState(false);

  const openDeleteModal = (payload: { name: string; id: string }) => {
    console.log("payload: ", payload);

    setData(payload);
    setIsOpen(true);
  };

  const closeDeleteModal = () => {
    setData(undefined);
    setIsOpen(false);
  };

  const confirm = useCallback(async () => {
    try {
      setIsDeleting(true);
      await dispatch(deleteClient(data?.id!)).unwrap();

      successToast("Client successfully removed");
      closeDeleteModal();
    } catch (error) {
      errorToast(error as string);
    } finally {
      setIsDeleting(false);
    }
  }, [data]);

  return {
    data,
    isOpen,
    openDeleteModal,
    closeDeleteModal,
    confirm,
    isDeleting,
  };
};
