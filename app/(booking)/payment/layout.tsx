"use client";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "../../globals.css";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

const geistSans = localFont({
  src: "../../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const stripePromise = loadStripe(
  "pk_test_51QRbONKxT0X2aYGpgA8ii8n8H5aCAfUy50SrEiroQmFMMG8892k0EbE2wy8oNM7xvZvSBnF6dnQD8enTxGfXds6T00qE1195Mh"
);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Elements stripe={stripePromise}>{children}</Elements>
      </body>
    </html>
  );
}
