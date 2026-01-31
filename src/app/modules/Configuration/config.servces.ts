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
    { new: true },
  );

  return updatedConfig;
};

const getConfig = async () => {
  const config = await Config.aggregate([
    {
      $lookup: {
        from: "categories",
        let: { navLinks: "$header.navLinks" },
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
  ]);

  if (!config.length) {
    throw new AppError(httpStatus.NOT_FOUND, "Config not found");
  }

  return config[0];
};

export const ConfigServices = {
  updateHeaderConfig,
  getConfig,
};
