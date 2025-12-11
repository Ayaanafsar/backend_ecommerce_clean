import Product from "../models/Product.js";
import cloudinary from "../config/cloudinary.js";

/**
 * GET /api/products
 * Returns all products sorted newest first.
 * Optional query: ?category=mobiles (frontend can pass.)
 */
export const getProducts = async (req, res) => {
  try {
    const filter = {};
    if (req.query.category) filter.category = req.query.category.toLowerCase();

    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error("Get products error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    console.error("Get product by id error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const addProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;
    let imageUrl = req.body.image || null;

    // if file uploaded using multer (single file called 'image')
    if (req.file?.path) {
      const upload = await cloudinary.uploader.upload(req.file.path, { folder: "ecommerce_products" });
      imageUrl = upload.secure_url;
    }

    const product = await Product.create({
      name,
      description,
      price,
      category,
      image: imageUrl,
      stock: stock || 0,
      highlights: req.body.highlights ? JSON.parse(req.body.highlights) : [],
      reviews: [],
      rating: req.body.rating || 4.2,
    });

    res.json(product);
  } catch (err) {
    console.error("Add product error:", err);
    res.status(500).json({ message: "Server error adding product" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    if (req.file?.path) {
      const upload = await cloudinary.uploader.upload(req.file.path, { folder: "ecommerce_products" });
      updates.image = upload.secure_url;
    }

    // if highlights were sent as JSON string
    if (typeof updates.highlights === "string") {
      try { updates.highlights = JSON.parse(updates.highlights); } catch (e) { }
    }

    const product = await Product.findByIdAndUpdate(id, updates, { new: true });
    res.json(product);
  } catch (err) {
    console.error("Update product error:", err);
    res.status(500).json({ message: "Server error updating product" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.json({ message: "Product deleted" });
  } catch (err) {
    console.error("Delete product error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
