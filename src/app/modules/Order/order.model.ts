import { model, Schema } from "mongoose";
import { IBillingDetails, ICouponSnapshot, IOrder, IOrderItem, OrderStatus, PaymentStatus } from "./order.interface";

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

// ── Counter for orderNumber ──────────────────────────────────────────────────

const orderCounterSchema = new Schema(
  {
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 },
  },
  { versionKey: false },
);

const OrderCounter = model("OrderCounter", orderCounterSchema);

const getNextOrderNumber = async (): Promise<string> => {
  const today = new Date();
  const dateStr = today.toISOString().slice(0, 10).replace(/-/g, ""); // YYYYMMDD
  const counterId = `order-${dateStr}`;

  const counter = await OrderCounter.findByIdAndUpdate(counterId, { $inc: { seq: 1 } }, { upsert: true, new: true });

  const seq = String(counter.seq).padStart(4, "0");
  return `SG-${dateStr}-${seq}`;
};

// ── Order schema ─────────────────────────────────────────────────────────────

const orderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: String, unique: true },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    billingDetails: { type: billingDetailsSchema, required: true },
    items: { type: [orderItemSchema], required: true },
    subtotal: { type: Number, required: true },
    shippingMethod: { type: String, required: true },
    shippingCost: { type: Number, required: true },
    coupon: { type: couponSnapshotSchema },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true },
    paymentMethod: { type: String, enum: ["cod", "online"], required: true },
    paymentStatus: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.UNPAID,
    },
    orderStatus: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.PENDING,
    },
    orderNotes: { type: String },
  },
  { timestamps: true, versionKey: false },
);

orderSchema.pre("save", async function () {
  if (!this.orderNumber) {
    this.orderNumber = await getNextOrderNumber();
  }
});

export const Order = model<IOrder>("Order", orderSchema);
