import { createSelector } from "@reduxjs/toolkit";
import { Roles, UserType } from "../../Slice/userSlice";
import { RootState } from "../../store";

export const selectCurrentUser = (state: RootState) => state.user.currUserData;
export const selectUsersState = (state: any) => state.user;

export const makeSelectUsersByRole = (role?: Roles) =>
  createSelector([selectUsersState], (userState): UserType[] => {
    if (!role) return {} as UserType[];

    return userState.allIds
      .map((id: string) => userState.byId[id])
      .filter((user: UserType) => user.role === role);
  });
