import dotenv from "dotenv";
dotenv.config();

import Stripe from "stripe";
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

export const createStripePaymentIntent = async (req, res) => {
    try {
        if (!stripe) return res.status(400).json({ message: "Stripe not configured" });

        const { amount = 0, currency = "inr" } = req.body;
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100),
            currency,
            automatic_payment_methods: { enabled: true }
        });

        res.json({ clientSecret: paymentIntent.client_secret });
    } catch (err) {
        console.error("Stripe error:", err);
        res.status(500).json({ message: "Stripe error" });
    }
};
