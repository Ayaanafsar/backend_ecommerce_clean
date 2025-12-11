import express from "express";
import { getCart, addToCart, updateCartItem, removeCartItem } from "../controllers/cartController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();
router.use(auth);

router.get("/", getCart);
router.post("/add", addToCart);
router.put("/:id", updateCartItem);
router.delete("/:id", removeCartItem);

export default router;
