import { model, Schema, Types } from "mongoose";
import { IConfig } from "./config.interface";

const heroFixedItemSchema = new Schema(
  {
    id: { type: String, required: true },
    image: { type: String, required: true },
    link: { type: String, required: true },
  },
  { _id: false },
);

const heroCarouselItemSchema = new Schema(
  {
    id: { type: String, required: true },
    image: { type: String, required: true },
    button: { type: String, required: true },
    buttonLink: { type: String, required: true },
  },
  { _id: false },
);

// Keep sub-schemas exported for reuse / validation reference
export { heroFixedItemSchema, heroCarouselItemSchema };

const configSchema = new Schema<IConfig>(
  {
    header: {
      navLinks: [{ type: Types.ObjectId, ref: "Category" }],
    },
    hero: {
      heroType: {
        type: String,
        enum: ["fixed", "carousel"],
        default: "fixed",
      },
      fixedContent: {
        type: [heroFixedItemSchema],
        default: [],
      },
      carouselContent: {
        type: [heroCarouselItemSchema],
        default: [],
      },
    },
    shippingMethods: {
      type: [
        {
          name: { type: String, required: true },
          cost: { type: Number, required: true },
        },
      ],
      default: [
        { name: "Inside Dhaka", cost: 60 },
        { name: "Outside Dhaka", cost: 120 },
      ],
    },
  },
  { timestamps: true, versionKey: false },
);

export const Config = model<IConfig>("Config", configSchema);
