import multer from "multer";
import path from "path";
import fs from "fs";

// storage folder dynamic based on type
const storage = (folder) =>
  multer.diskStorage({
    destination: (req, file, cb) => {
      const dir = path.join("public", folder);
      // make folder if doesn't exist
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      cb(null, dir);
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const name = file.fieldname + "-" + Date.now() + ext;
      cb(null, name);
    },
  });

/**
 * uploadFiles(folder, type, maxCount)
 * @param {string} folder - folder name inside public (adminAssets / userAssets)
 * @param {string} type - 'single' or 'multiple'
 * @param {number} maxCount - for multiple files max count
 */

export const uploadFiles = (
  folder,
  type = "single",
  fieldName = "file",
  maxCount = 1,
  fields = []
) => {
  const multerStorage = storage(folder);
  const upload = multer({ storage: multerStorage });

  switch (type) {
    case "single":
      return upload.single(fieldName); // req.file
    case "multiple":
      return upload.array(fieldName, maxCount); // req.files
    case "fields":
      return upload.fields(fields); // req.files.<fieldName>
    default:
      throw new Error(
        "Invalid upload type: choose 'single', 'multiple' or 'fields'"
      );
  }
};
