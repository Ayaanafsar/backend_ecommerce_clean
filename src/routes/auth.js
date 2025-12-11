import express from "express";
import db from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const hashed = await bcrypt.hash(password, 10);

        const [check] = await db.query("SELECT id FROM users WHERE email=?", [email]);
        if (check.length > 0) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const [result] = await db.query(
            "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
            [name, email, hashed]
        );

        res.json({ message: "Registered successfully", userId: result.insertId });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;
