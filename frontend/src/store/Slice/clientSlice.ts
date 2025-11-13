import { createSlice } from "@reduxjs/toolkit";
import { NormalizeState } from "./normalizeState";

export type ClientType = {
  id?: string;
  client_name: string;
  address: string;
  contact_number: string;
  email: string;
  created_at?: Date;
};

interface ClientState extends NormalizeState<ClientType> {}

const initialState: ClientState = {
  loading: false,
  byId: {},
  allIds: [],
  error: null,
};

export const clientSlice = createSlice({
  name: "client",
  initialState,
  reducers: {},
  extraReducers: (builder) => {},
});

export const {} = clientSlice.actions;
export default clientSlice.reducer;
