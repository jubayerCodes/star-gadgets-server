import z from "zod";

export const PhoneNumberSchema = z
  .string({
    message: "Phone Number must be string",
  })
  .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
    message: "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
  })
  .transform((val) => {
    if (val.startsWith("+880")) {
      return val;
    }
    if (val.startsWith("01")) {
      return `+880${val.slice(1)}`;
    }
    return val;
  });
