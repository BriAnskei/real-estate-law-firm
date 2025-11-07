import express, { Response, Request, NextFunction } from "express";
import "dotenv/config";
import cors from "cors";
import authRouter from "./route/auth.routes.js";
import cookieParser from "cookie-parser";
import userRouter from "./route/user.routes.js";
import registrationRouter from "./route/registration.routes.js";
import mailerRoutes from "./route/mailer.routes.js";

const app = express();
const PORT = 4000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/registration", registrationRouter);
app.use("/email", mailerRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Brian Pogi");
});

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error(`Error in ${err.functionName || "unknown"}:`, err.message);
  res.status(500).json({
    message: err.message || "Something went wrong",
    function: err.functionName || "unknown",
    success: false,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
  console.log(`Server running on port http://localhost:${PORT}`);
  console.log(`server running on port ${PORT}`);
});
