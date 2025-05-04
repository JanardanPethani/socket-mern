import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Uploads an image to Cloudinary with compression
 * @param {string} file - Base64 encoded image data
 * @param {Object} options - Additional upload options
 * @returns {string} The secure URL of the uploaded image
 */
export const uploadImage = async (file, options = {}) => {
  try {
    // Default compression and transformation options
    const defaultOptions = {
      folder: `${process.env.CLOUDINARY_FOLDER || "socket-demo"}/user-profiles`,
      resource_type: "auto",
      // Compression settings
      quality: "auto", // Automatically determine optimal quality
      fetch_format: "auto", // Automatically determine optimal format
      // Image optimization
      width: options.width || 800, // Resize width if not specified
      height: options.height || 800, // Resize height if not specified
      crop: "limit", // Resize to fit within width/height without cropping
      // Additional optimizations
      compression: "low", // Apply low compression
      strip_metadata: true, // Remove metadata to reduce file size
    };

    // Merge default options with any provided options
    const uploadOptions = { ...defaultOptions, ...options };

    const result = await cloudinary.uploader.upload(file, uploadOptions);
    return result.secure_url;
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    throw error;
  }
};

export default cloudinary;
