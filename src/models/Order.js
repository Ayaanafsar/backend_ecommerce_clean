import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    total: { type: Number, required: true },

    payment_method: { type: String, default: "qr_manual" },
    payment_status: { type: String, default: "pending" },

    transaction_id: { type: String, default: null },

    items: [
        {
            product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true }
        }
    ]

}, { timestamps: true });

export default mongoose.model("Order", orderSchema);
