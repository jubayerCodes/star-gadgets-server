import { Types } from "mongoose";
import { ICategoryWithSubCategories } from "../Category/category.interface";

// Hero type 1: fixed 3 items (image, id, link)
export interface IHeroFixedItem {
  id: string;
  image: string;
  link: string;
}

// Hero type 2: carousel/array items (image, button, buttonLink, id)
export interface IHeroCarouselItem {
  id: string;
  image: string;
  button: string;
  buttonLink: string;
}

// Superset type — used for Mongoose schema (compatible with both hero variants)
export interface THeroItem {
  id: string;
  image: string;
  link?: string;
  button?: string;
  buttonLink?: string;
}

export interface IConfig {
  _id?: Types.ObjectId;
  header: {
    navLinks: Types.ObjectId[];
  };
  hero: {
    heroType: "fixed" | "carousel";
    heroContent: THeroItem[];
  };
}

export interface IConfigResponse {
  _id?: Types.ObjectId;
  header: IHeaderConfigResponse;
  hero: {
    heroType: "fixed" | "carousel";
    heroContent: IHeroFixedItem[] | IHeroCarouselItem[];
  };
}

export interface IHeaderConfigResponse {
  navLinks: Pick<ICategoryWithSubCategories, "_id" | "title" | "slug" | "subCategories">[];
}
