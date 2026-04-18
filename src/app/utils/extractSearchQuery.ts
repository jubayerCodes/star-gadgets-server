import { PRODUCT_LISTING_ADMIN } from "../constants/constants";

export const getSkip = (page: number, limit: number) => {
  const skip = (page - 1) * limit;
  return skip;
};

export const extractSearchQuery = (query: Record<string, string>) => {
  const {
    page,
    limit,
    sortBy = PRODUCT_LISTING_ADMIN.DEFAULT_SORT_BY,
    sortOrder = PRODUCT_LISTING_ADMIN.DEFAULT_SORT_ORDER,
    search = "",
  } = query;
  const skip = getSkip(
    parseInt(page) || PRODUCT_LISTING_ADMIN.DEFAULT_PAGE,
    parseInt(limit) || PRODUCT_LISTING_ADMIN.DEFAULT_LIMIT,
  );

  const pageNumber = parseInt(page) || PRODUCT_LISTING_ADMIN.DEFAULT_PAGE;
  const limitNumber = parseInt(limit) || PRODUCT_LISTING_ADMIN.DEFAULT_LIMIT;

  return {
    page: pageNumber,
    limit: limitNumber,
    skip,
    sortBy,
    sortOrder,
    search,
  };
};
