import { SubCategory } from "./sub-category.model";
import httpStatus from "http-status-codes";
import { ISubCategory } from "./sub-category.interface";
import AppError from "../../errorHelpers/AppError";
import { IMeta } from "../../utils/sendResponse";
import { extractSearchQuery } from "../../utils/extractSearchQuery";

const createSubCategory = async (payload: ISubCategory) => {
  const isSubCategoryExist = await SubCategory.findOne({ slug: payload.slug });

  if (isSubCategoryExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "Sub Category already exists");
  }

  const subCategory = await SubCategory.create(payload);

  return subCategory;
};

const updateSubCategory = async (id: string, payload: Partial<ISubCategory>) => {
  const isSubCategoryExist = await SubCategory.findById(id);

  if (!isSubCategoryExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "Sub Category not found");
  }

  const subCategory = await SubCategory.findByIdAndUpdate(id, payload, { new: true });

  return subCategory;
};

const getSubCategoriesAdmin = async (query: Record<string, string>) => {
  const { page, limit, skip } = extractSearchQuery(query);

  const subCategories = await SubCategory.find().populate("categoryId").skip(skip).limit(limit);

  const total = await SubCategory.countDocuments();

  const meta: IMeta = {
    page,
    limit,
    skip,
    total,
  };

  return { subCategories, meta };
};

export const SubCategoryServices = {
  createSubCategory,
  updateSubCategory,
  getSubCategoriesAdmin,
};
