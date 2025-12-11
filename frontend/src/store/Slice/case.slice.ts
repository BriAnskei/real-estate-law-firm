import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { NormalizeState } from "./normalizeState";
import { caseApi } from "../../util/api/case.api";
import { normalizeResponse } from "../../util/normalizeResponse";
import { addClient, ClientFormType, updateClient } from "./client.slice";

export type CaseType = {
  id?: string;
  client_id?: string;
  client_name: string;
  opposing_party: string;
  concern: string;
  description: string;
  paid: "no" | "partial" | "paid";
  status: "pending" | "ongoing" | "complete";
  consultation_date: string;
  promise_to_pay?: string;
  created_at?: string;
};

export type Stages = "MANAGE_REQUIREMENTS" | "FILING_DOCS" | "HEARING";
export type CaseStageStatus = "ongoing" | "complete";

export type CaseStagesType = {
  id?: string;
  case_id: string;
  selected_hearing_id?: string;
  stage_name: Stages;
  stage_status: CaseStageStatus;
  create_at?: string;
};

export type CaseTransactionTask = {
  id?: string;
  case_stage_id: string;
  hearing_id?: string;
  stage_name: string;
  title: string;
  description: string;
  assign_by: string;
  assign_to: string;
  assignee_name?: string;
  assigner_name?: string;
  due_date: string;
  status: "pending" | "complete";
  comments_count?: number;
  created_at?: string;
};

// task pff file types
export enum file_type {
  uploader = "ASSIGNER_UPLOAD",
  submitter = "SUBMISSION",
}
export type taskFileType = {
  id?: string;
  task_id: string;
  file_name: string;
  original_name: string;
  file_path: string;
  file_type: file_type;
  created_at?: string;
};

export const addNewCase = createAsyncThunk(
  "case/add",
  async (
    payload: { caseData: CaseType; clientData: ClientFormType },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const res = await caseApi.create(payload);

      if (!res.success) return rejectWithValue(res.message);

      const client = res.data?.newClientData!;
      client.id = String(client.id);

      dispatch(addClient(client));

      dispatch(createCase(res.data?.newCaseData));
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getActiveCases = createAsyncThunk(
  "case/get/active",
  async (_: void, { rejectWithValue, dispatch }) => {
    try {
      const res = await caseApi.fetchActiveCases();

      dispatch(setAllCases(res.data));

      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const filterActiveCases = createAsyncThunk(
  "case/get/active/filter",
  async (
    payload: { query?: string; status: "ongoing" | "complete" },
    { rejectWithValue }
  ) => {
    try {
      const response = await caseApi.fetchFilteredActiveCases(payload);

      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const filterPayments = createAsyncThunk(
  "case/get/payment/filter",
  async (
    payload: { query?: string; paidType?: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await caseApi.filterPayments(payload);

      return response;
    } catch (error) {
      rejectWithValue(error);
    }
  }
);

export const fetchAllUnpaidCases = createAsyncThunk(
  "case/get/unpiad",
  async (
    payload: {
      page?: number;
    },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const res = await caseApi.getAllUnpaid({ page: payload.page });

      if (!res.success) return rejectWithValue(res.message);

      dispatch(
        setUnpaidCases({
          data: res.data?.data,
          totalPages: res.data?.totalPages,
          currentPage: res.data?.page,
        })
      );
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const filterUnpaidCases = createAsyncThunk(
  "case/filter/unpaid",
  async (
    payload: {
      page?: number;
      filters: { query?: string; sortFilter?: string };
    },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const res = await caseApi.getAllUnpaid(payload);

      if (!res.success) return rejectWithValue(res.message);

      dispatch(
        setFilterCases({
          data: res.data?.data,
          totalPages: res.data?.totalPages,
          currentPage: res.data?.page,
        })
      );
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateCase = createAsyncThunk(
  "case/update",
  async (
    payload: {
      id: string;
      caseUpdate: Partial<CaseType>;
      clientUpdate: Partial<ClientFormType>;
    },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const res = await caseApi.update(payload);

      if (!res.success) {
        return rejectWithValue(res.message);
      }
      dispatch(updateCaseData({ id: payload.id, updates: payload.caseUpdate }));

      const clientId = payload.caseUpdate.client_id;
      const updatedClient = payload.clientUpdate;
      dispatch(updateClient({ id: clientId!, changes: updatedClient }));
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const markCaseAsOngoing = createAsyncThunk(
  "case/ongoing",
  async (
    payload: {
      id: string;
      paymentMode: string;
      promiseToPay: string;
      case_concern: string;
      client_name: string;
    },
    { rejectWithValue, dispatch }
  ) => {
    try {
      await caseApi.markAsOngoing(payload);
      dispatch(markOngoingCase(payload));
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteCase = createAsyncThunk(
  "case/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await caseApi.delete(id);

      if (!res.success) return rejectWithValue(res.message);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export interface CaseState extends NormalizeState<CaseType> {
  addLoading: boolean;
  unpaidById: { [key: string]: CaseType };
  unpaidIds: string[];

  // filters
  filterLoading: boolean;
  filterById: { [key: string]: CaseType };
  filterIds: string[];
  filterTotalPage: number;
  filterCurrentPage: number;

  totalPages: number;
  currentPage: number;
  updateLoading: boolean;
}

const initialState: CaseState = {
  loading: false,
  addLoading: false,
  updateLoading: false,

  filterLoading: false,
  filterById: {},
  filterIds: [],
  filterCurrentPage: 0,
  filterTotalPage: 0,

  // ongiong cases state
  byId: {},
  allIds: [],

  // pending/unpain cases
  unpaidById: {},
  unpaidIds: [],
  totalPages: 0,
  currentPage: 0,
  error: null,
};

const caseSlice = createSlice({
  name: "case",
  initialState,
  reducers: {
    createCase: (state, action) => {
      const { allIds, byId } = normalizeResponse(action.payload);
      const newId = allIds[0];

      if (!state.unpaidById[newId]) {
        state.unpaidById[newId] = byId[newId];
        state.unpaidIds = [...allIds, ...state.unpaidIds];
      }
    },

    updateCaseData: (state, action) => {
      const { id, updates } = action.payload;

      if (state.byId[id]) {
        state.byId[id] = { ...state.byId[id], ...updates };
      }

      if (state.unpaidById[id]) {
        state.unpaidById[id] = { ...state.unpaidById[id], ...updates };
      }

      if (state.filterById[id]) {
        state.filterById[id] = { ...state.filterById[id], ...updates };
      }
    },

    markOngoingCase: (state, action) => {
      const { id, paymentMode, promiseToPay } = action.payload;

      const caseData = state.unpaidById[id];
      const isPromiseTopayIssue = paymentMode === "partial";

      delete state.unpaidById[id];
      state.unpaidIds = state.unpaidIds.filter((caseId) => caseId !== id);

      // incase the case is filtered
      delete state.filterById[id];
      state.filterIds = state.filterIds.filter((caseId) => caseId !== id);

      const newCaseData: CaseType = {
        ...caseData,
        paid: paymentMode,
        status: "ongoing",
        ...(isPromiseTopayIssue && { promise_to_pay: promiseToPay }),
      };

      state.byId[id] = newCaseData;
      state.allIds.push(id);
    },

    updateCaseStatus: (state, action) => {
      const { caseId, isAllStagesComplete } = action.payload;

      const caseData = state.byId[caseId];

      const newCaseStatus = isAllStagesComplete ? "complete" : "ongoing";

      if (
        caseData &&
        (isAllStagesComplete || newCaseStatus !== caseData.status)
      ) {
        state.byId[caseId] = { ...caseData, status: newCaseStatus as any };
      }
    },

    setAllCases: (state, action) => {
      const { byId, allIds } = normalizeResponse(action.payload);

      state.byId = byId;
      state.allIds = allIds;
    },

    setUnpaidCases: (state, action) => {
      const { allIds, byId } = normalizeResponse(action.payload.data);

      const newIds = allIds.filter((id) => !state.unpaidIds.includes(id));

      state.unpaidIds = [...state.unpaidIds, ...newIds];
      state.unpaidById = { ...state.unpaidById, ...byId };

      state.currentPage = action.payload.currentPage;
      state.totalPages = action.payload.totalPages;
    },
    setFilterCases: (state, action) => {
      const { allIds, byId } = normalizeResponse(action.payload.data);

      const newIds = allIds.filter((id) => !state.filterIds.includes(id));

      state.filterIds = [...state.filterIds, ...newIds];
      state.filterById = { ...state.filterById, ...byId };

      state.filterCurrentPage = action.payload.currentPage;
      state.filterTotalPage = action.payload.totalPages;
    },

    clearCaseFilter: (state) => {
      state.filterById = {};
      state.filterIds = [];
      state.filterCurrentPage = 0;
      state.filterTotalPage = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addNewCase.pending, (state) => {
        state.addLoading = true;
      })
      .addCase(addNewCase.fulfilled, (state) => {
        state.addLoading = false;
      })
      .addCase(addNewCase.rejected, (state, action) => {
        state.addLoading = false;
        state.error = action.payload as string;
      })

      .addCase(getActiveCases.pending, (state) => {
        state.loading = true;
      })
      .addCase(getActiveCases.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(getActiveCases.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(filterActiveCases.pending, (state) => {
        state.filterLoading = true;
      })
      .addCase(filterActiveCases.fulfilled, (state, action) => {
        const { allIds, byId } = normalizeResponse(action.payload as any);

        state.filterIds = allIds;
        state.filterById = byId;

        state.filterLoading = false;
      })
      .addCase(filterActiveCases.rejected, (state, action) => {
        state.filterLoading = false;
        state.error = action.payload as string;
      })

      .addCase(filterPayments.pending, (state) => {
        state.filterLoading = true;
      })
      .addCase(filterPayments.fulfilled, (state, action) => {
        const { allIds, byId } = normalizeResponse(action.payload as any);

        state.filterIds = allIds;
        state.filterById = byId;

        state.filterLoading = false;
      })
      .addCase(filterPayments.rejected, (state, action) => {
        state.filterLoading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchAllUnpaidCases.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllUnpaidCases.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(fetchAllUnpaidCases.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(filterUnpaidCases.pending, (state) => {
        state.filterLoading = true;
      })
      .addCase(filterUnpaidCases.fulfilled, (state) => {
        state.filterLoading = false;
      })
      .addCase(filterUnpaidCases.rejected, (state, action) => {
        state.filterLoading = false;
        state.error = action.payload as string;
      })

      .addCase(updateCase.pending, (state) => {
        state.updateLoading = true;
      })
      .addCase(updateCase.fulfilled, (state) => {
        state.updateLoading = false;
      })
      .addCase(updateCase.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload as string;
      })

      .addCase(deleteCase.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteCase.fulfilled, (state, action) => {
        delete state.byId[action.meta.arg];
        delete state.unpaidById[action.meta.arg];
        delete state.filterById[action.meta.arg];

        state.allIds = state.allIds.filter((id) => id !== action.meta.arg);

        state.unpaidIds = state.unpaidIds.filter(
          (id) => id !== action.meta.arg
        );

        state.filterIds = state.filterIds.filter(
          (id) => id !== action.meta.arg
        );

        state.loading = false;
      })
      .addCase(deleteCase.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  createCase,
  setUnpaidCases,
  updateCaseData,
  setFilterCases,
  clearCaseFilter,
  setAllCases,
  markOngoingCase,
  updateCaseStatus,
} = caseSlice.actions;
export default caseSlice.reducer;
