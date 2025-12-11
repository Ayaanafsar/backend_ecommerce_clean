import express from "express";
import { toggleWishlist, getWishlist } from "../controllers/wishlistController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();
router.use(auth);

router.post("/toggle", toggleWishlist);
router.get("/", getWishlist);

export default router;
