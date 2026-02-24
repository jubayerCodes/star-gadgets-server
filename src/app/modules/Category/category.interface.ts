import { ISubCategory } from "../Sub-Category/sub-category.interface";

export interface ICategory {
  _id?: string;
  title: string;
  slug: string;
  image: string;
  featured: boolean;
  nav: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICategoryAdmin extends ICategory {
  subCategoriesCount: number;
}

export interface ICategoryWithSubCategories extends ICategory {
  subCategories: Pick<ISubCategory, "_id" | "title" | "slug">[];
}
