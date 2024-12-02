"use client";

import React, { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const PaymentForm = ({ price }: { price: number }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: "http://localhost:3000/payment/success", // Redirect after payment
      },
      redirect: "if_required",
    });

    if (error) {
      setPaymentStatus(error.message);
    } else if (paymentIntent) {
      setPaymentStatus(`Payment ${paymentIntent.status}`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button
        type="submit"
        className="mt-4 w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none"
        disabled={!stripe}
      >
        Pay ${price}
      </button>
      {paymentStatus && <p className="mt-4 text-red-500">{paymentStatus}</p>}
    </form>
  );
};

export default PaymentForm;
