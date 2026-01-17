export interface TErrorSource {
  path: string | number;
  message: string;
}

export type TErrorSources = TErrorSource[];

export interface TGenericErrorResponse {
  statusCode: number;
  message: string;
  errorSources: TErrorSources;
}
