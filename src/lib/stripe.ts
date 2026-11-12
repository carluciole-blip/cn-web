import Stripe from "stripe";
import { exiger } from "./env";

export function stripe(): Stripe {
  return new Stripe(exiger("STRIPE_SECRET_KEY"));
}
