import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import indexRouter from "./routes/index.route";
import connectDB from "./config/db";
import cookieParser from "cookie-parser";
import cors from "cors";

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

connectDB();

app.get("/", (req: Request, res: Response) => {
  res.send("API is Running!");
});

app.use("/", indexRouter);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
