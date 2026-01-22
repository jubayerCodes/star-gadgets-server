export enum Role {
  USER = "USER",
  ADMIN = "ADMIN",
  SUPER_ADMIN = "SUPER_ADMIN",
}

export interface IUserAddress {
  address: string;
  isDefault: boolean;
}

export interface IUser {
  name: string;
  email: string;
  password?: string;
  avatar?: string;
  isDeleted: boolean;
  phone: string;
  role: Role;
  addresses?: IUserAddress[];
}
