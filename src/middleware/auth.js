import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const auth = (req, res, next) => {
    const header = req.headers.authorization;
    if (!header) return res.status(401).json({ message: "No token provided" });

    const parts = header.split(" ");
    if (parts.length !== 2) return res.status(401).json({ message: "Token error" });

    const token = parts[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        req.isAdmin = decoded.isAdmin || false;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
};

export const adminOnly = (req, res, next) => {
    if (!req.isAdmin) return res.status(403).json({ message: "Admin only" });
    next();
};
