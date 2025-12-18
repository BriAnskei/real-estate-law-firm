import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";
import { CaseLogType } from "../../../types/case_log.type";
import { CaseLogApi } from "../../../util/api/case_log.api";

export const useCaseLog = () => {
  const { id } = useParams();

  const [isOpen, setIsOpen] = useState(false);

  const [caseLogs, setCaseLog] = useState<CaseLogType[]>([]);
  const [loading, setLoading] = useState(true);

  const open = () => {
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    setLoading(true);
    if (isOpen) {
      fetchLogs(id!);
    }
  }, [isOpen, id]);

  const fetchLogs = useCallback(async (caseId: string) => {
    try {
      const response = await CaseLogApi.fetchAllLogs(caseId);

      setCaseLog(response);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    caseLogs,
    isOpen,
    loading,
    open,
    close,
  };
};
