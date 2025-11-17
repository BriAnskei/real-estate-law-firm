import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { useId } from "react";

const byId = (state: RootState) => state.case.byId;

export const selectCaseById = createSelector(
  [byId, (_state: RootState, caseId: string) => caseId],
  (caseById, caseId) => caseById[caseId]
);
