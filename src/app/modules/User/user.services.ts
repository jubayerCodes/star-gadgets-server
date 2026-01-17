import { User } from "./user.model";
import { IUser } from "./user.interface";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status-codes";
import bcrypt from "bcryptjs";
import { envVars } from "../../config/env";

const createUser = async (payload: IUser) => {
  const { email, password, ...rest } = payload;

  const isUserExist = await User.findOne({ email });

  if (isUserExist) {
    throw new AppError(httpStatus?.BAD_REQUEST, "User Already Exist");
  }

  const hashedPassword = await bcrypt.hash(password as string, Number(envVars.BCRYPT_SALT_ROUNDS));

  const user = await User.create({
    email,
    password: hashedPassword,
    ...rest,
  });

  const { password: pass, ...newUser } = user.toObject();

  return newUser;
};

const getAllUsers = async () => {
  const filterOptions = {
    isDeleted: false,
  };

  const users = await User.find(filterOptions).select("-password");
  return users;
};

export const UserServices = {
  createUser,
  getAllUsers,
};
