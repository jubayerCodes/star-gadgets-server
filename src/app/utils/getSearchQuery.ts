export const getSearchQuery = (search: string, fields: string[]) => {
  return {
    $or: fields.map((field) => ({ [field]: { $regex: search, $options: "i" } })),
  };
};
