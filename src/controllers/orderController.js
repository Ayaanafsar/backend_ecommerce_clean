import Order from "../models/Order.js";
import CartItem from "../models/CartItem.js";
import Product from "../models/Product.js";

/**
 * POST /api/orders
 * Request body:
 * {
 *   items: [{ product_id, quantity, price }] OR omit and use cart server-side
 *   total: number,
 *   transaction_id: "UTR" (optional)
 * }
 *
 * We'll create an order with payment_method 'qr_manual' and payment_status 'pending'
 */
export const createOrder = async (req, res) => {
    try {
        const { items, total, transaction_id } = req.body;

        // If items not provided, take from cart
        let orderItems = items;
        if (!orderItems || orderItems.length === 0) {
            const cart = await CartItem.find({ user: req.userId }).populate("product");
            if (!cart.length) return res.status(400).json({ message: "Cart empty" });
            orderItems = cart.map(ci => ({
                product: ci.product._id,
                name: ci.product.name,
                image: ci.product.image,
                price: ci.product.price,
                quantity: ci.quantity
            }));
        } else {
            // map simple format
            orderItems = orderItems.map(it => ({
                product: it.product_id,
                name: it.name || "",
                image: it.image || "",
                price: it.price,
                quantity: it.quantity
            }));
        }

        // create order
        const order = await Order.create({
            user: req.userId,
            items: orderItems,
            total,
            payment_method: "qr_manual",
            payment_status: "pending",
            transaction_id: transaction_id || null
        });

        // decrease product stock
        for (const it of order.items) {
            if (it.product) {
                await Product.findByIdAndUpdate(it.product, { $inc: { stock: -Math.max(0, it.quantity) } });
            }
        }

        // clear user's cart
        await CartItem.deleteMany({ user: req.userId });

        res.json({ message: "Order created", order });
    } catch (err) {
        console.error("Create order error:", err);
        res.status(500).json({ message: "Server error creating order" });
    }
};

/**
 * GET /api/orders  (admin: all, else user only)
 */
export const getOrders = async (req, res) => {
    try {
        if (req.isAdmin) {
            const rows = await Order.find().sort({ createdAt: -1 }).populate("user", "name email");
            return res.json(rows);
        }
        const rows = await Order.find({ user: req.userId }).sort({ createdAt: -1 });
        res.json(rows);
    } catch (err) {
        console.error("Get orders error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

/**
 * GET /api/orders/:id
 */
export const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.findById(id).populate("user", "name email");
        if (!order) return res.status(404).json({ message: "Order not found" });

        // only owner or admin
        if (!req.isAdmin && String(order.user._id) !== String(req.userId)) {
            return res.status(403).json({ message: "Forbidden" });
        }

        res.json(order);
    } catch (err) {
        console.error("Get order by id error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

/**
 * PUT /api/orders/:id/status    (admin only)
 * body: { payment_status: "paid" }
 */
export const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { payment_status } = req.body;
        const order = await Order.findByIdAndUpdate(id, { payment_status }, { new: true });
        res.json({ message: "Updated", order });
    } catch (err) {
        console.error("Update order status error:", err);
        res.status(500).json({ message: "Server error" });
    }
};
