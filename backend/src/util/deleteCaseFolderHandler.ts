import fs from "fs/promises";
import path from "path";

export async function deleteCaseFolder(caseId: number | string) {
  const folderPath = path.join("uploads", `case-${caseId}`);

  try {
    await fs.rm(folderPath, { recursive: true, force: true });
    console.log(`Deleted folder: ${folderPath}`);
  } catch (err) {
    console.error("Error deleting folder:", err);
    throw err;
  }
}
