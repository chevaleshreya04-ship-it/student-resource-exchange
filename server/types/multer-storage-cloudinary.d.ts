declare module "multer-storage-cloudinary" {
  import type { StorageEngine } from "multer";

  interface CloudinaryStorageOptions {
    cloudinary: { v2: unknown };
    params?:
      | Record<string, unknown>
      | ((req: unknown, file: unknown) => Record<string, unknown> | Promise<Record<string, unknown>>);
  }

  export default class CloudinaryStorage implements StorageEngine {
    constructor(options: CloudinaryStorageOptions);
    _handleFile: StorageEngine["_handleFile"];
    _removeFile: StorageEngine["_removeFile"];
  }
}