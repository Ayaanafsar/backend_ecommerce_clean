// src/controllers/productController.js
import Product from "../models/Product.js";
import cloudinary from "../config/cloudinary.js";

/**
 * GET ALL PRODUCTS
 * Supports optional query: ?category=mobile
 */
export const getProducts = async (req, res) => {
  try {
    const filter = {};

    if (req.query.category) {
      filter.category = req.query.category.toLowerCase();
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });

    res.json(products);
  } catch (err) {
    console.error("❌ Get products error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * GET PRODUCT BY ID
 */
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid product id format" });
    }

    const product = await Product.findById(id);

    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json(product);
  } catch (err) {
    console.error("❌ Get product by id error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * ADD PRODUCT (Admin)
 * Supports Multipart Upload → Cloudinary
 */
export const addProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({ message: "Name, price & category are required" });
    }

    let imageUrl = req.body.image || null;

    // Upload file if provided
    if (req.file?.path) {
      const upload = await cloudinary.uploader.upload(req.file.path, {
        folder: "ecommerce_products",
      });
      imageUrl = upload.secure_url;
    }

    // Parse highlights safely (avoid crash)
    let highlights = [];
    if (req.body.highlights) {
      try {
        highlights = Array.isArray(req.body.highlights)
          ? req.body.highlights
          : JSON.parse(req.body.highlights);
      } catch {
        highlights = [];
      }
    }

    const newProduct = await Product.create({
      name,
      description: description || "",
      price: Number(price),
      category: category.toLowerCase(),
      image: imageUrl,
      stock: Number(stock) || 0,
      highlights,
      reviews: [],
      rating: Number(req.body.rating) || 4.2,
    });

    res.json(newProduct);
  } catch (err) {
    console.error("❌ Add product error:", err);
    res.status(500).json({ message: "Server error adding product" });
  }
};

/**
 * UPDATE PRODUCT (Admin)
 */
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid product id format" });
    }

    const updates = { ...req.body };

    // Fix category casing
    if (updates.category) {
      updates.category = updates.category.toLowerCase();
    }

    // Upload new image if given
    if (req.file?.path) {
      const upload = await cloudinary.uploader.upload(req.file.path, {
        folder: "ecommerce_products",
      });
      updates.image = upload.secure_url;
    }

    // Parse highlights safely
    if (typeof updates.highlights === "string") {
      try {
        updates.highlights = JSON.parse(updates.highlights);
      } catch {
        updates.highlights = [];
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updates, {
      new: true,
    });

    res.json(updatedProduct);
  } catch (err) {
    console.error("❌ Update product error:", err);
    res.status(500).json({ message: "Server error updating product" });
  }
};

/**
 * DELETE PRODUCT (Admin)
 */
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid product id format" });
    }

    await Product.findByIdAndDelete(id);

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error("❌ Delete product error:", err);
    res.status(500).json({ message: "Server error deleting product" });
  }
};
