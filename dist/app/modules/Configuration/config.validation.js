"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateConfigValidation = exports.updateHeroConfigValidation = exports.updateHeaderConfigValidation = void 0;
const zod_1 = require("zod");
const heroFixedItemSchema = zod_1.z.object({
    id: zod_1.z.string(),
    image: zod_1.z.string(),
    link: zod_1.z.string(),
});
const heroCarouselItemSchema = zod_1.z.object({
    id: zod_1.z.string(),
    image: zod_1.z.string(),
    button: zod_1.z.string(),
    buttonLink: zod_1.z.string(),
});
exports.updateHeaderConfigValidation = zod_1.z.object({
    header: zod_1.z.object({
        navLinks: zod_1.z.array(zod_1.z.string()),
    }),
});
exports.updateHeroConfigValidation = zod_1.z.object({
    hero: zod_1.z.object({
        heroType: zod_1.z.enum(["fixed", "carousel"]).optional(),
        fixedContent: zod_1.z.array(heroFixedItemSchema).max(3).optional(),
        carouselContent: zod_1.z.array(heroCarouselItemSchema).optional(),
    }),
});
exports.updateConfigValidation = zod_1.z.object({
    header: zod_1.z
        .object({
        navLinks: zod_1.z.array(zod_1.z.string()),
    })
        .optional(),
    hero: zod_1.z
        .object({
        heroType: zod_1.z.enum(["fixed", "carousel"]).optional(),
        fixedContent: zod_1.z.array(heroFixedItemSchema).max(3).optional(),
        carouselContent: zod_1.z.array(heroCarouselItemSchema).optional(),
    })
        .optional(),
});
