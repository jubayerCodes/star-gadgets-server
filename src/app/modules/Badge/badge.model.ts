import { model, Schema } from "mongoose";
import { IBadge } from "./badge.interface";

const badgeSchema = new Schema<IBadge>(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    editable: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true, versionKey: false },
);

export const Badge = model<IBadge>("Badge", badgeSchema);
