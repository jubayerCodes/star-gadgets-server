import { model, Schema } from "mongoose";
import { IAddress, IUser, Role, IAuthProvider, Provider } from "./user.interface";

const AddressSchema = new Schema<IAddress>(
  {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    addressLine: { type: String, required: true },
    city: { type: String, required: true },
    district: { type: String, required: true },
    country: { type: String, required: true },
    zipCode: { type: String },
  },
  { _id: false, versionKey: false },
);

export const AuthProviderSchema = new Schema<IAuthProvider>(
  {
    provider: { type: String, enum: Object.values(Provider), required: true },
    providerId: { type: String, required: true },
  },
  {
    _id: false,
    versionKey: false,
  },
);

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
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: true,
    },
    billingAddress: { type: AddressSchema },
    shippingAddress: { type: AddressSchema },
    auths: [AuthProviderSchema],
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const User = model<IUser>("User", UserSchema);
