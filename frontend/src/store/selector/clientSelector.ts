import { clientAdapter, filteredClientAdapter } from "../Slice/client.slice";
import { RootState } from "../store";

export const clientSelectors = clientAdapter.getSelectors(
  (state: RootState) => state.client
);

export const selectClientLoading = (state: RootState) => state.client.loading;

export const selectClientEntities = (state: RootState) =>
  clientSelectors.selectEntities(state);
export const selectClientIds = clientSelectors.selectIds;

// filter state
export const filterClientSelector = filteredClientAdapter.getSelectors(
  (state: RootState) => state.client.filtered
);

export const selectFilterClientLoading = (state: RootState) =>
  state.client.filterLoading;

export const selectFilterClientEntities = (state: RootState) =>
  filterClientSelector.selectEntities(state);
export const selectFilterClientIds = filterClientSelector.selectIds;
