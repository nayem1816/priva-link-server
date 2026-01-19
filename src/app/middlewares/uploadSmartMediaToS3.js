const multer = require("multer");
const multerS3 = require("multer-s3");
const path = require("path");
const { S3Client } = require("@aws-sdk/client-s3");
const config = require("../config/config");

// 🔹 AWS S3 Config
const s3 = new S3Client({
  region: config.aws.region,
  credentials: {
    accessKeyId: config.aws.access_key_id,
    secretAccessKey: config.aws.secret_access_key,
  },
});

const BUCKET_NAME = config.aws.bucket_name;

// 🔹 Supported Extensions
const SUPPORTED_CONFIG = {
  image: {
    extensions: /\.(jpg|jpeg|png|webp)$/i,
    directory: "images",
  },
  file: {
    extensions: /\.(pdf|doc|docx|xls|xlsx|ppt|pptx)$/i,
    directory: "files",
  },
};

// 🔹 Detect Type & Folder
const detectFileTypeAndFolder = (filename) => {
  for (const [, config] of Object.entries(SUPPORTED_CONFIG)) {
    if (config.extensions.test(filename)) {
      return config.directory;
    }
  }
  throw new Error(
    "Unsupported file type. Allowed: jpg, jpeg, png, webp, pdf, doc, docx, xls, xlsx, ppt, pptx"
  );
};

// 🔹 Multer Storage Config
const dynamicS3Storage = (folderBase = "") => {
  return multerS3({
    s3,
    bucket: BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => {
      try {
        const extension = path.extname(file.originalname);
        const name = path.basename(file.originalname, extension);
        const safeName = name.toLowerCase().split(" ").join("-");
        const finalName = `${safeName}-${Date.now()}${extension}`;

        const directory = detectFileTypeAndFolder(file.originalname);
        const fullPath = `${directory}/${folderBase}/${finalName}`;

        cb(null, fullPath);
      } catch (err) {
        cb(err);
      }
    },
  });
};

// 🔹 Final Middleware
const uploadSmartMediaToS3 = (folderBase = "") => {
  return multer({
    storage: dynamicS3Storage(folderBase),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
      try {
        detectFileTypeAndFolder(file.originalname);
        cb(null, true);
      } catch (err) {
        cb(new Error(err.message));
      }
    },
  });
};

// 🔹 Exports
module.exports = {
  uploadSmartMediaToS3,
};
