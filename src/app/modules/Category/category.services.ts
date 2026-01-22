import { ICategory } from "./category.interface";
import { Category } from "./category.model";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status-codes";

const createCategory = async (payload: ICategory) => {
  const isCategoryExist = await Category.findOne({ slug: payload.slug });

  if (isCategoryExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "Category already exists");
  }

  const category = await Category.create(payload);

  return category;
};

const updateCategory = async (id: string, payload: Partial<ICategory>) => {
  const isCategoryExist = await Category.findById(id);

  if (!isCategoryExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "Category not found");
  }

  const category = await Category.findByIdAndUpdate(id, payload, { new: true });

  return category;
};

// TODO: Handle Sub Category First to Delete category
// const deleteCategory = async (id: string) => {
//   const isCategoryExist = await Category.findById(id);

//   if (!isCategoryExist) {
//     throw new AppError(httpStatus.BAD_REQUEST, "Category not found");
//   }

//   const category = await Category.findByIdAndDelete(id);

//   return category;
// };

export const CategoryServices = {
  createCategory,
  updateCategory,
};
