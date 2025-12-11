import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    name: String,
    image: String,
    price: Number,
    quantity: Number,
});

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    items: [orderItemSchema],
    total: { type: Number, required: true },
    payment_method: { type: String, default: "qr_manual" },
    payment_status: { type: String, default: "pending" },
    transaction_id: { type: String, default: null }, // UTR / reference
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);
