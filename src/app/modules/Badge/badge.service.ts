import AppError from "../../errorHelpers/AppError";
import { extractSearchQuery } from "../../utils/extractSearchQuery";
import { getSearchQuery } from "../../utils/getSearchQuery";
import { IMeta } from "../../utils/sendResponse";
import { IBadge } from "./badge.interface";
import { Badge } from "./badge.model";
import httpStatus from "http-status-codes";

const createBadge = async (payload: IBadge) => {
  const isBadgeExist = await Badge.findOne({ title: payload.title });

  if (isBadgeExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "Badge with this title already exists");
  }

  const badge = await Badge.create(payload);

  return badge;
};

const updateBadge = async (id: string, payload: Partial<IBadge>) => {
  const isBadgeExist = await Badge.findById(id);

  if (!isBadgeExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Badge not found");
  }

  const badge = await Badge.findByIdAndUpdate(id, payload, { returnDocument: "after" });

  return badge;
};

const deleteBadge = async (id: string) => {
  const isBadgeExist = await Badge.findById(id);

  if (!isBadgeExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Badge not found");
  }

  await Badge.findByIdAndDelete(id);

  return null;
};

const getAllBadges = async (query: Record<string, string>) => {
  const { page, skip, limit, search, sortBy, sortOrder } = extractSearchQuery(query);

  const filter: Record<string, unknown> = {};

  if (search) {
    Object.assign(filter, getSearchQuery(search, ["title"]));
  }

  const badges = await Badge.find(filter)
    .sort({ [sortBy]: sortOrder === "asc" ? 1 : -1 })
    .skip(skip)
    .limit(limit);

  const total = await Badge.countDocuments(filter);

  const meta: IMeta = {
    page,
    limit,
    skip,
    total,
  };

  return { badges, meta };
};

export const BadgeServices = {
  createBadge,
  updateBadge,
  deleteBadge,
  getAllBadges,
};
