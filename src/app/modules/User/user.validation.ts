import z from "zod";
import { Role } from "./user.interface";
import { PhoneNumberSchema } from "../../validations";

const addressSchema = z.object({
  fullName: z.string({ error: "Full name must be a string" }).min(2, { message: "Full name must be at least 2 characters." }),
  phone: PhoneNumberSchema,
  addressLine: z.string({ error: "Address line must be a string" }).min(3, { message: "Address line is required." }),
  city: z.string({ error: "City must be a string" }).min(1, { message: "City is required." }),
  district: z.string({ error: "District must be a string" }).min(1, { message: "District is required." }),
  country: z.string({ error: "Country must be a string" }).min(1, { message: "Country is required." }),
  zipCode: z.string().optional(),
});

export const createUserZodSchema = z.object({
  name: z
    .string({ error: "Name must be string" })
    .min(2, { message: "Name must be at least 2 characters long." })
    .max(50, { message: "Name cannot exceed 50 characters." }),
  email: z
    .email({ message: "Invalid email address format." })
    .min(5, { message: "Email must be at least 5 characters long." })
    .max(100, { message: "Email cannot exceed 100 characters." }),
  password: z
    .string({ error: "Password must be string" })
    .min(8, { message: "Password must be at least 8 characters long." })
    .regex(/^(?=.*[A-Z])/, {
      message: "Password must contain at least 1 uppercase letter.",
    })
    .regex(/^(?=.*[!@#$%^&*])/, {
      message: "Password must contain at least 1 special character.",
    })
    .regex(/^(?=.*\d)/, {
      message: "Password must contain at least 1 number.",
    }),
  phone: PhoneNumberSchema,
});

export const updateUserZodSchema = z.object({
  name: z
    .string({ error: "Name must be string" })
    .min(2, { message: "Name must be at least 2 characters long." })
    .max(50, { message: "Name cannot exceed 50 characters." })
    .optional(),
  role: z.enum(Object.values(Role) as [string]).optional(),
  isDeleted: z.boolean({ error: "isDeleted must be true or false" }).optional(),
  phone: PhoneNumberSchema.optional(),
  billingAddress: addressSchema.optional(),
  shippingAddress: addressSchema.optional(),
});
