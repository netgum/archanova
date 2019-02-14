export interface IAction<T = any> {
  type: string;
  payload: any;
}
