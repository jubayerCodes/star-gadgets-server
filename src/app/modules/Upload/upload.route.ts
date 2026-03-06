import { Router } from "express";
import { multerUpload } from "../../config/multer.config";
import { UploadController } from "./upload.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../User/user.interface";

export const UploadRoutes = Router();

UploadRoutes.post("/single", checkAuth(Role.ADMIN), multerUpload.single("file"), UploadController.uploadSingle);

UploadRoutes.post("/multiple", checkAuth(Role.ADMIN), multerUpload.array("files"), UploadController.uploadMultiple);

UploadRoutes.get("/", checkAuth(Role.ADMIN), UploadController.getAllFiles);

UploadRoutes.delete("/:publicId", checkAuth(Role.ADMIN), UploadController.deleteFile);
