import { NextFunction, Request, Response } from "express";
import { Role } from "../modules/User/user.interface";
import AppError from "../errorHelpers/AppError";
import { envVars } from "../config/env";
import { JwtPayload } from "jsonwebtoken";
import { setUserToReq } from "../utils/getUserFromReq";
import { verifyToken } from "../utils/jwt";

export const checkAuth =
  (...authRoles: Role[]) =>
  async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const token = req.cookies.accessToken;

      if (!token) {
        throw new AppError(403, "No token found");
      }

      const verifiedToken = verifyToken(token, envVars.JWT_SECRET) as JwtPayload;
      
      if (!authRoles.includes(verifiedToken.role)) {
        throw new AppError(403, "You are not authorized to access this route");
      }

      setUserToReq(req, verifiedToken);

      next();
    } catch (error) {
      next(error);
    }
  };
