"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { usePlaidLink } from "react-plaid-link";
import Router from "next/router";

export default function Home() {
  const steps = [
    {
      step: "Link bank account",
      description: `Use credentials provided: 
        username: user_good 
        password: pass_good 
        verification code: 123456.
      Note: When linking with First Platypus Bank, you can bypass entering any data as it is not checked by Plaid Link.`,
    },
    {
      step: "Go to the products page",
      description: "Once on the products page, add them to your cart.",
    },
    {
      step: "Review Cart and Check Out",
      description:
        "Click on the Cart at the top right corner after adding your products. This will open up a sliding panel with your cart details.",
    },
    {
      step: "Continue with payment",
      description: "To continue with payment, click 'Pay Now'.",
    },
    {
      step: "Payment success",
      description:
        "If the payment goes through, a success screen will load with all the details, and the cart will empty itself.",
    },
    {
      step: "Payment failure",
      description:
        "If the payment fails, an error screen will load. This is likely if you try to make a payment greater than the balance in your active account.",
    },
    {
      step: "Transfer Product Note",
      description:
        "Since we are using Plaid's Sandbox, no real transaction is made. Hence, the balance is not updated as well. When running in production environment, data is updated.",
    },
  ];

  const [linkToken, setLinkToken] = useState(null);
  const createLinkToken = async () => {
    const response = await axios.post("/api/create-link-token");
    setLinkToken(response.data.link_token);
  };
  useEffect(() => {
    createLinkToken();
  }, []);

  const onSuccess = async (publicToken) => {
    const exchangeResponse = await axios.post(
      "/api/exchange-public-token",
      { public_token: publicToken },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    localStorage.setItem("access_token", exchangeResponse.data.accessToken);
    const currentTime = new Date().getTime();
    localStorage.setItem("start_time", currentTime);
    Router.push("/products");
  };

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess,
  });

  return (
    <div className="max-h-screen overflow-y-auto w-full bg-gray-100 p-4 md:p-6 text-black">
      {/* Title */}

      <div className="flex justify-center w-full">
        <div className="w-full max-w-4xl">
          <div className="py-8 flex items-center">
            <p className="text-5xl font-thin">Transfer Payment Demo</p>
          </div>

          <div className="my-4 space-y-4">
            <button
              onClick={() => open()}
              disabled={!ready}
              className="rounded-md bg-blue-500 text-white font-semibold px-8 py-2"
            >
              Link Bank Account
            </button>
          </div>

          <div className="py-4 flex flex-col justify-center">
            <ul className="space-y-4">
              {steps.map((item, index) => (
                <li key={index} className="bg-white p-4 rounded-lg shadow-md">
                  <div className="flex items-center">
                    <span className="bg-blue-500 text-white w-8 h-8 flex items-center justify-center rounded-full font-semibold">
                      {index + 1}
                    </span>
                    <h3 className="text-lg font-semibold ml-4 text-blue-700">
                      {item.step}
                    </h3>
                  </div>
                  <p className="ml-12 mt-2 text-gray-600">{item.description}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
