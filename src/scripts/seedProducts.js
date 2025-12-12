import mongoose from "mongoose";
import Product from "../models/Product.js";
import dotenv from "dotenv";
dotenv.config();

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
            tls: true,
            retryWrites: true
        });

        console.log("MongoDB Connected (Seed Script)");
    } catch (err) {
        console.error("MongoDB Connection Error (Seed):", err);
        process.exit(1);
    }
}

async function seedProducts() {
    await connectDB();

    const sampleProducts = [
        {
            name: "Sample Product 1",
            description: "Test product",
            price: 999,
            category: "electronics",
            stock: 10,
            highlights: ["Test highlight"],
            reviews: []
        }
    ];

    try {
        await Product.deleteMany({});
        await Product.insertMany(sampleProducts);

        console.log("Products seeded successfully!");
        process.exit(0);
    } catch (error) {
        console.error("Seed Error:", error);
        process.exit(1);
    }
}

seedProducts();
