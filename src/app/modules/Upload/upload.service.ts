import { cloudinaryUpload } from "../../config/cloudinary.config";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status-codes";

const uploadSingleFile = (filePath: string): string => {
  return filePath;
};

const uploadMultipleFiles = (filePaths: string[]): string[] => {
  return filePaths;
};

const getAllFiles = async () => {
  const result = await cloudinaryUpload.api.resources({
    type: "upload",
    max_results: 500,
  });

  const files = result.resources.map(
    (resource: { public_id: string; secure_url: string; created_at: string; bytes: number; format: string }) => ({
      publicId: resource.public_id,
      url: resource.secure_url,
      format: resource.format,
      size: resource.bytes,
      createdAt: resource.created_at,
    }),
  );

  return files;
};

const deleteFile = async (publicId: string) => {
  const result = await cloudinaryUpload.uploader.destroy(publicId);

  if (result.result !== "ok") {
    throw new AppError(httpStatus.BAD_REQUEST, "Failed to delete file. Make sure the public ID is correct.");
  }

  return null;
};

export const UploadServices = {
  uploadSingleFile,
  uploadMultipleFiles,
  getAllFiles,
  deleteFile,
};
