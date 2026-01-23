"use client";

import { Elements } from "@stripe/react-stripe-js";
import ModalCardPayment from "./ModalCardPayment";
import { loadStripe } from "@stripe/stripe-js";
import { zconfig } from "@/config/config";

// 1. Initialize stripePromise OUTSIDE the component
// Replace the string with your actual "Publishable key" from Stripe Dashboard
const stripePromise = loadStripe(
  // process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
  zconfig.stripe.pk
);

export default function ModalCardPaymentStripeElementsWrap() {
  return (
    <Elements stripe={stripePromise}>
      <ModalCardPayment />
    </Elements>
  );
}