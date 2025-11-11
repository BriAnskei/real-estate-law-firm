export interface NormalizeState<T> {
  byId: { [key: string]: T };
  allIds: string[];
  loading: boolean;
  error: string | null;
}
