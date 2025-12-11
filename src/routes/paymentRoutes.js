import express from "express";
import { createStripePaymentIntent } from "../controllers/paymentController.js";

const router = express.Router();

router.post("/stripe/create-payment-intent", createStripePaymentIntent);

// (Razorpay or other providers can be added if you want)

export default router;
