export interface ICategory {
  _id?: string;
  title: string;
  slug: string;
  image: string;
  featured: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
