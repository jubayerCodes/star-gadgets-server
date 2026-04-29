import { Router } from "express";
import { PaymentController } from "./payment.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { updatePaymentStatusValidation } from "./payment.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { softAuth } from "../../middlewares/softAuth";
import { Role } from "../User/user.interface";

export const PaymentRoutes = Router();

// Get payment linked to a specific order (admin or order owner via softAuth)
PaymentRoutes.get("/order/:orderId", softAuth, PaymentController.getPaymentByOrderId);

// Get payment by transactionId (public — transactionId is unguessable, used by payment status pages)
PaymentRoutes.get("/transaction/:transactionId", PaymentController.getPaymentByTransactionId);

// Get a single payment by its own ID (admin only)
PaymentRoutes.get("/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), PaymentController.getPaymentById);

// List all payments (admin only)
PaymentRoutes.get("/", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), PaymentController.getAllPayments);

PaymentRoutes.post("/success", PaymentController.paymentSuccess);
PaymentRoutes.post("/fail", PaymentController.paymentFail);
PaymentRoutes.post("/cancel", PaymentController.paymentCancel);

PaymentRoutes.post(
  "/initiate/:orderId",
  checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
  PaymentController.initiatePayment,
);

PaymentRoutes.post("/validate", PaymentController.validatePayment);

// Update payment status (admin only)
PaymentRoutes.patch(
  "/:id/status",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(updatePaymentStatusValidation),
  PaymentController.updatePaymentStatus,
);
