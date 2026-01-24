import { User } from "./user.model";
import { IAuthProvider, IUser, Provider } from "./user.interface";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status-codes";
import bcrypt from "bcryptjs";
import { envVars } from "../../config/env";

const createUser = async (payload: Partial<IUser>) => {
  const { email, password, ...rest } = payload;

  const isUserExist = await User.findOne({ email });

  if (isUserExist) {
    throw new AppError(httpStatus?.BAD_REQUEST, "User Already Exist");
  }

  const hashedPassword = await bcrypt.hash(password as string, Number(envVars.BCRYPT_SALT_ROUNDS));

  const authProvider: IAuthProvider = { provider: Provider.LOCAL, providerId: email as string };

  const user = await User.create({
    email,
    password: hashedPassword,
    auths: [authProvider],
    ...rest,
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
