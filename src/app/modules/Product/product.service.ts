import { IProduct } from "./product.interface";
import { Product } from "./product.model";
import { PipelineStage } from "mongoose";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status-codes";
import { extractSearchQuery } from "../../utils/extractSearchQuery";
import { getSearchQuery } from "../../utils/getSearchQuery";
import { IMeta } from "../../utils/sendResponse";

const createProduct = async (payload: IProduct) => {
  const isProductExist = await Product.findOne({ slug: payload.slug });

  if (isProductExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "Product with this slug already exists");
  }

  const isProductCodeExist = await Product.findOne({ productCode: payload.productCode });

  if (isProductCodeExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "Product with this code already exists");
  }

  const product = await Product.create(payload);

  return product;
};

const getAllProducts = async (query: Record<string, string>) => {
  const { page, skip, limit, search } = extractSearchQuery(query);

  const searchQuery = getSearchQuery(search, ["title", "slug", "productCode"]);

  const filterQuery = { ...searchQuery, isDeleted: false };

  const products = await Product.find(filterQuery)
    .populate("categoryId brandId subCategoryId")
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const total = await Product.countDocuments(filterQuery);

  const meta: IMeta = {
    page,
    limit,
    skip,
    total,
  };

  return { products, meta };
};

const getProductById = async (id: string) => {
  const product = await Product.findOne({ _id: id, isDeleted: false }).populate("categoryId brandId subCategoryId");

  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, "Product not found");
  }

  return product;
};

const getProductBySlug = async (slug: string) => {
  const product = await Product.findOne({ slug, isDeleted: false }).populate("categoryId brandId subCategoryId");

  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, "Product not found");
  }

  return product;
};

const updateProduct = async (id: string, payload: Partial<IProduct>) => {
  const isProductExist = await Product.findOne({ _id: id, isDeleted: false });

  if (!isProductExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Product not found");
  }

  if (payload.slug && payload.slug !== isProductExist.slug) {
    const isSlugExist = await Product.findOne({ slug: payload.slug });
    if (isSlugExist) {
      throw new AppError(httpStatus.BAD_REQUEST, "Product with this slug already exists");
    }
  }

  if (payload.productCode && payload.productCode !== isProductExist.productCode) {
    const isCodeExist = await Product.findOne({ productCode: payload.productCode });
    if (isCodeExist) {
      throw new AppError(httpStatus.BAD_REQUEST, "Product with this code already exists");
    }
  }

  const product = await Product.findByIdAndUpdate(id, payload, { returnDocument: "after" });

  return product;
};

const deleteProduct = async (id: string) => {
  const isProductExist = await Product.findOne({ _id: id, isDeleted: false });

  if (!isProductExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Product not found");
  }

  // Soft delete
  await Product.findByIdAndUpdate(id, { isDeleted: true }, { returnDocument: "after" });

  return null;
};

const getProductsAdmin = async (query: Record<string, string>) => {
  const { page, skip, limit, search, sortBy, sortOrder } = extractSearchQuery(query);
  const { minPrice, maxPrice, category, subCategory, brand, isActive, isFeatured } = query;

  const searchQuery = getSearchQuery(search, ["title", "slug", "productCode"]);

  const matchStage: Record<string, unknown> = { ...searchQuery, isDeleted: false };

  // Filter by isActive if provided
  if (isActive !== undefined) matchStage.isActive = isActive === "true";
  if (isFeatured !== undefined) matchStage.isFeatured = isFeatured === "true";

  // Build price range filter — applied after $addFields computes minPrice / maxPrice
  const priceMatchConditions: Record<string, unknown> = {};
  if (minPrice) priceMatchConditions.minPrice = { $gte: Number(minPrice) };
  if (maxPrice) priceMatchConditions.maxPrice = { $lte: Number(maxPrice) };

  // Determine sort field and direction
  const sortDirection = sortOrder === "asc" ? 1 : -1;
  const sortableFields: Record<string, unknown> = {
    priceRange: { minPrice: sortDirection },
    stock: { stock: sortDirection },
    createdAt: { createdAt: sortDirection },
    updatedAt: { updatedAt: sortDirection },
    title: { title: sortDirection },
  };

  // Slug-based ref filters — applied after lookups
  const refMatchStage: Record<string, unknown> = {};
  if (category) refMatchStage["categoryId.slug"] = category;
  if (subCategory) refMatchStage["subCategoryId.slug"] = subCategory;
  if (brand) refMatchStage["brandId.slug"] = brand;
  const sortStage = sortableFields[sortBy] ?? { createdAt: -1 };

  const pipeline = [
    { $match: matchStage },

    // Compute minPrice, maxPrice, and total stock from variants
    {
      $addFields: {
        minPrice: { $min: "$variants.price" },
        maxPrice: { $max: "$variants.price" },
        stock: { $sum: "$variants.stock" },
      },
    },

    // Build priceRange: single value if min === max, otherwise { min, max }
    {
      $addFields: {
        priceRange: {
          $cond: {
            if: { $eq: ["$minPrice", "$maxPrice"] },
            then: "$minPrice",
            else: { min: "$minPrice", max: "$maxPrice" },
          },
        },
      },
    },

    // Apply price filter if provided
    ...(Object.keys(priceMatchConditions).length > 0 ? [{ $match: priceMatchConditions }] : []),

    // Lookup refs — must happen before slug-based matching
    { $lookup: { from: "subcategories", localField: "subCategoryId", foreignField: "_id", as: "subCategoryId" } },
    { $unwind: { path: "$subCategoryId", preserveNullAndEmptyArrays: false } },
    { $lookup: { from: "categories", localField: "categoryId", foreignField: "_id", as: "categoryId" } },
    { $unwind: { path: "$categoryId", preserveNullAndEmptyArrays: false } },
    { $lookup: { from: "brands", localField: "brandId", foreignField: "_id", as: "brandId" } },
    { $unwind: { path: "$brandId", preserveNullAndEmptyArrays: false } },

    // Apply slug-based ref filters if provided
    ...(Object.keys(refMatchStage).length > 0 ? [{ $match: refMatchStage }] : []),

    { $sort: sortStage as Record<string, 1 | -1> },

    // Project only desired fields
    {
      $project: {
        _id: 1,
        title: 1,
        slug: 1,
        featuredImage: 1,
        productCode: 1,
        isActive: 1,
        isFeatured: 1,
        createdAt: 1,
        updatedAt: 1,
        priceRange: 1,
        stock: 1,
        variants: 1,
        subCategoryId: { _id: "$subCategoryId._id", title: "$subCategoryId.title", slug: "$subCategoryId.slug" },
        categoryId: { _id: "$categoryId._id", title: "$categoryId.title", slug: "$categoryId.slug" },
        brandId: { _id: "$brandId._id", title: "$brandId.title", slug: "$brandId.slug" },
      },
    },
  ];

  // Count total before pagination
  const countPipeline = [...pipeline, { $count: "total" }];
  const countResult = await Product.aggregate(countPipeline);
  const total = countResult[0]?.total ?? 0;

  const products = await Product.aggregate([...pipeline, { $skip: skip }, { $limit: limit }]);

  const meta: IMeta = {
    page,
    limit,
    skip,
    total,
  };

  return { products, meta };
};

const getFeaturedProducts = async () => {
  const pipeline = [
    { $match: { isDeleted: false, isActive: true, isFeatured: true } },
    { $sort: { createdAt: -1 } },
    { $lookup: { from: "categories", localField: "categoryId", foreignField: "_id", as: "categoryId" } },
    { $unwind: { path: "$categoryId", preserveNullAndEmptyArrays: false } },
    { $lookup: { from: "subcategories", localField: "subCategoryId", foreignField: "_id", as: "subCategoryId" } },
    { $unwind: { path: "$subCategoryId", preserveNullAndEmptyArrays: false } },
    { $lookup: { from: "brands", localField: "brandId", foreignField: "_id", as: "brandId" } },
    { $unwind: { path: "$brandId", preserveNullAndEmptyArrays: false } },
    {
      $project: {
        _id: 1,
        title: 1,
        slug: 1,
        badges: 1,
        category: { _id: "$categoryId._id", title: "$categoryId.title", slug: "$categoryId.slug" },
        subCategory: { _id: "$subCategoryId._id", title: "$subCategoryId.title", slug: "$subCategoryId.slug" },
        brand: { _id: "$brandId._id", title: "$brandId.title", slug: "$brandId.slug" },
        featuredVariant: {
          $let: {
            vars: {
              featuredVals: {
                $filter: {
                  input: "$variants",
                  as: "variant",
                  cond: { $eq: ["$$variant.featured", true] },
                },
              },
            },
            in: {
              $cond: {
                if: { $gt: [{ $size: "$$featuredVals" }, 0] },
                then: { $arrayElemAt: ["$$featuredVals", 0] },
                else: { $arrayElemAt: ["$variants", 0] },
              },
            },
          },
        },
      },
    },
  ];

  const products = await Product.aggregate(pipeline as PipelineStage[]);
  return products;
};

interface SearchProductsOptions {
  page?: number;
  limit?: number;
  minPrice?: number;
  maxPrice?: number;
  availability?: "inStock" | "outOfStock";
  brandSlug?: string;
  sortBy?: "relevance" | "priceAsc" | "priceDesc" | "newest";
}

interface GetPublicProductsOptions {
  page?: number;
  limit?: number;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  availability?: "inStock" | "outOfStock";
  brandSlug?: string;
  categorySlug?: string;
  subCategorySlug?: string;
  sortBy?: "newest" | "priceAsc" | "priceDesc" | "popularity";
}

const searchProducts = async (searchQuery: string, options: SearchProductsOptions = {}) => {
  const { page = 1, limit = 20, minPrice, maxPrice, availability, brandSlug, sortBy = "relevance" } = options;
  const skip = (page - 1) * limit;

  // Build a fuzzy regex
  const tokens = searchQuery
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));

  const fuzzyPattern = (token: string) => token.split("").join("\\w*?");
  const combinedPattern = tokens.length > 0 ? tokens.map((t) => `(?=.*${fuzzyPattern(t)})`).join("") : searchQuery;
  const regex = new RegExp(combinedPattern, "i");

  // Sort stage based on sortBy param
  const sortStageMap: Record<string, Record<string, 1 | -1>> = {
    priceAsc: { minPrice: 1 },
    priceDesc: { minPrice: -1 },
    newest: { createdAt: -1 },
    relevance: { createdAt: -1 },
  };
  const sortStage = sortStageMap[sortBy] ?? { createdAt: -1 };

  // Availability filter mapped to variant statuses
  const availabilityMatch: Record<string, unknown> = {};
  if (availability === "inStock") {
    availabilityMatch["stock"] = { $gt: 0 };
  } else if (availability === "outOfStock") {
    availabilityMatch["stock"] = { $lte: 0 };
  }

  const basePipeline: PipelineStage[] = [
    {
      $match: {
        isDeleted: false,
        isActive: true,
        $or: [{ title: regex }, { slug: regex }, { productCode: regex }],
      },
    },

    // Compute priceRange and stock from variants
    {
      $addFields: {
        minPrice: { $min: "$variants.price" },
        maxPrice: { $max: "$variants.price" },
        stock: { $sum: "$variants.stock" },
      },
    },
    {
      $addFields: {
        priceRange: {
          $cond: {
            if: { $eq: ["$minPrice", "$maxPrice"] },
            then: "$minPrice",
            else: { min: "$minPrice", max: "$maxPrice" },
          },
        },
      },
    },

    // Apply price filters if provided
    ...(minPrice !== undefined || maxPrice !== undefined
      ? [
          {
            $match: {
              ...(minPrice !== undefined ? { minPrice: { $gte: minPrice } } : {}),
              ...(maxPrice !== undefined ? { maxPrice: { $lte: maxPrice } } : {}),
            } as Record<string, unknown>,
          },
        ]
      : []),

    // Apply availability filter
    ...(Object.keys(availabilityMatch).length > 0 ? [{ $match: availabilityMatch as Record<string, unknown> }] : []),

    // Populate brand
    { $lookup: { from: "brands", localField: "brandId", foreignField: "_id", as: "brandId" } },
    { $unwind: { path: "$brandId", preserveNullAndEmptyArrays: true } },

    // Apply brand filter if provided
    ...(brandSlug ? [{ $match: { "brandId.slug": brandSlug } as Record<string, unknown> }] : []),

    // Populate subCategory
    { $lookup: { from: "subcategories", localField: "subCategoryId", foreignField: "_id", as: "subCategoryId" } },
    { $unwind: { path: "$subCategoryId", preserveNullAndEmptyArrays: true } },

    { $sort: sortStage as Record<string, 1 | -1> },

    {
      $project: {
        _id: 1,
        title: 1,
        slug: 1,
        featuredImage: 1,
        badges: 1,
        priceRange: 1,
        minPrice: 1,
        stock: 1,
        subCategoryId: { _id: "$subCategoryId._id", title: "$subCategoryId.title", slug: "$subCategoryId.slug" },
        brandId: { _id: "$brandId._id", title: "$brandId.title", slug: "$brandId.slug" },
        // Pick variant flagged as featured, else first variant
        featuredVariant: {
          $let: {
            vars: {
              featuredVals: {
                $filter: { input: "$variants", as: "v", cond: { $eq: ["$$v.featured", true] } },
              },
            },
            in: {
              $cond: {
                if: { $gt: [{ $size: "$$featuredVals" }, 0] },
                then: { $arrayElemAt: ["$$featuredVals", 0] },
                else: { $arrayElemAt: ["$variants", 0] },
              },
            },
          },
        },
      },
    },
  ];

  // Count total matching documents
  const countPipeline = [...basePipeline, { $count: "total" }];
  const countResult = await Product.aggregate(countPipeline);
  const total = countResult[0]?.total ?? 0;

  // Paginated results
  const products = await Product.aggregate([...basePipeline, { $skip: skip }, { $limit: limit }]);

  // Distinct brands from the full matched set (for sidebar filter)
  const brandsPipeline: PipelineStage[] = [
    ...basePipeline,
    { $group: { _id: "$brandId._id", title: { $first: "$brandId.title" }, slug: { $first: "$brandId.slug" } } },
    { $sort: { title: 1 } },
    { $project: { _id: 1, title: 1, slug: 1 } },
  ];
  const brands = await Product.aggregate(brandsPipeline);

  const meta: IMeta = { page, limit, skip, total };

  return { products, meta, brands };
};

const getPublicProducts = async (options: GetPublicProductsOptions = {}) => {
  const {
    page = 1,
    limit = 20,
    search,
    minPrice,
    maxPrice,
    availability,
    brandSlug,
    categorySlug,
    subCategorySlug,
    sortBy = "newest",
  } = options;
  const skip = (page - 1) * limit;

  const matchStage: Record<string, unknown> = { isDeleted: false, isActive: true };

  if (search && search.trim().length >= 2) {
    const tokens = search
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
    const fuzzyPattern = (token: string) => token.split("").join("\\w*?");
    const combinedPattern =
      tokens.length > 0 ? tokens.map((t) => `(?=.*${fuzzyPattern(t)})`).join("") : search;
    const regex = new RegExp(combinedPattern, "i");
    matchStage.$or = [{ title: regex }, { slug: regex }, { productCode: regex }];
  }

  const sortStageMap: Record<string, Record<string, 1 | -1>> = {
    priceAsc: { minPrice: 1 },
    priceDesc: { minPrice: -1 },
    newest: { createdAt: -1 },
    popularity: { createdAt: -1 },
  };
  const sortStage = sortStageMap[sortBy] ?? { createdAt: -1 };

  const availabilityMatch: Record<string, unknown> = {};
  if (availability === "inStock") availabilityMatch["stock"] = { $gt: 0 };
  else if (availability === "outOfStock") availabilityMatch["stock"] = { $lte: 0 };

  const basePipeline: PipelineStage[] = [
    { $match: matchStage },
    {
      $addFields: {
        minPrice: { $min: "$variants.price" },
        maxPrice: { $max: "$variants.price" },
        stock: { $sum: "$variants.stock" },
      },
    },
    {
      $addFields: {
        priceRange: {
          $cond: {
            if: { $eq: ["$minPrice", "$maxPrice"] },
            then: "$minPrice",
            else: { min: "$minPrice", max: "$maxPrice" },
          },
        },
      },
    },
    ...(minPrice !== undefined || maxPrice !== undefined
      ? [
          {
            $match: {
              ...(minPrice !== undefined ? { minPrice: { $gte: minPrice } } : {}),
              ...(maxPrice !== undefined ? { maxPrice: { $lte: maxPrice } } : {}),
            } as Record<string, unknown>,
          },
        ]
      : []),
    ...(Object.keys(availabilityMatch).length > 0
      ? [{ $match: availabilityMatch as Record<string, unknown> }]
      : []),
    // Brand lookup + optional filter
    { $lookup: { from: "brands", localField: "brandId", foreignField: "_id", as: "brandId" } },
    { $unwind: { path: "$brandId", preserveNullAndEmptyArrays: true } },
    ...(brandSlug ? [{ $match: { "brandId.slug": brandSlug } as Record<string, unknown> }] : []),
    // Category lookup + optional filter
    { $lookup: { from: "categories", localField: "categoryId", foreignField: "_id", as: "categoryId" } },
    { $unwind: { path: "$categoryId", preserveNullAndEmptyArrays: true } },
    ...(categorySlug
      ? [{ $match: { "categoryId.slug": categorySlug } as Record<string, unknown> }]
      : []),
    // SubCategory lookup + optional filter
    {
      $lookup: {
        from: "subcategories",
        localField: "subCategoryId",
        foreignField: "_id",
        as: "subCategoryId",
      },
    },
    { $unwind: { path: "$subCategoryId", preserveNullAndEmptyArrays: true } },
    ...(subCategorySlug
      ? [{ $match: { "subCategoryId.slug": subCategorySlug } as Record<string, unknown> }]
      : []),
    { $sort: sortStage as Record<string, 1 | -1> },
    {
      $project: {
        _id: 1,
        title: 1,
        slug: 1,
        featuredImage: 1,
        badges: 1,
        priceRange: 1,
        minPrice: 1,
        stock: 1,
        categoryId: { _id: "$categoryId._id", title: "$categoryId.title", slug: "$categoryId.slug" },
        subCategoryId: {
          _id: "$subCategoryId._id",
          title: "$subCategoryId.title",
          slug: "$subCategoryId.slug",
        },
        brandId: { _id: "$brandId._id", title: "$brandId.title", slug: "$brandId.slug" },
        featuredVariant: {
          $let: {
            vars: {
              featuredVals: {
                $filter: { input: "$variants", as: "v", cond: { $eq: ["$$v.featured", true] } },
              },
            },
            in: {
              $cond: {
                if: { $gt: [{ $size: "$$featuredVals" }, 0] },
                then: { $arrayElemAt: ["$$featuredVals", 0] },
                else: { $arrayElemAt: ["$variants", 0] },
              },
            },
          },
        },
      },
    },
  ];

  const countPipeline = [...basePipeline, { $count: "total" }];
  const countResult = await Product.aggregate(countPipeline);
  const total = countResult[0]?.total ?? 0;

  const products = await Product.aggregate([...basePipeline, { $skip: skip }, { $limit: limit }]);

  // Distinct brands for the sidebar (from full matched set)
  const brandsPipeline: PipelineStage[] = [
    ...basePipeline,
    {
      $group: {
        _id: "$brandId._id",
        title: { $first: "$brandId.title" },
        slug: { $first: "$brandId.slug" },
      },
    },
    { $sort: { title: 1 } },
    { $project: { _id: 1, title: 1, slug: 1 } },
  ];
  const brands = await Product.aggregate(brandsPipeline);

  // Distinct categories for the sidebar
  const categoriesPipeline: PipelineStage[] = [
    ...basePipeline,
    {
      $group: {
        _id: "$categoryId._id",
        title: { $first: "$categoryId.title" },
        slug: { $first: "$categoryId.slug" },
      },
    },
    { $sort: { title: 1 } },
    { $project: { _id: 1, title: 1, slug: 1 } },
  ];
  const categories = await Product.aggregate(categoriesPipeline);

  const meta: IMeta = { page, limit, skip, total };
  return { products, meta, brands, categories };
};

export const ProductServices = {
  createProduct,
  getAllProducts,
  getProductsAdmin,
  getProductById,
  getProductBySlug,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  searchProducts,
  getPublicProducts,
};
