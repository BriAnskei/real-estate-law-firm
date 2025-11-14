import { createSlice } from "@reduxjs/toolkit";
import { NormalizeState } from "./normalizeState";
import { normalizeResponse } from "../../util/normalizeResponse";

export type ClientType = {
  id?: string;
  client_name: string;
  address: string;
  contact_number: number | null;
  email: string;
  created_at?: Date;
};

export interface ClientState extends NormalizeState<ClientType> {}

const initialState: ClientState = {
  loading: false,
  byId: {},
  allIds: [],
  error: null,
};

export const clientSlice = createSlice({
  name: "client",
  initialState,
  reducers: {
    addClient: (state, action) => {
      const { allIds, byId } = normalizeResponse(action.payload);

      console.log("adding new client: ", action.payload);
      state.byId[allIds[0]] = byId[allIds[0]];
      state.allIds.push(allIds[0]);
    },
  },
  extraReducers: (builder) => {},
});

export const { addClient } = clientSlice.actions;
export default clientSlice.reducer;
