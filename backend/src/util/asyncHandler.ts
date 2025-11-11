import { Request, Response, NextFunction } from "express";

const asyncHandler =
  (fn: any, fnName?: string) =>
  (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch((err) => {
      err.functionName = fnName || fn.name || "anonymous";

      // 🔥 Detailed error log
      console.error("========================================");
      console.error("❌ AsyncHandler Caught an Error");
      console.error("Function:", err.functionName);
      console.error("Route:", req.method, req.originalUrl);
      console.error("Message:", err.message);
      console.error("Stack Trace:\n", err.stack);
      console.error("========================================");

      next(err);
    });

export default asyncHandler;
