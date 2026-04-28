import { model, Schema } from "mongoose";
import { IBillingDetails, ICouponSnapshot, IOrder, IOrderItem, IShippingDetails, OrderStatus } from "./order.interface";

// ── Sub-schemas ──────────────────────────────────────────────────────────────

const billingDetailsSchema = new Schema<IBillingDetails>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    streetAddress: { type: String, required: true },
    city: { type: String, required: true },
    district: { type: String, required: true },
    postcode: { type: String },
    phone: { type: String, required: true },
  },
  { _id: false },
);

const shippingDetailsSchema = new Schema<IShippingDetails>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String },
    streetAddress: { type: String, required: true },
    city: { type: String, required: true },
    district: { type: String, required: true },
    postcode: { type: String },
    phone: { type: String, required: true },
  },
  { _id: false },
);

const orderItemSchema = new Schema<IOrderItem>(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    variantId: { type: Schema.Types.ObjectId, required: true },
    title: { type: String, required: true },
    image: { type: String, required: true },
    attributes: [{ name: String, value: String }],
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    subtotal: { type: Number, required: true },
  },
  { _id: false },
);

const couponSnapshotSchema = new Schema<ICouponSnapshot>(
  {
    couponId: { type: Schema.Types.ObjectId, ref: "Coupon", required: true },
    code: { type: String, required: true },
    discountAmount: { type: Number, required: true },
  },
  { _id: false },
);

// ── Order number generator ───────────────────────────────────────────────────

const getNextOrderNumber = (): string => {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, ""); // YYYYMMDD
  const rand = String(Math.floor(Math.random() * 1000000)).padStart(6, "0");
  return `SG-${dateStr}-${rand}`;
};

// ── Order schema ─────────────────────────────────────────────────────────────

const orderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: String, unique: true },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    billingDetails: { type: billingDetailsSchema, required: true },
    /** Stored only when customer ships to a different address */
    shippingDetails: { type: shippingDetailsSchema },
    items: { type: [orderItemSchema], required: true },
    subtotal: { type: Number, required: true },
    shippingMethod: { type: String, required: true },
    shippingCost: { type: Number, required: true },
    coupon: { type: couponSnapshotSchema },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true },
    /** Reference to the linked Payment document */
    paymentId: { type: Schema.Types.ObjectId, ref: "Payment" },
    orderStatus: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.PENDING,
    },
    orderNotes: { type: String },
  },
  { timestamps: true, versionKey: false },
);

orderSchema.pre("save", function () {
  if (!this.orderNumber) {
    this.orderNumber = getNextOrderNumber();
  }
});

export const Order = model<IOrder>("Order", orderSchema);
