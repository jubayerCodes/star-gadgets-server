import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinaryUpload } from "./cloudinary.config";
import multer from "multer";

const storage = new CloudinaryStorage({
  cloudinary: cloudinaryUpload,
  params: {
    public_id: (req, file) => {
      const nameWithoutExt = file.originalname.split(".").slice(0, -1).join(".");

      const fileName = nameWithoutExt
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/\./g, "-")
        // eslint-disable-next-line no-useless-escape
        .replace(/[^a-z0-9\-\.]/g, "");

      const uniqueFileName = Math.random().toString(36).substring(2) + "-" + Date.now() + "-" + fileName;

      return uniqueFileName;
    },
  },
});

export const multerUpload = multer({ storage });
