export enum Role {
  USER = "USER",
  ADMIN = "ADMIN",
  SUPER_ADMIN = "SUPER_ADMIN",
}

export interface IUserAddress {
  address: string;
  isDefault: boolean;
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
  addresses?: IUserAddress[];
  auths: IAuthProvider[];
}
