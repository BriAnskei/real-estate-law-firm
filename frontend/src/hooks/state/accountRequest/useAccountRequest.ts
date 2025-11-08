import { useDispatch, useSelector } from "react-redux";
import { useRejectionModal } from "../modals/useRejectionModal";
import { RootState } from "../../../store/store";
import { useEffect, useMemo, useRef, useState } from "react";
import { UserType } from "../../../store/Slice/userSlice";
import { RegistrationApi } from "../../../util/api/registration.api";
import { useAccountRequestFilter } from "./useAccountRequestFilter";
import { useToast } from "../../useToast";
import { useApprovalModal } from "../modals/useApprovalModal";

export interface RegistrationType extends UserType {}

export const useAccountRequest = () => {
  const authState = useSelector((state: RootState) => state.auth);
  const { promiseToast } = useToast();

  // modals
  const {
    isApprovalOpen,
    openApprovalModal,
    closeApprovalModal,
    registration: approvalRegistration,
    confirmApproval,
  } = useApprovalModal(promiseToast);

  const { openModal, closeModal, isOpen, registration, confirmRejection } =
    useRejectionModal(promiseToast);

  const {
    filterLoading,
    onFilter,
    filtered,
    onSearchHandler,
    search,
    clearFilter,
    setFiltered,
  } = useAccountRequestFilter();

  const [registrationRequests, setRegistrationRequests] =
    useState<RegistrationType[]>();

  const isFetchingRef = useRef(false);

  const displayData = useMemo(
    () => (onFilter ? filtered : registrationRequests),
    [onFilter, filtered, registrationRequests]
  );

  useEffect(() => {
    async function fetchRegistrationRequest() {
      if (isFetchingRef.current) return;

      try {
        isFetchingRef.current = true;
        const { accessToken, isAuthenticated } = authState;
        if (!accessToken || !isAuthenticated) return;

        const res = await RegistrationApi.fetch();
        setRegistrationRequests(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        isFetchingRef.current = false;
      }
    }

    fetchRegistrationRequest();
  }, [authState]);

  const rejectionConfirmation = async (reason: string) => {
    if (!registration) return;

    await confirmRejection(reason);

    setRegistrationRequests((prev) =>
      prev?.filter((request) => request.id !== registration.id)
    );

    setFiltered((prev) =>
      prev?.filter((request) => request.id !== registration.id)
    );
  };

  const appoveRegistrationReq = async () => {
    await confirmApproval();

    setRegistrationRequests((prev) =>
      prev?.filter((request) => request.id !== approvalRegistration!.id)
    );

    setFiltered((prev) =>
      prev?.filter((request) => request.id !== approvalRegistration!.id)
    );
  };

  return {
    rejectionModal: { openModal, closeModal, isOpen, registration },
    approvalModal: {
      isApprovalOpen,
      openApprovalModal,
      closeApprovalModal,
      approvalRegistration,
      appoveRegistrationReq,
    },
    onSearchHandler,
    onFilter,
    rejectionConfirmation,
    loading: isFetchingRef.current || filterLoading,
    data: displayData,
    search,
    clearFilter,
  };
};
