"use client"; // Ensures this is a client-side component

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import PaymentForm from "../(components)/PaymentForm";

const stripePromise = loadStripe(
  "pk_test_51QRbONKxT0X2aYGpgA8ii8n8H5aCAfUy50SrEiroQmFMMG8892k0EbE2wy8oNM7xvZvSBnF6dnQD8enTxGfXds6T00qE1195Mh"
);

const PaymentPage = () => {
  const searchParams = useSearchParams();

  // Extract query parameters from the URL
  const userId = searchParams.get("userId");
  const username = searchParams.get("username");
  const bookedTrip = searchParams.get("bookedTrip");
  const noPeople = searchParams.get("noPeople");
  const price = parseFloat(searchParams.get("price") || "0.00");
  const bookingDate = searchParams.get("bookingDate");

  const [clientSecret, setClientSecret] = useState<string | null>(null);

  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const response = await axios.post(
          "http://localhost:8080/payment/create-payment-intent",
          {
            amount: Math.round(price * 100), // Stripe uses smallest currency unit
            currency: "usd",
          }
        );
        setClientSecret(response.data.clientSecret);
      } catch (error) {
        console.error("Error creating payment intent:", error);
      }
    };

    createPaymentIntent();
  }, [price]);

  if (!clientSecret) {
    return <p>Loading payment details...</p>;
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <PaymentForm price={price} />
    </Elements>
  );
};

export default PaymentPage;
