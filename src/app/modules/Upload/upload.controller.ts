import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { UploadServices } from "./upload.service";
import httpStatus from "http-status-codes";
import { sendResponse } from "../../utils/sendResponse";
import AppError from "../../errorHelpers/AppError";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const uploadSingle = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.file) {
    throw new AppError(httpStatus.BAD_REQUEST, "No file uploaded");
  }

  const url = UploadServices.uploadSingleFile(req.file.path);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "File uploaded successfully",
    data: { url },
  });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const uploadMultiple = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const files = req.files as Express.Multer.File[];

  if (!files || files.length === 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "No files uploaded");
  }

  const urls = UploadServices.uploadMultipleFiles(files.map((file) => file.path));

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Files uploaded successfully",
    data: { urls },
  });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getAllFiles = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const files = await UploadServices.getAllFiles();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Files fetched successfully",
    data: files,
  });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const deleteFile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const publicId = req.params.publicId as string;

  await UploadServices.deleteFile(publicId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "File deleted successfully",
    data: null,
  });
});

export const UploadController = {
  uploadSingle,
  uploadMultiple,
  getAllFiles,
  deleteFile,
};
