import express from "express";
import authRoutes from "./modules/auth/routes/auth.routes";
import { errorHandler } from "./middleware/errorHandler";
import cookieParser from "cookie-parser";
import cors from "cors";
import imageRoutes from "./modules/image/routes/image.routes";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173", "https://img-gallery-dun.vercel.app"],
    credentials: true,
  }),
);

app.use("/api/auth", authRoutes);
app.use("/api/images", imageRoutes);

app.use(errorHandler);

export default app;
