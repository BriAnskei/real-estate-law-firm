import { RootState } from "../store";

export const selectCaseById = (state: RootState) => state.case.byId;
export const selectCaseIds = (state: RootState) => state.case.allIds;

export const selectCaseLoading = (state: RootState) => state.case.loading;
