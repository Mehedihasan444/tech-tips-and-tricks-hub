import { Request } from "express";
import multer from "multer";
import { cloudinaryUpload } from "./cloudinary.config";

const removeExtension = (filename: string) => {
  return filename.split(".").slice(0, -1).join(".");
};

const buildPublicId = (file: Express.Multer.File) =>
  `${Math.random().toString(36).substring(2)}-${Date.now()}-${file.fieldname}-${removeExtension(file.originalname)}`;

/**
 * Minimal Cloudinary storage engine for multer 2 + cloudinary v2.
 * Replaces the unmaintained `multer-storage-cloudinary` adapter (which pins
 * cloudinary ^1). Emits the same file shape the codebase relies on:
 * `file.path` = secure URL, `file.filename` = public id.
 */
class CloudinaryStorageEngine implements multer.StorageEngine {
  // Parameter types are explicit because class methods don't inherit
  // contextual types from the implemented interface. The `error`/`info`
  // names below mirror multer's StorageEngine callback shape.
  /* eslint-disable no-unused-vars */
  _handleFile(
    _req: Request,
    file: Express.Multer.File,
    cb: (error?: Error | null, info?: Partial<Express.Multer.File>) => void,
  ) {
    const upload = cloudinaryUpload.uploader.upload_stream(
      { public_id: buildPublicId(file), resource_type: "image" },
      (error, result) => {
        if (error || !result) {
          cb(error ?? new Error("Cloudinary upload failed"));
          return;
        }
        cb(null, {
          path: result.secure_url,
          filename: result.public_id,
          size: result.bytes,
        });
      },
    );
    file.stream.pipe(upload);
  }

  _removeFile(_req: Request, file: Express.Multer.File, cb: (error: Error | null) => void) {
    // Best-effort cleanup when multer aborts a request partway through.
    const publicId = (file as { filename?: string }).filename;
    if (!publicId) {
      cb(null);
      return;
    }
    cloudinaryUpload.uploader
      .destroy(publicId, { resource_type: "image" })
      .then(() => cb(null))
      .catch(() => cb(null));
  }
  /* eslint-enable no-unused-vars */
}

const imageFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  if (/^image\/(jpeg|png|webp|gif)$/.test(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only jpeg, png, webp or gif images are allowed"));
  }
};

export const multerUpload = multer({
  storage: new CloudinaryStorageEngine(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: imageFilter,
});
