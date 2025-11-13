import {
  createAsyncThunk,
  createSlice,
  isRejectedWithValue,
} from "@reduxjs/toolkit";
import { NormalizeState } from "./normalizeState";
import { caseApi } from "../../util/api/case.api";
import { normalizeResponse } from "../../util/normalizeResponse";

export type CaseType = {
  id?: string;
  client_id: string;
  concern: string;
  description: string;
  paid: "no" | "partial" | "paid";
  status: "ongiong" | "complete";
  promise_to_pay?: Date;
  created_at?: Date;
};

export const addNewCase = createAsyncThunk(
  "case/add",
  async (caseData: CaseType, { rejectWithValue, dispatch }) => {
    try {
      const res = await caseApi.create(caseData);

      if (!res.success) return rejectWithValue(res.message);
      dispatch(createCase(res.data));
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchAllCases = createAsyncThunk(
  "case/get/all",
  async (_: void, { rejectWithValue, dispatch }) => {
    try {
      const res = await caseApi.getAll();

      if (!res.success) return rejectWithValue(res.message);
      dispatch(addAllCases(res.data));
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
\
interface CaseState extends NormalizeState<CaseType> {}

const initialState: CaseState = {
  loading: false,
  byId: {},
  allIds: [],
  error: null,
};

const caseSlice = createSlice({
  name: "case",
  initialState,
  reducers: {
    createCase: (state, action) => {
      const { allIds, byId } = normalizeResponse(action.payload);

      state.byId[allIds[0]] = byId[allIds[0]];
      state.allIds.push(allIds[0]);
    },
    addAllCases: (state, action) => {
      const { allIds, byId } = normalizeResponse(action.payload);

      state.allIds = [...state.allIds, allIds[0]];
      state.byId = { ...state.byId, ...byId };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addNewCase.pending, (state) => {
        state.loading = true;
      })
      .addCase(addNewCase.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addNewCase.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { createCase, addAllCases } = caseSlice.actions;
export default caseSlice.reducer;
