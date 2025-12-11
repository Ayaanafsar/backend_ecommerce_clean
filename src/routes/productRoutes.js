import express from "express";
import multer from "multer";
import {
    getProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct,
} from "../controllers/productController.js";
import { auth, adminOnly } from "../middleware/auth.js";

const upload = multer({ dest: "/tmp/uploads" });
const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/add", auth, adminOnly, upload.single("image"), addProduct);
router.put("/:id", auth, adminOnly, upload.single("image"), updateProduct);
router.delete("/:id", auth, adminOnly, deleteProduct);

export default router;
