import { cloudinaryUpload } from "../config/cloudinary.config";
import { TImageFiles } from "../interfaces/image.interface";

export const deleteImageFromCloudinary = async (files: TImageFiles) => {
  const publicIds: string[] = [];

  for (const file of Object.values(files)) {
    for (const image of file) {
      publicIds.push(image.filename);
    }
  }

  if (publicIds.length === 0) {
    return null;
  }

  return cloudinaryUpload.api.delete_resources(publicIds, { resource_type: "image" });
};
