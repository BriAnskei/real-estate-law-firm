import { Request, Response, NextFunction } from "express";

const asyncHandler =
  (fn: any, fnName?: string) =>
  (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch((err) => {
      err.functionName = fnName || fn.name || "anonymous";
      next(err);
    });

export default asyncHandler;
