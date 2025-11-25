import { useState, useCallback } from "react";
import { RegistrationType } from "../accountRequest/useAccountRequest";

import { RegistrationApi } from "../../../util/api/registration.api";

export const useApprovalModal = (
  promiseToast: <T>(
    promise: Promise<T> | (() => Promise<T>),
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((err: unknown) => string);
    }
  ) => Promise<
    | (string & {
        unwrap: () => Promise<T>;
      })
    | (number & {
        unwrap: () => Promise<T>;
      })
    | {
        unwrap: () => Promise<T>;
      }
  >
) => {
  const [isApprovalOpen, setIsApprovalOpen] = useState(false);
  const [registration, setregistration] = useState<
    RegistrationType | undefined
  >(undefined);

  const openApprovalModal = useCallback((registrationReq: RegistrationType) => {
    setregistration(registrationReq);
    setIsApprovalOpen(true);
  }, []);

  const closeApprovalModal = useCallback(() => {
    setIsApprovalOpen(false);
    setregistration(undefined);
  }, []);

  const confirmApproval = useCallback(async () => {
    if (!registration) return false;

    try {
      await promiseToast(
        () => RegistrationApi.approveRegistration(registration),
        {
          loading: "Approving...",
          success: "Approved!",
          error: (err) => `Error: ${err}`,
        }
      );

      closeApprovalModal();
      return true;
    } catch (err) {
      return false;
    }
  }, [registration]);

  return {
    isApprovalOpen,
    openApprovalModal,
    closeApprovalModal,
    registration,
    confirmApproval,
  };
};
