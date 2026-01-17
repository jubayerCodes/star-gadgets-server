import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

export const getUserFromReq = (req: Request) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (req as any).user;
};

export const setUserToReq = (req: Request, user: JwtPayload) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (req as any).user = user;
};
