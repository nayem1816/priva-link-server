/* eslint-disable no-console */
const multer = require("multer");
const multerS3 = require("multer-s3");
const { S3Client, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const path = require("path");
const config = require("../config/config");

// ----------------------------------------------------
// 🔹 AWS S3 Configuration
const s3 = new S3Client({
  region: config.aws.region,
  credentials: {
    accessKeyId: config.aws.access_key_id,
    secretAccessKey: config.aws.secret_access_key,
  },
});

const BUCKET_NAME = config.aws.bucket_name;

// ----------------------------------------------------
// 🔹 Configuration for Upload Directories and Allowed Extensions
const UPLOAD_CONFIG = {
  image: {
    directory: "images", // This is now the folder in S3
    extensions: /\.(jpg|jpeg|png|webp|ico)$/,
    errorMessage: "Please upload a valid image file (jpg, jpeg, png, webp)",
  },
  file: {
    directory: "files",
    extensions: /\.(pdf|doc|docx|xls|xlsx|ppt|pptx)$/,
    errorMessage: "Please upload a valid document file (pdf, doc, docx, etc.)",
  },
};

// ----------------------------------------------------
// 🔹 Helper: Get Config for Media Type
const getMediaConfig = (mediaType) => {
  const config = UPLOAD_CONFIG[mediaType];
  if (!config) {
    throw new Error(`Unsupported media type: ${mediaType}`);
  }
  return config;
};

// ----------------------------------------------------
// 🔹 Multer S3 Storage Configuration
const storage = (folderName, mediaType) => {
  const { directory } = getMediaConfig(mediaType);

  return multerS3({
    s3: s3,
    bucket: BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => {
      const fileExtension = path.extname(file.originalname);
      const fileName =
        file.originalname
          .replace(fileExtension, "")
          .toLowerCase()
          .split(" ")
          .join("-") +
        "-" +
        Date.now() +
        fileExtension;
      cb(null, `${directory}/${folderName}/${fileName}`);
    },
  });
};

// ----------------------------------------------------
// 🔹 Main Upload Function
const uploadMediaToS3 = (folderName, mediaType = "image") => {
  const { extensions, errorMessage } = getMediaConfig(mediaType);

  return multer({
    storage: storage(folderName, mediaType),
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB
    },
    fileFilter(req, file, cb) {
      if (!file.originalname.match(extensions)) {
        return cb(new Error(errorMessage));
      }
      cb(null, true);
    },
  });
};

// ----------------------------------------------------
// 🔹 Delete Media from S3
const deleteMediaFromS3 = async (...params) => {
  try {
    for (const { publicId } of params) {
      if (!publicId) {
        console.error("Missing publicId in parameters.");
        continue;
      }

      const command = new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: publicId,
      });

      await s3.send(command);
      console.log(`Deleted file from S3: ${publicId}`);
    }
  } catch (err) {
    console.error(`Error deleting file from S3: ${err.message}`);
  }
};

// ----------------------------------------------------
// 🔹 Export Modules
module.exports = {
  uploadMediaToS3,
  deleteMediaFromS3,
};
