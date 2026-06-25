import express from "express";
import authRoutes from "./modules/auth/routes/auth.routes";
import { errorHandler } from "./middleware/errorHandler";
import cookieParser from "cookie-parser";
import cors from "cors";
import imageRoutes from "./modules/image/routes/image.routes";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://img-gallery-dun.vercel.app",
];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
        return callback(null, true);
      }

      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/images", imageRoutes);

app.use(errorHandler);

export default app;
