import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { NormalizeState } from "./normalizeState";
import { caseApi } from "../../util/api/case.api";
import { normalizeResponse } from "../../util/normalizeResponse";
import { addClient, ClientType } from "./client.slice";

export type CaseType = {
  id?: string;
  client_id?: string;
  client_name: string;
  concern: string;
  description: string;
  paid: "no" | "partial" | "paid";
  status: "ongiong" | "complete";
  consultation_date: Date | null;
  promise_to_pay?: Date;
  created_at?: Date;
};

export const addNewCase = createAsyncThunk(
  "case/add",
  async (
    payload: { caseData: CaseType; clientData: ClientType },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const res = await caseApi.create(payload);

      if (!res.success) return rejectWithValue(res.message);
      dispatch(createCase(res.data?.newCaseData));
      dispatch(addClient(res.data?.newClietData));
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchAllUnpaidCases = createAsyncThunk(
  "case/get/all",
  async (_: void, { rejectWithValue, dispatch }) => {
    try {
      const res = await caseApi.getAllUnpaid();

      if (!res.success) return rejectWithValue(res.message);
      dispatch(
        setUnpaidCases({
          data: res.data?.data,
          totalPages: res.data?.totalPages,
        })
      );
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export interface CaseState extends NormalizeState<CaseType> {
  addLoading: boolean;
  unpaidById: { [key: string]: CaseType };
  unpaidIds: string[];
  totalPages: number;
}

const initialState: CaseState = {
  loading: false,
  addLoading: false,
  byId: {},
  allIds: [],
  unpaidById: {},
  unpaidIds: [],
  totalPages: 0,
  error: null,
};

const caseSlice = createSlice({
  name: "case",
  initialState,
  reducers: {
    createCase: (state, action) => {
      const { allIds, byId } = normalizeResponse(action.payload);
      const newId = allIds[0];

      if (!state.byId[newId]) {
        state.unpaidById[newId] = byId[newId];
        state.unpaidIds.push(newId);
      }

      state.totalPages = Math.ceil(state.allIds.length / 12);
    },

    setUnpaidCases: (state, action) => {
      const { allIds, byId } = normalizeResponse(action.payload.data);

      state.unpaidIds = [...state.unpaidIds, ...allIds];
      state.unpaidById = { ...state.unpaidById, ...byId };

      state.totalPages = action.payload.totalPages;
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
      });
  },
});

export const { createCase, setUnpaidCases } = caseSlice.actions;
export default caseSlice.reducer;
