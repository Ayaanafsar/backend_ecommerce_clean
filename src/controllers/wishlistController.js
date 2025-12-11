import Wishlist from "../models/Wishlist.js";
import Product from "../models/Product.js";

/**
 * Toggle wishlist
 * POST /api/wishlist/toggle  body { productId }
 */
export const toggleWishlist = async (req, res) => {
    try {
        const { productId } = req.body;
        const existing = await Wishlist.findOne({ user: req.userId, product: productId });
        if (existing) {
            await existing.remove();
            return res.json({ message: "Removed", isWishlisted: false });
        }
        await Wishlist.create({ user: req.userId, product: productId });
        res.json({ message: "Added", isWishlisted: true });
    } catch (err) {
        console.error("Wishlist toggle error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

export const getWishlist = async (req, res) => {
    try {
        const rows = await Wishlist.find({ user: req.userId }).populate("product", "name price image");
        res.json(rows.map(r => r.product));
    } catch (err) {
        console.error("Wishlist get error:", err);
        res.status(500).json({ message: "Server error" });
    }
};
