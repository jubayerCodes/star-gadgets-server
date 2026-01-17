import { Request, Response } from "express";
import httpStatus from "http-status-codes";

const notfound = (_req: Request, res: Response) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: "Route not found",
  });
};

export default notfound;
