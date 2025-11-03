import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../store";

export const selectCurUserId = (state: RootState) => state.user.curUserId;
export const selectUsersById = (state: RootState) => state.user.byId;
export const selectUserLoading = (state: RootState) => state.user.loading;

export const selectCurrentUser = createSelector(
  [selectCurUserId, selectUsersById],
  (curUserId, usersById) => {
    return curUserId ? usersById[curUserId] : null;
  }
);
