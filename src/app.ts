import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { router } from "./app/routes";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import notfound from "./app/middlewares/notFound";
import { envVars } from "./app/config/env";

const app = express();

app.use(cookieParser());

// app.use(
//   cors({
//     origin: ["https://star-gadgets-client.onrender.com"],
//     credentials: true,
//   }),
// );

const allowedOrigins = [
  "https://star-gadgets-client.vercel.app",
  "https://star-gadgets-client.onrender.com",
  "http://localhost:8000",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("trust proxy", 1);

app.use("/api/v1", router);

app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
    message: "Welcome to Star Gadgets",
  });
});

app.use(globalErrorHandler);

app.use(notfound);

export default app;
