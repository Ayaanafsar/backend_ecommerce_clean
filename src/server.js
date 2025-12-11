import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import router from "./src/routes/index.js";
import { connectDB } from "./src/config/db.js";

dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" })); // allow JSON
app.use(express.urlencoded({ extended: true }));

// connect to MongoDB
connectDB().catch((err) => {
    console.error("Failed to connect to Mongo:", err);
    process.exit(1);
});

app.use("/api", router);

// health
app.get("/", (req, res) => res.send("Backend (Mongo) working"));

app.use((err, req, res, next) => {
    console.error("GLOBAL ERROR:", err);
    res.status(500).json({ message: "Server error" });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
