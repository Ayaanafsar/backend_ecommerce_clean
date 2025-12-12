import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    quantity: { type: Number, default: 1 }
}, { timestamps: true });

export default mongoose.model("CartItem", cartItemSchema);
