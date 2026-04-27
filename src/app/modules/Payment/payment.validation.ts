import { z } from "zod";
import { PaymentStatus } from "./payment.interface";

export const updatePaymentStatusValidation = z.object({
  status: z.enum(Object.values(PaymentStatus) as [string, ...string[]]),
});
