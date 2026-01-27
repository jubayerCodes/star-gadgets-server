import { Types } from "mongoose";
import { ICategoryWithSubCategories } from "../Category/category.interface";

export interface IConfig {
  _id?: Types.ObjectId;
  header: {
    navLinks: Types.ObjectId[];
  };
}

export interface IConfigResponse {
  _id?: Types.ObjectId;
  header: IHeaderConfigResponse;
}

export interface IHeaderConfigResponse {
  navLinks: Pick<ICategoryWithSubCategories, "_id" | "title" | "slug" | "subCategories">[];
}
