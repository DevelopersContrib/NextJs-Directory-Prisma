"use client";
import React, { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import CardSection from "@/components/checkout/CardSection";
import { FaCircleNotch } from "react-icons/fa6";
import { PackagesProps } from "@/types/packages";
import { useRouter } from "next/navigation";

async function stripeTokenHandler(
  token: any,
  pack_price: string,
  userId: string
) {
  const paymentData = {
    token: token.id,
    pack_price,
    userId,
  };

  const res = await fetch("/api/charge", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(paymentData),
  });

  return await res.json();
}

interface Pack {
  pack: PackagesProps;
  userId: string;
}

const CheckoutForm: React.FC<Pack> = ({ pack, userId }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      return;
    }

    const card = elements.getElement(CardElement);
    if (card) {
      const result = await stripe.createToken(card);

      if (result.error) {
        setError(result.error.message || "An error occurred");
        return;
      }

      setLoading(true);

      const res = await stripeTokenHandler(
        result.token,
        pack.price.toString(),
        userId
      );

      if (res.id) {
        // Redirect to dashboard
        router.push("/dashboard");
      } else {
        setError("Payment failed. Please try again.");
      }

      setLoading(false);
    }
  };

  return (
    <div className="max-w-full xl:max-w-[50%] mx-auto flex w-full flex-col space-y-10">
      {error && (
        <div className="flex w-full border-l-6 border-red-500 bg-red-50 px-7 py-8 shadow-md md:p-9">
          <div className="mr-5 flex h-9 w-full max-w-[36px] items-center justify-center rounded-lg bg-red-500">
            {/* Error Icon */}
          </div>
          <div className="w-full">
            <h5 className="mb-3 text-lg font-bold text-black">Payment Error</h5>
            <p className="text-base leading-relaxed text-body">{error}</p>
          </div>
        </div>
      )}
      {!error && (
        <>
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Order Summary
              </h3>
            </div>
            <div className="p-4 md:p-6 xl:p-9">
              <h3 className="text-black dark:text-white font-bold text-3xl xl:text-title-xxl mb-0">
                ${pack.price}
              </h3>
              <h4 className="text-black dark:text-white font-medium text-2xl mb-2.5">
                {pack.name}
              </h4>
            </div>
          </div>
          <div className="rounded-sm border border-stroke py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark p-4">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <CardSection />
              </div>
              <button
                className="inline-flex w-full items-center justify-center rounded-md bg-primary py-3 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
                disabled={!stripe || loading}
              >
                {loading ? <FaCircleNotch className="fa-spin mr-2" /> : "Pay"}
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default CheckoutForm;
