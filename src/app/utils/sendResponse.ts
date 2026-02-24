import { Response } from "express";

interface IMeta {
  page: number;
  total: number;
  limit: number;
  skip: number;
}

interface TResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
  meta?: IMeta;
}

export const sendResponse = <T>(res: Response, data: TResponse<T>) => {
  res.status(data?.statusCode).json({
    statusCode: data?.statusCode,
    success: data?.success,
    message: data?.message,
    data: data?.data,
    meta: data?.meta,
  });
};
