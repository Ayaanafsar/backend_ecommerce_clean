import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    category: { type: String, index: true },
    image: String,
    stock: { type: Number, default: 0 },
    highlights: { type: [String], default: [] },
    rating: { type: Number, default: 4.2 },
    reviews: {
        type: [
            {
                user: String,
                rating: Number,
                text: String,
                createdAt: { type: Date, default: Date.now },
            },
        ],
        default: [],
    },
}, { timestamps: true });

export default mongoose.model("Product", productSchema);
