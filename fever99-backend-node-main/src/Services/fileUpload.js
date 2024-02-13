import multer from 'multer';
import path from 'path'

export const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const filename = file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    req.filename = 'files/' + filename
    cb(
      null,
      filename
    );

  },
});


export const storeFiles = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const filename = file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    req[file.fieldname] = 'files/' + filename
    cb(
      null,
      filename
    );

  },
});



// module.exports = storage;