import { ICategory } from "./category.interface";
import { Category } from "./category.model";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status-codes";
import { SubCategory } from "../Sub-Category/sub-category.model";

const createCategory = async (payload: ICategory) => {
  const isCategoryExist = await Category.findOne({ title: payload.title });

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

const deleteCategory = async (id: string) => {
  const isCategoryExist = await Category.findById(id);

  if (!isCategoryExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "Category not found");
  }

  const isSubCategoryExist = await SubCategory.findOne({ categoryId: id });

  if (isSubCategoryExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "Sub category already exists");
  }

  await Category.findByIdAndDelete(id);

  return null;
};

const getCategoriesWithSubCategories = async () => {
  const categories = await Category.aggregate([
    {
      $lookup: {
        from: "subcategories",
        let: { categoryId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$categoryId", "$$categoryId"] },
            },
          },
          {
            $project: {
              _id: 1,
              title: 1,
              slug: 1,
            },
          },
        ],
        as: "subCategories",
      },
    },
  ]);

  return categories;
};

const getCategoriesList = async () => {
  const categories = await Category.find().select("title slug").sort({ title: 1 });

  return categories;
};

export const CategoryServices = {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoriesWithSubCategories,
  getCategoriesList,
};
