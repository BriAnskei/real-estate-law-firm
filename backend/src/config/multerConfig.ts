import multer from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";

export const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const { task_id, file_type, case_id, stage_name } = req.params;
      const uploadPath = path.join(
        "uploads",
        `case-${case_id}`,
        `${stage_name}`,
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
