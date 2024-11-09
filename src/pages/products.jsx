import { useEffect, useState } from "react";
import Router from "next/router";
import Checkout from "../components/checkout";
import axios from "axios";

export default function Products() {
  const products = [
    { id: 1, name: "Notebook", price: 3.5 },
    { id: 2, name: "Ballpoint Pen Set", price: 2.75 },
    { id: 3, name: "Coffee Mug", price: 4.99 },
    { id: 4, name: "Mini Stapler", price: 6.25 },
    { id: 5, name: "USB Flash Drive", price: 9.5 },
    { id: 6, name: "Water Bottle", price: 7.0 },
    { id: 7, name: "Earphones", price: 8.99 },
    { id: 8, name: "Keychain", price: 1.5 },
    { id: 9, name: "Hand Sanitizer", price: 3.0 },
    { id: 10, name: "Sticky Note Pad", price: 2.25 },
  ];

  const [cart, setCart] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [price, setPrice] = useState(0);
  const openCheckout = () => {
    const totalPrice = cart.reduce(
      (accumulator, product) => accumulator + product.price,
      0
    );
    setPrice(totalPrice);
    setIsCheckoutOpen(true); // Show Checkout modal
  };

  const closeCheckout = () => {
    setIsCheckoutOpen(false); // Hide Checkout modal
  };

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  const removeFromCart = (itemIndex) => {
    const newCart = [...cart];
    newCart.splice(itemIndex, 1);
    setCart(newCart);
  };

  const getAccountBalance = async () => {
    const accessToken = localStorage.getItem("access_token");
    const accountBalanceResponse = await axios.post(
      "/api/get-balance",
      { accessToken },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log(accountBalanceResponse.data);
    setAccounts(accountBalanceResponse.data.accounts);
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    const startTime = localStorage.getItem("start_time");
    if (!accessToken) {
      Router.push("/");
    }

    if (typeof window !== "undefined" && localStorage.getItem("cart_items")) {
      const savedCart = JSON.parse(localStorage.getItem("cart_items"));
      setCart(savedCart || []); // Fallback to empty array if no cart data in localStorage
    }

    if (startTime) {
      const currentTime = new Date().getTime();
      const oneHour = 50 * 60 * 1000;

      // Check if an hour has passed since the stored time
      if (currentTime - startTime > oneHour) {
        // Redirect to another page if more than an hour has passed
        Router.push("/");
      }
    }
    getAccountBalance();
  }, []);
  return (
    <>
      <div className="min-h-screen bg-gray-100 p-6 text-black">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Products</h1>

          {/* Cart Button with Counter */}
          <button
            onClick={openCheckout}
            className="relative inline-flex items-center px-4 py-2 bg-blue-500 text-white font-semibold rounded-full hover:bg-blue-600"
          >
            Check Out
            <span className="ml-2 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {cart.length}
            </span>
          </button>
        </div>
        <div className="mb-8">
          <h2 className="text-2xl font-bold">Bank Accounts</h2>
          <div className="rounded-xl bg-white w-full p-6">
            {accounts.map((e, index) => (
              <div key={index} className="flex justify-between items-center">
                <div className="flex space-x-4 items-center">
                  <div className="font-semibold">
                    {e.name} (xxxxx {e.mask})
                  </div>
                  {index === 0 && (
                    <div className="bg-green-600 rounded-full px-4 text-xs py-1 text-white">
                      Active
                    </div>
                  )}
                </div>

                <p className="">$ {e.balances.available}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white p-4 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold">{product.name}</h2>
              <p className="text-gray-700">
                Price: ${product.price.toFixed(2)}
              </p>
              <button
                onClick={() => addToCart(product)}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>

        <div className="mt-8 p-4 bg-white rounded-lg shadow-md mx-40 ">
          <h2 className="text-2xl font-bold">Cart</h2>
          {cart.length > 0 ? (
            <ul className="mt-4 max-h-[200px] overflow-y-auto">
              {cart
                .map((item, index) => (
                  <div key={index}>
                    <li
                      key={index}
                      className="py-2 border-b flex justify-between"
                    >
                      <p>{item.name}</p>
                      <div className="flex space-x-2">
                        <p>: ${item.price.toFixed(2)}</p>
                        <span
                          onClick={() => removeFromCart(index)}
                          className="bg-red-500 rounded-full px-2 py-1 text-white text-xs m-0"
                        >
                          Remove
                        </span>
                      </div>
                    </li>
                  </div>
                ))
                .reverse()}
            </ul>
          ) : (
            <p className="mt-4 text-gray-700">Your cart is empty.</p>
          )}
        </div>
      </div>
      {isCheckoutOpen && (
        <Checkout
          isOpen={isCheckoutOpen}
          closeModal={closeCheckout}
          emptyCart={() => setCart([])}
          price={price}
        />
      )}
    </>
  );
}
