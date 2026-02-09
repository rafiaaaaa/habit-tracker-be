import { Router, Request, Response } from "express";

const router = Router();

router.get("/ping", (req: Request, res: Response) => {
  res.json({ message: "poasng" });
});

export default router;
