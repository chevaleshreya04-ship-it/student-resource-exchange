import multer from "multer";
import CloudinaryStorage from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary: { v2: cloudinary }, // shim: package expects .v2 nested, we only have v2 itself
  params: {
    folder: "sre-resources",
    resource_type: "auto",
  },
});

const upload = multer({ storage });

export default upload;