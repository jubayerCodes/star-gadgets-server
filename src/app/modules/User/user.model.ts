import { model, Schema } from "mongoose";
import { IUserAddress, IUser, Role } from "./user.interface";

const AddressSchema = new Schema<IUserAddress>({
  address: {
    type: String,
    required: true,
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
});

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    avatar: {
      type: String,
    },
    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.USER,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    addresses: [AddressSchema],
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const User = model<IUser>("User", UserSchema);
