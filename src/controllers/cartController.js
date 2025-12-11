import CartItem from "../models/CartItem.js";
import Product from "../models/Product.js";

/**
 * GET /api/cart
 */
export const getCart = async (req, res) => {
    try {
        const items = await CartItem.find({ user: req.userId }).populate("product");
        res.json(items);
    } catch (err) {
        console.error("Get cart error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

/**
 * POST /api/cart/add
 * body: { productId, quantity }
 */
export const addToCart = async (req, res) => {
    try {
        const { productId, quantity = 1 } = req.body;

        const existing = await CartItem.findOne({ user: req.userId, product: productId });
        if (existing) {
            existing.quantity += Number(quantity);
            await existing.save();
            return res.json({ message: "Updated quantity", item: existing });
        }

        const item = await CartItem.create({ user: req.userId, product: productId, quantity });
        res.json({ message: "Added to cart", item });
    } catch (err) {
        console.error("Add to cart error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

/**
 * PUT /api/cart/:id   -> update cart item (by cartItem id)
 * body { quantity }
 */
export const updateCartItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { quantity } = req.body;

        const item = await CartItem.findOneAndUpdate({ _id: id, user: req.userId }, { quantity }, { new: true });
        res.json({ message: "Updated", item });
    } catch (err) {
        console.error("Update cart item error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

/**
 * DELETE /api/cart/:id
 */
export const removeCartItem = async (req, res) => {
    try {
        const { id } = req.params;
        await CartItem.deleteOne({ _id: id, user: req.userId });
        res.json({ message: "Removed" });
    } catch (err) {
        console.error("Remove cart item error:", err);
        res.status(500).json({ message: "Server error" });
    }
};
