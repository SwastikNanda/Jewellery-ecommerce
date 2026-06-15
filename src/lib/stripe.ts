import Stripe from "stripe";

const key = process.env.STRIPE_SECRET_KEY;

// Lazily constructed so the app can build without a real key present.
export const stripe = new Stripe(key ?? "sk_test_placeholder", {
  typescript: true,
});

export function isStripeConfigured(): boolean {
  return Boolean(
    process.env.STRIPE_SECRET_KEY &&
      !process.env.STRIPE_SECRET_KEY.includes("placeholder"),
  );
}
