import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import indexRouter from "./routes/index.route";
import connectDB from "./config/db";
import cookieParser from "cookie-parser";
import cors from "cors";
import { errorHandler } from "./middleware/error.middleware";
import morgan from "morgan";

const app = express();

app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS!.split(","),
    credentials: true,
  }),
);

const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

connectDB();

app.set("trust proxy", 1);

app.get("/", (req: Request, res: Response) => {
  res.send("API is Running!");
});
app.use("/api", indexRouter);

app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
