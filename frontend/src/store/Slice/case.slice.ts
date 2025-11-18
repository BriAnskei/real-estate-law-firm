import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { NormalizeState } from "./normalizeState";
import { caseApi } from "../../util/api/case.api";
import { normalizeResponse } from "../../util/normalizeResponse";
import { addClient, ClientFormType, updateClient } from "./client.slice";

export type CaseType = {
  id?: string;
  client_id?: string;
  client_name: string;
  concern: string;
  description: string;
  paid: "no" | "partial" | "paid";
  status: "ongiong" | "complete";
  consultation_date: string;
  promise_to_pay?: Date;
  created_at?: Date;
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

      if (!res.success) rejectWithValue(res.message);

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

  byId: {},
  allIds: [],
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
} = caseSlice.actions;
export default caseSlice.reducer;
