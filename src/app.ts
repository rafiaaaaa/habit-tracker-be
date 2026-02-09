import express, { Request, Response } from "express";
import indexRouter from "./routes/index.route";
import dotenv from "dotenv";
import connectDB from "./config/db";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
connectDB();

app.get("/", (req: Request, res: Response) => {
  res.send("API is Running!");
});

app.use("/", indexRouter);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
