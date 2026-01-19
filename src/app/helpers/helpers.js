const jwt = require("jsonwebtoken");

const createToken = (payload, secret, expireTime) => {
  return jwt.sign(payload, secret, {
    expiresIn: expireTime,
  });
};

const verifyToken = (token, secret) => {
  return jwt.verify(token, secret);
};

const csvToArray = (input) => {
  if (!input || typeof input !== "string") return [];
  const trimmed = input.trim();
  return trimmed.includes(",")
    ? trimmed.split(",").map((item) => item.trim())
    : trimmed;
};

function extractS3ImageData(req) {
  const uploadedFile = req.file || {};
  const uploadedFiles = req.files || {};

  // Handle single file upload
  if (uploadedFile?.location) {
    return {
      url: uploadedFile.location,
      publicId: uploadedFile.key,
    };
  }

  // Handle multiple file uploads dynamically
  const imageData = {};
  Object.entries(uploadedFiles).forEach(([fieldName, filesList]) => {
    if (Array.isArray(filesList) && filesList.length > 0) {
      imageData[fieldName] =
        filesList.length > 1
          ? filesList.map((file) => ({
              url: file.location,
              publicId: file.key,
            }))
          : {
              url: filesList[0].location,
              publicId: filesList[0].key,
            };
    }
  });

  return imageData;
}

module.exports = {
  createToken,
  verifyToken,
  csvToArray,
  extractS3ImageData,
};
