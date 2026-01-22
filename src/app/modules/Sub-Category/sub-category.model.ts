import { Schema, model } from "mongoose";
import { ISubCategory } from "./sub-category.interface";

const subCategorySchema = new Schema<ISubCategory>(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
      required: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  },
  { timestamps: true, versionKey: false },
);

export const SubCategory = model<ISubCategory>("SubCategory", subCategorySchema);
