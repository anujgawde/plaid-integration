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
  const [isCartOpen, setIsCartOpen] = useState(false);

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

  const toggleCart = () => {
    if (!isCartOpen) {
      const totalPrice = cart.reduce(
        (accumulator, product) => accumulator + product.price,
        0
      );
      setPrice(totalPrice);
    }
    setIsCartOpen(!isCartOpen);
  };

  const removeFromCart = (itemIndex) => {
    const newCart = [...cart];
    newCart.splice(itemIndex, 1);

    const totalPrice = newCart.reduce(
      (accumulator, product) => accumulator + product.price,
      0
    );
    setPrice(totalPrice);
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
      <div className="min-h-screen bg-gray-100  text-black">
        <div className="flex justify-between items-center  p-4 md:p-6">
          <h1 className="text-3xl font-bold">Products</h1>

          <button
            onClick={toggleCart}
            className="bg-white flex items-center justify-center rounded-full p-2 relative"
          >
            <img src="/shopping-cart.svg" />
            <span className="-top-1 -right-2 absolute bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {cart.length}
            </span>
          </button>
        </div>
        <div className="md:px-6">
          <h2 className="text-2xl font-bold px-4 md:px-0">Bank Accounts</h2>
          <div className="md:rounded-xl bg-white w-full p-4 my-4">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4 md:p-6">
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

        {/* TODO: Put Sliding panel in a component */}

        <div
          className={`fixed overflow-y-auto top-0 right-0 h-full bg-white transition-transform duration-300 ease-in-out ${
            isCartOpen ? "translate-x-0" : "translate-x-full"
          } w-11/12 lg:w-[70%] shadow-lg z-50`}
        >
          <div className="p-8 flex flex-col justify-between h-full">
            <div>
              <div className="flex justify-between items-center">
                <p className="text-3xl">Cart</p>

                <div className="flex">
                  {/* Close Button */}
                  <button
                    onClick={toggleCart}
                    className=" text-gray-700 font-bold text-lg"
                  >
                    <img className="h-8 w-8" src="/close.svg" />
                  </button>
                </div>
              </div>

              <div className="space-y-2 my-4 overflow-y-auto">
                {cart.length > 0 &&
                  cart
                    .map((item, index) => (
                      <div key={index}>
                        <li
                          key={index}
                          className="py-2 border-b flex justify-between items-center"
                        >
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => removeFromCart(index)}
                              className="bg-red-500 rounded-full p-1"
                            >
                              <img src="/minus.svg" className="h-2 w-2" />
                            </button>
                            <p>{item.name} : </p>
                          </div>

                          <p>${item.price.toFixed(2)}</p>
                        </li>
                      </div>
                    ))
                    .reverse()}

                {cart.length > 0 && (
                  <div>
                    <div className="py-2 flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <div>
                          <p className="font-semibold">Total : </p>
                          <p className="text-xs">(Excluding Taxes)</p>
                        </div>
                      </div>

                      <p>$ {price.toFixed(2).toString()}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div>
              <button
                disabled={cart.length === 0}
                onClick={openCheckout}
                className=" items-center px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg  disabled:opacity-50 w-full"
              >
                Check Out
              </button>
            </div>
          </div>
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
