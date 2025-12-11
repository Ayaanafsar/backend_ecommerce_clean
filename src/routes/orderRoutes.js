import express from "express";
import { createOrder, getOrderById, getOrders, updateOrderStatus } from "../controllers/orderController.js";
import { auth, adminOnly } from "../middleware/auth.js";

const router = express.Router();

router.post("/", auth, createOrder);
router.get("/", auth, getOrders);
router.get("/:id", auth, getOrderById);
router.put("/:id/status", auth, adminOnly, updateOrderStatus);

export default router;
