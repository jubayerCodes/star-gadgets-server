import { Types } from "mongoose";

export interface ISubCategory {
  _id?: string;
  title: string;
  slug: string;
  categoryId: Types.ObjectId;
  image: string;
  featured: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
