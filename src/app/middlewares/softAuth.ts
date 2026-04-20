import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env";
import { JwtPayload } from "jsonwebtoken";
import { setUserToReq } from "../utils/getUserFromReq";
import { verifyToken } from "../utils/jwt";

/**
 * softAuth — attaches req.user from the cookie access token if valid.
 * Does NOT throw if the token is missing or invalid (supports guest checkout).
 */
export const softAuth = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.accessToken;
    if (token) {
      const verifiedToken = verifyToken(token, envVars.JWT_SECRET) as JwtPayload;
      setUserToReq(req, verifiedToken);
    }
  } catch {
    // Silently ignore invalid/expired tokens — guest checkout is allowed
  }
  next();
};
