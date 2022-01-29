import { UserContext } from "../context";
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";

import StripeTestCards from '../components/StripeTestCards'

import { useShoppingCart } from 'use-shopping-cart'
import { fetchPostJSON } from '../utils/api-helpers'

const CartSummary = () => {
  const [loading, setLoading] = useState(false)
  const [cartEmpty, setCartEmpty] = useState(true)
  const [state, setState] = useContext(UserContext);
  const {
    formattedTotalPrice,
    cartCount,
    clearCart,
    cartDetails,
    redirectToCheckout,
  } = useShoppingCart()

  useEffect(() => setCartEmpty(!cartCount), [cartCount])

  const handleCheckout: React.FormEventHandler<HTMLFormElement> = async (
    event
  ) => {
    event.preventDefault()
    setLoading(true)

    const response = await fetchPostJSON(
      '/api/checkout_sessions/cart',
      cartDetails
    )

    if (response.statusCode === 500) {
      console.error(response.message)
      return
    }
    if (state && state.token) {
      axios.post("/http://localhost:8000/api/subscriptions", {
        cartDetails
           
         });
       }

    redirectToCheckout({ sessionId: response.id })
  }

  return (
    <form onSubmit={handleCheckout}>
      <h2>Cart summary</h2>
      {/* This is where we'll render our cart */}
      <p suppressHydrationWarning>
        <strong>Number of Items:</strong> {cartCount}
      </p>
      <p suppressHydrationWarning>
        <strong>Total:</strong> {formattedTotalPrice}
      </p>

      {/* Redirects the user to Stripe */}
      <StripeTestCards />
      <button
        className="cart-style-background"
        type="submit"
        disabled={cartEmpty || loading}
      >
        Checkout
      </button>
      <button
        className="cart-style-background"
        type="button"
        onClick={clearCart}
      >
        Clear Cart
      </button>
    </form>
  )
}

export default CartSummary