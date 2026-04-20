import { SubCategory } from "./sub-category.model";
import { Category } from "../Category/category.model";
import { Product } from "../Product/product.model";
import httpStatus from "http-status-codes";
import { ISubCategory } from "./sub-category.interface";
import AppError from "../../errorHelpers/AppError";
import { IMeta } from "../../utils/sendResponse";
import { extractSearchQuery } from "../../utils/extractSearchQuery";
import { getSearchQuery } from "../../utils/getSearchQuery";
import { PipelineStage } from "mongoose";

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

  const subCategory = await SubCategory.findByIdAndUpdate(id, payload, {
    returnDocument: "after",
  });

  return subCategory;
};

const getSubCategoriesAdmin = async (query: Record<string, string>) => {
  const { page, limit, skip, search, sortBy, sortOrder } = extractSearchQuery(query);

  const filter: Record<string, unknown> = {};

  if (search) {
    Object.assign(filter, getSearchQuery(search, ["title", "slug"]));
  }

  if (query.featured !== undefined) {
    filter.featured = query.featured === "true";
  }

  if (query.category) {
    const category = await Category.findOne({ slug: query.category }).select("_id");
    if (!category) {
      throw new AppError(httpStatus.NOT_FOUND, `Category '${query.category}' not found`);
    }
    filter.categoryId = category._id;
  } else if (query.categoryId) {
    filter.categoryId = query.categoryId;
  }

  const subCategories = await SubCategory.find(filter)
    .populate("categoryId")
    .sort({ [sortBy]: sortOrder === "asc" ? 1 : -1 })
    .skip(skip)
    .limit(limit);

  const total = await SubCategory.countDocuments(filter);

  const meta: IMeta = {
    page,
    limit,
    skip,
    total,
  };

  return { subCategories, meta };
};

const getSubCategoriesList = async (query: Record<string, string>) => {
  const { limit, skip, search, page } = extractSearchQuery(query);

  const filter: Record<string, unknown> = { ...getSearchQuery(search, ["title", "slug"]) };

  if (query.category) {
    const category = await Category.findOne({ slug: query.category }).select("_id");
    if (!category) {
      throw new AppError(httpStatus.NOT_FOUND, `Category '${query.category}' not found`);
    }
    filter.categoryId = category._id;
  } else if (query.categoryId) {
    filter.categoryId = query.categoryId;
  }

  const subCategories = await SubCategory.find(filter).select("title slug").sort({ title: 1 }).skip(skip).limit(limit);

  const total = await SubCategory.countDocuments(filter);

  const meta: IMeta = {
    page,
    limit,
    skip,
    total,
  };

  return { subCategories, meta };
};

const getSubCategoryBySlug = async (slug: string) => {
  const subCategory = await SubCategory.findOne({ slug }).populate("categoryId", "_id title slug image").lean();

  if (!subCategory) {
    throw new AppError(httpStatus.NOT_FOUND, "Sub-category not found");
  }

  return subCategory;
};

const getSubCategoryProductFilters = async (subCategorySlug: string) => {
  const subCategory = await SubCategory.findOne({ slug: subCategorySlug }).lean();
  if (!subCategory) {
    throw new AppError(httpStatus.NOT_FOUND, "Sub-category not found");
  }

  const brandsPipeline: PipelineStage[] = [
    { $match: { isDeleted: false, isActive: true, subCategoryId: subCategory._id } },
    { $lookup: { from: "brands", localField: "brandId", foreignField: "_id", as: "brandId" } },
    { $unwind: { path: "$brandId", preserveNullAndEmptyArrays: false } },
    {
      $group: {
        _id: "$brandId._id",
        title: { $first: "$brandId.title" },
        slug: { $first: "$brandId.slug" },
      },
    },
    { $sort: { title: 1 } },
    { $project: { _id: 1, title: 1, slug: 1 } },
  ];

  const brands = await Product.aggregate(brandsPipeline);
  return { brands };
};

export const SubCategoryServices = {
  createSubCategory,
  updateSubCategory,
  getSubCategoriesAdmin,
  getSubCategoriesList,
  getSubCategoryBySlug,
  getSubCategoryProductFilters,
};
