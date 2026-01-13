import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../store/selector/user/userSelector";
import { RootState } from "../store/store";

import { Roles } from "../store/Slice/userSlice";
import { DashboardApi } from "../util/api/dashboard.api";

// admin
export type AdminCardType = {
  total_cases: number;
  active_cases: number;
  completed_cases: number;
  due_tasks: number;
  total_users: number;
};
export type StageDistibutionCount = {
  MANAGE_REQUIREMENTS: number;
  FILING_DOCS: number;
  HEARING: number;
};
export type AdminDashboardTypes = {
  cards: AdminCardType;
  stageDistributionCount: StageDistibutionCount;
  upcommingHearings: UpcommingHearings[];
};

// global type, admin, lawyer, para
export type UpcommingHearings = {
  case_concern: string;
  hearing_type: string;
  scheduled_date: string;
};

// global state types
export type DashboardSummary = {
  pendingTaskCount: number;

  overDueTasks: TaskItem[];

  dueIn3Days: TaskItem[];

  dueIn5Days: TaskItem[];

  upcommingHearings: UpcommingHearings[];

  upcommingHearingsCount: number;
  activeCasesCount: number;
};

export type TaskItem = {
  task_title: string;
  stage_name: "MANAGE_REQUIREMENTS" | "FILING_DOCS" | "HEARING";
  case_concern: string;
  due_date: string;
};

type DashboardContextType = {
  loading: boolean;
  adminDashboard?: AdminDashboardTypes;
  globalDashboard?: DashboardSummary;
  // admin filter
  setDateFilter: (filter: { startDate: string; endDate: string }) => void;
  clearFilter: () => void;
  dateFilter: {
    startDate: string;
    endDate: string;
  };
};

const DashoardContext = createContext<DashboardContextType | undefined>(
  undefined
);

export const DashboardProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const curUser = useSelector(selectCurrentUser);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  // global laoding
  const [loading, setLoading] = useState(false);

  // admin state
  const [adminCards, setAdminCards] = useState<AdminCardType | undefined>(
    undefined
  );

  const [stageDistributionCount, setStageDistributionCount] = useState<
    StageDistibutionCount | undefined
  >(undefined);

  // global state
  const [upcomingHearings, setUpcommingHearings] = useState<
    UpcommingHearings[] | undefined
  >(undefined);

  // atty, para state
  const [activeCasesCount, setActiveCasesCount] = useState<number | undefined>(
    undefined
  );

  const [upcommingHearingsCount, setUpcommingHearingsCount] = useState<
    number | undefined
  >(undefined);

  const [pendingTasksCount, setPendingTasksCount] = useState<
    number | undefined
  >(undefined);

  const [overDueTasks, setOverDueTasks] = useState<TaskItem[] | undefined>(
    undefined
  );

  const [dueIn3DaysTasks, setDueIn3DaysTasks] = useState<
    TaskItem[] | undefined
  >(undefined);

  const [dueIn5DaysTasks, setDueIn5DaysTasks] = useState<
    TaskItem[] | undefined
  >(undefined);

  // filter for admin dashboard
  const [dateFilter, setDateFilter] = useState({
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    if (!isAuthenticated || !curUser || curUser.role === Roles.processServer) {
      return;
    }

    if (curUser.role === Roles.foundingManager) {
      fetchAdminDashboard();
    }

    if ([Roles.lawyer, Roles.paralegal].includes(curUser.role)) {
      fetchGlobalDashboard();
    }
  }, [curUser]);

  // date filter
  useEffect(() => {
    if (!isAuthenticated || !curUser || curUser.role === Roles.processServer) {
      return;
    }

    if (curUser.role === Roles.foundingManager) {
      fetchAdminDashboard(dateFilter);
    }
  }, [dateFilter]);

  const clearFilter = () => {
    setDateFilter({
      startDate: "",
      endDate: "",
    });
  };

  // admin fetcher
  const fetchAdminDashboard = useCallback(
    async (filterData?: { startDate: string; endDate: string }) => {
      try {
        setLoading(true);

        const res = await DashboardApi.fetchAdminDashboard(filterData);

        setAdminCards(res.cards);
        setStageDistributionCount(res.stageDistributionCount);
        setUpcommingHearings(res.upcommingHearings);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // global function, atty, para
  const fetchGlobalDashboard = useCallback(async () => {
    try {
      setLoading(true);

      const res = await DashboardApi.fetchGlobalDashboard();

      setUpcommingHearingsCount(res.upcommingHearingsCount);
      setUpcommingHearings(res.upcommingHearings);

      setPendingTasksCount(res.pendingTaskCount);

      setOverDueTasks(res.overDueTasks);
      setDueIn3DaysTasks(res.dueIn3Days);
      setDueIn5DaysTasks(res.dueIn5Days);
      setActiveCasesCount(res.activeCasesCount);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }, []);

  // flag for atty, para state
  const isGlobalStateReady =
    upcommingHearingsCount !== undefined &&
    upcomingHearings &&
    pendingTasksCount !== undefined &&
    overDueTasks &&
    dueIn3DaysTasks &&
    dueIn5DaysTasks &&
    activeCasesCount !== undefined;

  return (
    <DashoardContext.Provider
      value={{
        loading,
        adminDashboard:
          adminCards && stageDistributionCount && upcomingHearings
            ? {
                cards: adminCards!,
                stageDistributionCount: stageDistributionCount!,
                upcommingHearings: upcomingHearings!,
              }
            : undefined,

        globalDashboard: isGlobalStateReady
          ? {
              pendingTaskCount: pendingTasksCount!,
              upcommingHearings: upcomingHearings!,
              activeCasesCount: activeCasesCount!,
              upcommingHearingsCount,
              overDueTasks,
              dueIn3Days: dueIn3DaysTasks,
              dueIn5Days: dueIn5DaysTasks,
            }
          : undefined,

        setDateFilter,
        dateFilter,
        clearFilter,
      }}
    >
      {children}
    </DashoardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashoardContext);

  if (!context || !context === undefined) {
    throw new Error("useDashboard must be used within a Dasgboard provider");
  }

  return context;
};
