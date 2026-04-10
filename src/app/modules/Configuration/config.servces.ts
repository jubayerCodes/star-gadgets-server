import AppError from "../../errorHelpers/AppError";
import { IConfig } from "./config.interface";
import { Config } from "./config.model";
import httpStatus from "http-status-codes";

const updateHeaderConfig = async (id: string, payload: Pick<IConfig, "header">) => {
  const isConfigExist = await Config.findById(id);

  if (!isConfigExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Config not found");
  }

  const updatedConfig = await Config.findByIdAndUpdate(
    id,
    {
      header: payload?.header,
    },
    { returnDocument: "after" },
  );

  return updatedConfig;
};

const updateHeroConfig = async (id: string, payload: Partial<IConfig>) => {
  const isConfigExist = await Config.findById(id);

  if (!isConfigExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Config not found");
  }

  const updateData: Record<string, unknown> = {};
  if (payload.hero?.heroType !== undefined) {
    updateData["hero.heroType"] = payload.hero.heroType;
  }
  if (payload.hero?.fixedContent !== undefined) {
    updateData["hero.fixedContent"] = payload.hero.fixedContent;
  }
  if (payload.hero?.carouselContent !== undefined) {
    updateData["hero.carouselContent"] = payload.hero.carouselContent;
  }

  const updatedConfig = await Config.findByIdAndUpdate(id, { $set: updateData }, { returnDocument: "after" });

  return updatedConfig;
};

const getConfig = async () => {
  const config = await Config.aggregate([
    // Step 1: Save the original ordered IDs before $lookup overwrites the field
    {
      $addFields: {
        "header.navLinksOrder": "$header.navLinks",
      },
    },
    // Step 2: Lookup and populate category documents
    {
      $lookup: {
        from: "categories",
        let: { navLinks: "$header.navLinksOrder" },
        pipeline: [
          {
            $match: {
              $expr: { $in: ["$_id", "$$navLinks"] },
            },
          },
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
        ],
        as: "header.navLinks",
      },
    },
    // Step 3: Re-sort navLinks to match the original stored ID order
    {
      $addFields: {
        "header.navLinks": {
          $map: {
            input: "$header.navLinksOrder",
            as: "id",
            in: {
              $first: {
                $filter: {
                  input: "$header.navLinks",
                  as: "cat",
                  cond: { $eq: ["$$cat._id", "$$id"] },
                },
              },
            },
          },
        },
      },
    },
    // Step 4: Remove the temporary ordering field
    {
      $project: {
        "header.navLinksOrder": 0,
      },
    },
  ]);

  if (!config.length) {
    throw new AppError(httpStatus.NOT_FOUND, "Config not found");
  }

  return config[0];
};

export const ConfigServices = {
  updateHeaderConfig,
  updateHeroConfig,
  getConfig,
};
