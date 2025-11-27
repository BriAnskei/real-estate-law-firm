import multer from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";

export const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const { task_id, file_type } = req.params;
      const uploadPath = path.join(
        "uploads",
        `task-${task_id}`,
        `${file_type}`
      );

      fs.mkdirSync(uploadPath, { recursive: true });

      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = crypto.randomBytes(6).toString("hex");
      const ext = path.extname(file.originalname);

      cb(null, `${Date.now()}-${uniqueSuffix}${ext}`);
    },
  }),
});
