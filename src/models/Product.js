import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String },
    price: { type: Number, required: true },
    category: { type: String },
    image: { type: String, required: false }, // cloudinary URL
    stock: { type: Number, default: 0 },

    highlights: { type: [String], default: [] },

    rating: { type: Number, default: 4.2 },

    reviews: {
        type: [
            {
                user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
                comment: String,
                rating: Number
            }
        ],
        default: []
    },

}, { timestamps: true });

export default mongoose.model("Product", productSchema);
