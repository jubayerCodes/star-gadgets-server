import { z } from "zod";

export const updateHeaderConfigValidation = z.object({
  header: z.object({
    navLinks: z.array(z.string()),
  }),
});

export const updateConfigValidation = z.object({
  header: z.object({
    navLinks: z.array(z.string()),
  }),
});
