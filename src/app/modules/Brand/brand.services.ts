import AppError from "../../errorHelpers/AppError";
import { extractSearchQuery } from "../../utils/extractSearchQuery";
import { getSearchQuery } from "../../utils/getSearchQuery";
import { IMeta } from "../../utils/sendResponse";
import { IBrand } from "./brand.interface";
import { Brand } from "./brand.model";
import httpStatus from "http-status-codes";

const createBrand = async (payload: IBrand) => {
  const isBrandExist = await Brand.findOne({ title: payload.title });

  if (isBrandExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "Brand already exists");
  }

  const brand = await Brand.create(payload);

  return brand;
};

const updateBrand = async (id: string, payload: Partial<IBrand>) => {
  const isBrandExist = await Brand.findById(id);

  if (!isBrandExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "Brand not found");
  }

  const brand = await Brand.findByIdAndUpdate(id, payload, { new: true });

  return brand;
};

const deleteBrand = async (id: string) => {
  const isBrandExist = await Brand.findById(id);

  if (!isBrandExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "Brand not found");
  }

  await Brand.findByIdAndDelete(id);

  return null;
};

const getBrandsAdmin = async (query: Record<string, string>) => {
  const { page, skip, limit, search, sortBy, sortOrder } = extractSearchQuery(query);

  const filter: Record<string, unknown> = {};

  if (search) {
    Object.assign(filter, getSearchQuery(search, ["title", "slug"]));
  }

  if (query.featured !== undefined) {
    filter.featured = query.featured === "true";
  }

  const brands = await Brand.find(filter).sort({ [sortBy]: sortOrder === "asc" ? 1 : -1 }).skip(skip).limit(limit);

  const total = await Brand.countDocuments(filter);

  const meta: IMeta = {
    page,
    limit,
    skip,
    total,
  };

  return { brands, meta };
};

const getBrandsList = async (query: Record<string, string>) => {
  const { limit, skip, search, page } = extractSearchQuery(query);

  const searchQuery = getSearchQuery(search, ["title", "slug"]);

  const brands = await Brand.find(searchQuery).select("title slug").sort({ title: 1 }).skip(skip).limit(limit);

  const total = await Brand.countDocuments(searchQuery);

  const meta: IMeta = {
    page,
    limit,
    skip,
    total,
  };

  return { brands, meta };
};

export const BrandServices = {
  createBrand,
  updateBrand,
  deleteBrand,
  getBrandsAdmin,
  getBrandsList,
};
