import { z } from "zod";

const heroFixedItemSchema = z.object({
  id: z.string(),
  image: z.string(),
  link: z.string(),
});

const heroCarouselItemSchema = z.object({
  id: z.string(),
  image: z.string(),
  button: z.string(),
  buttonLink: z.string(),
});

export const updateHeaderConfigValidation = z.object({
  header: z.object({
    navLinks: z.array(z.string()),
  }),
});

export const updateHeroConfigValidation = z.object({
  hero: z.object({
    heroType: z.enum(["fixed", "carousel"]).optional(),
    fixedContent: z.array(heroFixedItemSchema).max(3).optional(),
    carouselContent: z.array(heroCarouselItemSchema).optional(),
  }),
});

export const updateConfigValidation = z.object({
  header: z
    .object({
      navLinks: z.array(z.string()),
    })
    .optional(),
  hero: z
    .object({
      heroType: z.enum(["fixed", "carousel"]).optional(),
      fixedContent: z.array(heroFixedItemSchema).max(3).optional(),
      carouselContent: z.array(heroCarouselItemSchema).optional(),
    })
    .optional(),
});
