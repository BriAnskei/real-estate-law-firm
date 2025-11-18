import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import { ClientApi } from "../../util/api/client.api";

export type ClientFormType = {
  client_name: string;
  address: string;
  contact_number: number | null;
  email: string;
};

export type ClientType = ClientFormType & {
  id: string;
  created_at: string;
};

export const clientAdapter = createEntityAdapter<ClientType>();
export const filteredClientAdapter = createEntityAdapter<ClientType>();

const initialState = {
  ...clientAdapter.getInitialState(),
  filtered: filteredClientAdapter.getInitialState(),
  filterLoading: false,
  loading: false,
  error: null as string | null,
};

export const fetchClientById = createAsyncThunk(
  "client/find",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await ClientApi.findById(id);

      if (!res.success) return rejectWithValue(res.success);

      return res.data!;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchAllClients = createAsyncThunk(
  "cleint/fetch",
  async (_: void, { rejectWithValue }) => {
    try {
      const res = await ClientApi.fetch();

      if (!res.success) return rejectWithValue(res.message!);

      return res.data!;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const filterClient = createAsyncThunk(
  "client/filter",
  async (query: string, { rejectWithValue }) => {
    try {
      const res = await ClientApi.search(query);

      if (!res.success)
        return rejectWithValue(res.message || "Failed to fetch client");
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteClient = createAsyncThunk(
  "cleint/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await ClientApi.delete(id);

      if (!res.success) return rejectWithValue(res.message!);

      return res.data!;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const clientSlice = createSlice({
  name: "client",
  initialState,
  reducers: {
    addClient: clientAdapter.addOne,
    updateClient: clientAdapter.updateOne,
    clearClientFilter: (state) => {
      filteredClientAdapter.removeAll(state.filtered);
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(fetchClientById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchClientById.fulfilled, (state, action) => {
        state.loading = false;
        clientAdapter.upsertOne(state, action.payload);
      })
      .addCase(fetchClientById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchAllClients.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllClients.fulfilled, (state, action) => {
        clientAdapter.setAll(state, action.payload);

        state.loading = false;
      })
      .addCase(fetchAllClients.rejected, (state) => {
        state.loading = false;
      })

      .addCase(filterClient.pending, (state) => {
        filteredClientAdapter.removeAll(state.filtered);
        state.filterLoading = true;
      })
      .addCase(filterClient.fulfilled, (state, action) => {
        filteredClientAdapter.setAll(state.filtered, action.payload!);
        state.filterLoading = false;
      })
      .addCase(filterClient.rejected, (state, action) => {
        state.filterLoading = false;
        state.error = action.payload as string;
      })

      .addCase(deleteClient.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteClient.fulfilled, (state, action) => {
        clientAdapter.removeOne(state, action.meta.arg);

        state.loading = false;
      })
      .addCase(deleteClient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { addClient, clearClientFilter, updateClient } =
  clientSlice.actions;
export default clientSlice.reducer;
