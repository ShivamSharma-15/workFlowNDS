const multer = require("multer");
const path = require("path");

// TEMP directory where files are first saved
const tempDir = path.join(__dirname, "..", "..", "upload", "tmp");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    // Keep the original name for now; service will rename it
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 200 * 1024 }, // 200KB max
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.match(/^image\/(jpeg|png)$/)) {
      return cb(new Error("Only JPEG and PNG images are allowed"));
    }
    cb(null, true);
  },
}).single("image");

const imageUploadMiddleware = (req, res, next) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res
        .status(400)
        .json({ errors: [{ msg: "File too large. Max 200KB allowed." }] });
    } else if (err) {
      return res.status(400).json({ errors: [{ msg: err.message }] });
    } else if (!req.file) {
      return res
        .status(400)
        .json({ errors: [{ msg: "Image file is required" }] });
    }
    next();
  });
};

module.exports = imageUploadMiddleware;
