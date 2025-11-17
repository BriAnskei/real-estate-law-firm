import { useSelector } from "react-redux";
import { clientAdapter } from "../Slice/client.slice";
import { RootState } from "../store";

const clientSelectors = clientAdapter.getSelectors(
  (state: RootState) => state.client
);
export const selectClientLoading = (state: RootState) => state.client.loading;

export const selectClientEntities = (state: RootState) =>
  clientSelectors.selectEntities(state);
export const selectClientIds = clientSelectors.selectIds;

export default clientSelectors;
