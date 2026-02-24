import { DEFAULT_LIMIT, DEFAULT_PAGE, DEFAULT_SORT_BY, DEFAULT_SORT_ORDER } from "../constants/constants";

export const getSkip = (page: number, limit: number) => {
  const skip = (page - 1) * limit;
  return skip;
};

export const extractSearchQuery = (query: Record<string, string>) => {
  const { page, limit, sortBy = DEFAULT_SORT_BY, sortOrder = DEFAULT_SORT_ORDER, search = "" } = query;
  const skip = getSkip(parseInt(page) || DEFAULT_PAGE, parseInt(limit) || DEFAULT_LIMIT);

  const pageNumber = parseInt(page) || DEFAULT_PAGE;
  const limitNumber = parseInt(limit) || DEFAULT_LIMIT;

  return { page: pageNumber, limit: limitNumber, skip, sortBy, sortOrder, search };
};
