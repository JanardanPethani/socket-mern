import multer from "multer";

// Create memory storage
const storage = multer.memoryStorage();

// Define file filter for images
const imageFileFilter = (req, file, cb) => {
  // Accept only image files
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
    return cb(new Error("Only image files are allowed!"), false);
  }
  cb(null, true);
};

// Configure multer for profile pictures
const profilePicUpload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max size
  },
  fileFilter: imageFileFilter,
}).single("profilePic");

// Configure multer for multiple images (for other potential uses)
const multipleImagesUpload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max size per file
    files: 5, // Max 5 files
  },
  fileFilter: imageFileFilter,
}).array("images", 5);

// Helper to convert buffer to data URI
export const bufferToDataURI = (mimetype, buffer) => {
  const b64 = Buffer.from(buffer).toString("base64");
  return `data:${mimetype};base64,${b64}`;
};

export { profilePicUpload, multipleImagesUpload };
