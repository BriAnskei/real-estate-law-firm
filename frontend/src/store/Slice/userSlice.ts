import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { NormalizeState } from "./normalizeState";
import { UserApi } from "../../util/api/user.api";
import { normalizeResponse } from "../../util/normalizeResponse";

export const fetchCurrentUser = createAsyncThunk(
  "user/fetchCurUSer",
  async (_: void, { rejectWithValue, dispatch }) => {
    try {
      const res = await UserApi.fetchUser();

      if (!res.success) {
        return rejectWithValue(res.message);
      }

      dispatch(setCurUser(res.data));
    } catch (error) {
      return rejectWithValue("Error, " + error);
    }
  }
);

export const fetchAllUsers = createAsyncThunk(
  "user/fetchAll",
  async (_: void, { rejectWithValue, dispatch }) => {
    try {
      const res = await UserApi.fetchAll();

      if (!res.success) {
        return rejectWithValue(res.message);
      }

      dispatch(addAllUsers(res.data));
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const filterUsers = createAsyncThunk(
  "user/filter",
  async (query: string, { rejectWithValue, dispatch }) => {
    try {
      const res = await UserApi.filter(query);

      if (!res.success) {
        return rejectWithValue(res.message);
      }

      dispatch(addAllFilter(res.data));
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export enum Roles {
  foundingManager = "founding-manager/admin",
  lawyer = "lawyer",
  paralegal = "paralegal",
  processServer = "process-server",
}

export type UserType = {
  id?: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Roles;
};

interface UserState extends NormalizeState<UserType> {
  filterById: { [key: string]: UserType };
  filterIds: string[];
  filterLoading: boolean;

  currUserData: UserType | null;
}

const initialState: UserState = {
  loading: false,
  byId: {},
  allIds: [],
  error: null,
  filterById: {},
  filterIds: [],
  filterLoading: false,
  currUserData: {
    email: "",
    firstName: "",
    lastName: "",
    role: Roles.foundingManager,
  },
};

const useSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setCurUser: (state, action) => {
      state.currUserData = action.payload as UserType;
    },

    addAllUsers: (state, action) => {
      const { allIds, byId } = normalizeResponse(action.payload);

      state.byId = { ...state.byId, ...byId };
      state.allIds = allIds;
    },

    clearUserState: (state) => {
      state.byId = {};
      state.allIds = [];
      state.filterById = {};
      state.filterIds = [];
      state.currUserData = null;
    },

    addAllFilter: (state, action) => {
      const { allIds, byId } = normalizeResponse(action.payload);

      state.filterById = byId;
      state.filterIds = allIds;
    },

    clearUserFilter: (state) => {
      state.filterById = {};
      state.filterIds = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllUsers.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(filterUsers.pending, (state) => {
        state.filterLoading = true;
      })
      .addCase(filterUsers.fulfilled, (state) => {
        state.filterLoading = false;
      })
      .addCase(filterUsers.rejected, (state, action) => {
        state.filterLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setCurUser,
  clearUserState,
  addAllUsers,
  addAllFilter,
  clearUserFilter,
} = useSlice.actions;
export default useSlice.reducer;
