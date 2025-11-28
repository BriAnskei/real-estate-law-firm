import { NextFunction, Request, Response } from "express";
import path from "path";
import fs from "fs";

/**
 * Delete the file_type directory
 */
export const deleteFileDirectoryIfNeeded = (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  const { case_id, stage_name, task_id, file_type } = req.params;

  const folderPath = path.join(
    "uploads",
    `case-${case_id}`,
    stage_name,
    `task-${task_id}`,
    file_type
  );

  if (fs.existsSync(folderPath)) {
    fs.rmSync(folderPath, { recursive: true, force: true });
  }
  next();
};

/**
 * Delete the intire foler path directory
 */
export const deleteTaskFolderMiddleware = async (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  const { case_id, stage_name, task_id, file_type } = req.params;

  const folderPath = path.join(
    "uploads",
    `case-${case_id}`,
    stage_name,
    `task-${task_id}`
  );

  try {
    await fs.promises.rm(folderPath, { recursive: true, force: true });
    next();
  } catch (error) {
    next(error);
  }
};
