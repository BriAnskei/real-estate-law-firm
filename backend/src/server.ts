import express, { Response, Request, NextFunction } from "express";
import "dotenv/config";
import cors from "cors";
import authRouter from "./route/auth.routes.js";
import cookieParser from "cookie-parser";
import userRouter from "./route/user.routes.js";
import registrationRouter from "./route/registration.routes.js";
import caseRoute from "./route/case.route.js";
import clientRoute from "./route/client.route.js";
import caseStageRoute from "./route/case_stages.route.js";
import taskRoute from "./route/task.route.js";
import taskFileRoute from "./route/task_file.route.js";
import path from "path";
import taskReviewRoute from "./route/task_review.route.js";
import hearingRoute from "./route/hearing.route.js";
import postponed_historyRouter from "./route/postponed_history.router.js";
import hearingCancellationRouter from "./route/hearing_cancellation.router.js";
import notificationRoute from "./route/notification.router.js";

const app = express();
const PORT = 4000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/registration", registrationRouter);

app.use("/api/case", caseRoute);
app.use("/api/case/stages", caseStageRoute);

app.use("/api/hearing", hearingRoute);
app.use("/api/hearing/postponements", postponed_historyRouter);
app.use("/api/hearing/cancellation", hearingCancellationRouter);
5;
app.use("/api/task", taskRoute);
app.use("/api/file", taskFileRoute);
app.use("/api/task/review", taskReviewRoute);

app.use("/api/client", clientRoute);

app.use("/api/notification", notificationRoute);

//  static routes for files
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.get("/", (req: Request, res: Response) => {
  res.send("Brian Pogi");
});

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error(`Error in ${err.functionName || "unknown"}:`, err.message);

  if (err.functionName === "authMiddleware") {
    console.log("accesToken");
    res.status(403).json({
      message: err.message || "Something went wrong",
      function: err.functionName || "unknown",
      success: false,
    });
  } else {
    res.json({
      message: err.message || "Something went wrong",
      function: err.functionName || "unknown",
      success: false,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
  console.log(`Server running on port http://localhost:${PORT}`);
  console.log(`server running on port ${PORT}`);
});
