import { model, Schema, Types } from "mongoose";
import { IConfig } from "./config.interface";

const configSchema = new Schema<IConfig>(
  {
    header: {
      navLinks: [{ type: Types.ObjectId, ref: "Category" }],
    },
  },
  { timestamps: true, versionKey: false },
);

export const Config = model<IConfig>("Config", configSchema);
