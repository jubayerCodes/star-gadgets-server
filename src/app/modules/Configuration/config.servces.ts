import { Config } from "./config.model";

const updateConfig = async () => {
  const config = await Config.create({});

  return config;
};

export const ConfigServices = {
  updateConfig,
};
