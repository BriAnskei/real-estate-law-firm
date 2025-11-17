import { useEffect, useState } from "react";

export const useViewConsultCaseModal = () => {
  const [isViewConsultCaseModalOpen, setIsViewConsultCaseModalOpen] =
    useState(false);
  const [selectedCase, setSelectedCase] = useState<any>(null);

  const openViewConsultCaseModal = (selectedCase: any) => {
    setSelectedCase(selectedCase);
    setIsViewConsultCaseModalOpen(true);
  };

  const closeViewConsultCaseModal = () => {
    setSelectedCase(null);
    setIsViewConsultCaseModalOpen(false);
  };

  const confirmCase = async () => {};

  return {
    openViewConsultCaseModal,
    closeViewConsultCaseModal,
    selectedCase,
    isViewConsultCaseModalOpen,
    confirmCase,
  };
};
