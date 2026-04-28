export enum Role {
  USER = "USER",
  ADMIN = "ADMIN",
  SUPER_ADMIN = "SUPER_ADMIN",
}

export interface IAddress {
  fullName: string;
  phone: string;
  addressLine: string;
  city: string;
  district: string;
  country: string;
  zipCode?: string;
}

export enum Provider {
  LOCAL = "LOCAL",
  GOOGLE = "GOOGLE",
}

export interface IAuthProvider {
  provider: Provider;
  providerId: string;
}

export interface IUser {
  name: string;
  email: string;
  password?: string;
  avatar?: string;
  isDeleted: boolean;
  isVerified: boolean;
  phone: string;
  role: Role;
  billingAddress?: IAddress;
  shippingAddress?: IAddress;
  auths: IAuthProvider[];
}
