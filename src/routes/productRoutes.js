// src/routes/productRoutes.js
import express from "express";
import multer from "multer";
import fs from "fs";
import {
    getProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct,
} from "../controllers/productController.js";
import { auth, adminOnly } from "../middleware/auth.js";

const router = express.Router();

/**
 * 🔧 FIX MULTER DIRECTORY (IMPORTANT)
 * /tmp/uploads sometimes fails on Windows.
 * We ensure a local "uploads/" folder ALWAYS exists.
 */

const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // safe cross-platform path
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "_" + file.originalname);
    },
});

const upload = multer({ storage });

/**
 * PRODUCT ROUTES
 */
router.get("/", getProducts);
router.get("/:id", getProductById);

router.post("/add", auth, adminOnly, upload.single("image"), addProduct);

router.put("/:id", auth, adminOnly, upload.single("image"), updateProduct);

router.delete("/:id", auth, adminOnly, deleteProduct);

export default router;
