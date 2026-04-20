import { Router } from "express";
import { OrderController } from "./order.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createOrderValidation, updateOrderStatusValidation } from "./order.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { softAuth } from "../../middlewares/softAuth";
import { Role } from "../User/user.interface";

export const OrderRoutes = Router();

// Place a new order (guest or logged-in user)
OrderRoutes.post("/", softAuth, validateRequest(createOrderValidation), OrderController.createOrder);

// Admin: list all orders
OrderRoutes.get("/", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), OrderController.getAllOrders);

// Logged-in user: their own orders
OrderRoutes.get("/my", checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN), OrderController.getMyOrders);

// Single order detail (softAuth — admin or owner)
OrderRoutes.get("/:id", softAuth, OrderController.getOrderById);

// Admin: update order status
OrderRoutes.patch(
  "/:id/status",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(updateOrderStatusValidation),
  OrderController.updateOrderStatus,
);
