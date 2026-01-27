import { Category } from "../../Category/category.model";
import { IHeaderConfigResponse } from "./header-config.interface";

const getHeaderConfig = async (): Promise<IHeaderConfigResponse> => {
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
    {
      $project: {
        _id: 1,
        title: 1,
        slug: 1,
        subCategories: 1,
      },
    },
  ]);

  const navLinks = categories.map((category) => ({
    _id: category._id,
    title: category.title,
    slug: category.slug,
    subCategories: category.subCategories,
  }));

  const config: IHeaderConfigResponse = {
    navLinks,
  };

  return config;
};

export const HeaderConfigServices = {
  getHeaderConfig,
};
