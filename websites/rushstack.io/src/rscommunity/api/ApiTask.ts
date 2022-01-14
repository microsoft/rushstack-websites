export enum ApiTaskStatus {
  Error,
  Pending,
  Success
}

export interface ApiTaskError {
  status: ApiTaskStatus.Error;
  error: Error;
}
export interface ApiTaskPending {
  status: ApiTaskStatus.Pending;
}
export interface ApiTaskSuccess<TResult> {
  status: ApiTaskStatus.Success;
  result: TResult;
}

export type ApiTask<TItem> = ApiTaskError | ApiTaskPending | ApiTaskSuccess<TItem>;
