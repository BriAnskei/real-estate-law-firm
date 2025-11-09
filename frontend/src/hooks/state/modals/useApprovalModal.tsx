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
    if (!registration) return;

    await promiseToast(
      async () => {
        await RegistrationApi.approveRegistration(registration);
      },
      {
        loading: "Approving registration...",
        success: "Registration aprroved successfully.",
        error: (err) =>
          `Failed to aprroved registration: ${err || "Unknown error"}`,
      }
    );

    closeApprovalModal();
  }, [registration]);

  return {
    isApprovalOpen,
    openApprovalModal,
    closeApprovalModal,
    registration,
    confirmApproval,
  };
};
