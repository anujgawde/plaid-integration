import axios from "axios";
import Router from "next/router";
import { useEffect, useState } from "react";

export default function Checkout({ isOpen, closeModal, price, emptyCart }) {
  const [paymentStatus, setPaymentStatus] = useState("unattempted");
  const [isLoading, setIsLoading] = useState("");
  const [transferAuth, setTransferAuth] = useState();
  const [transferCreate, setTransferCreate] = useState();

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");

    if (!accessToken) {
      Router.push("/");
    }
  }, []);

  const handlePay = async () => {
    setIsLoading(true);
    const accessToken = localStorage.getItem("access_token");
    const transferAuthorizationResponse = await axios.post(
      "/api/transfer-authorization",
      {
        accessToken,
        amount: ((price * 7) / 100 + price).toFixed(2).toString(),
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    setTransferAuth(transferAuthorizationResponse.data);
    if (
      transferAuthorizationResponse.data.transferAuthData.authorization
        .decision == "approved"
    ) {
      const transferCreateResponse = await axios.post(
        "/api/transfer-create",
        {
          accessToken,
          authorizationId:
            transferAuthorizationResponse.data.transferAuthData.authorization
              .id,
          accountId: transferAuthorizationResponse.data.accountId,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setTransferCreate(transferCreateResponse.data);
      setPaymentStatus("accepted");
      emptyCart();
    } else {
      setPaymentStatus("declined");
    }
    setIsLoading(false);
  };

  return (
    isOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 text-black">
        <div className="bg-white py-8 px-8 rounded-lg w-full max-w-2xl mx-2">
          {paymentStatus == "unattempted" ? (
            <div className="flex flex-col items-center space-y-4">
              <div className="flex items-center flex-col w-full">
                <h2 className="text-2xl font-semibold">Checkout</h2>

                {!isLoading ? (
                  <div className="w-full">
                    <div className="my-4 w-full">
                      <div className="flex justify-between w-full">
                        <p>Sub Total</p>
                        <p>{price.toFixed(2)}</p>
                      </div>
                      <div className="flex justify-between w-full">
                        <p>Taxes (7%)</p>
                        <p>{((price * 7) / 100).toFixed(2)}</p>
                      </div>
                      <hr className="my-2"></hr>
                      <div className="flex justify-between w-full">
                        <p>Total</p>
                        <p>{((price * 7) / 100 + price).toFixed(2)}</p>
                      </div>
                    </div>

                    <div className="flex justify-center items-center">
                      {price > 0 && (
                        <button
                          onClick={handlePay}
                          className="rounded-md bg-blue-500 text-white font-semibold px-8 py-2"
                        >
                          Pay Now
                        </button>
                      )}
                      <button
                        onClick={closeModal}
                        className="rounded-md bg-gray-5 text-black font-semibold px-8 py-2"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="w-10 h-10 border-4 my-10 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
                )}
              </div>
            </div>
          ) : paymentStatus == "declined" ? (
            <div className="space-y-2">
              {/* Image Section */}
              <div className="flex w-full justify-center items-center">
                <img src="/circle-x.svg" className="h-20 w-20" />
              </div>

              <p className="text-center text-xl ">
                {
                  transferAuth.transferAuthData.authorization.decision_rationale
                    .description
                }
              </p>
              <div className="flex justify-center items-center">
                <button
                  onClick={closeModal}
                  className="rounded-md bg-gray-5 text-white bg-red-500 font-semibold  px-8 py-2"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {/* Image Section */}
              <div className="flex w-full justify-center items-center flex-col">
                <img src="/circle-check.svg" className="h-20 w-20" />
                <p className="text-2xl">Payment Successful</p>
              </div>

              <div className="space-y-2 my-8">
                <div className="flex justify-between">
                  <p>Total (USD)</p>
                  <p>$ {transferCreate.transferCreateData.transfer.amount}</p>
                </div>
                <div className="flex justify-between">
                  <p>Bank</p>
                  <p>{transferAuth.institution.name}</p>
                </div>
                <div className="flex justify-between">
                  <p>Account</p>
                  <p>
                    {transferCreate.accounts[0].name} (xxxxx
                    {transferCreate.accounts[0].mask})
                  </p>
                </div>
                <div className="flex justify-between">
                  <p>Date</p>
                  <p>
                    {new Date(
                      transferCreate.transferCreateData.transfer.created
                    ).toLocaleString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p>Payment Reference ID</p>
                  <p>
                    {transferCreate.transferCreateData.transfer.id
                      .split("-")
                      .slice(-1)}
                  </p>
                </div>
              </div>

              <div className="flex justify-center items-center">
                <button
                  onClick={closeModal}
                  className="rounded-md bg-gray-5 border text-black border-emerald-900 font-semibold  px-8 py-2"
                >
                  Done!
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  );
}
