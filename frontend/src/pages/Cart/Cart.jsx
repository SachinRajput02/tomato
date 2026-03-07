

import React, { useContext, useEffect, useState } from "react";
import "./Cart.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { StoreContext } from "../../components/context/StoreContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const {
    cartItems,
    food_list,
    getCartGroupedBySeller,
    token,
    removeFromCart,
    getTotalCartAmount,
    url,
  } = useContext(StoreContext);

  const [groupedCart, setGroupedCart] = useState([]);
  const [deliveryFees, setDeliveryFees] = useState({});
  const totalDelivery = Object.values(deliveryFees).reduce((a, b) => a + b, 0);
  const totalCart = getTotalCartAmount() + totalDelivery;

  const navigate = useNavigate();

  const handleCheckout = () => {
  if (token && getTotalCartAmount() !== 0) {
    const subtotal = getTotalCartAmount();
    const total = totalCart;

    navigate("/order", {
      state: {
        subtotal,
        deliveryFees,
        total,
        groupedCart
      },
    });
  } else if (!token) {
    toast.error("Please log in to proceed to checkout");
  } else {
    toast.error("Please add product to proceed to checkout");
  }
};

  // const handleCheckout = () => {
  //   if (token && !(getTotalCartAmount() === 0)) {
  //     window.location.href = `/order`;
  //   } else if (!token) {
  //     toast.error("Please log in to proceed to checkout"); 
  //   } else {
  //     toast.error("Please add product to proceed to checkout"); 
  //   }
  // };

  useEffect(() => {
    const grouped = getCartGroupedBySeller();
    setGroupedCart(grouped);

    // Get user's actual geolocation
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        for (const group of grouped) {
          const res = await fetch(`${url}/api/delivery/delivery-charge`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              sellerId: group.sellerId,
              latitude,
              longitude,
            }),
          });

          const data = await res.json();
          setDeliveryFees((prev) => ({ ...prev, [group.sellerId]: data.cost }));
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        toast.error("Unable to access location for delivery cost");
      }
    );
  }, [cartItems, getCartGroupedBySeller]);



  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="cart">
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <br />
        <hr />
        {groupedCart.length === 0 && (
  <div className="empty-cart-block">
    Your cart is empty. Add some delicious food!
  </div>
)}

        {groupedCart.map((group) => {
  const itemTotal = group.items.reduce((total, item) => {
    return total + item.price * cartItems[item._id];
  }, 0);

  const deliveryFee = deliveryFees[group.sellerId] || 0;
  const totalFee = itemTotal + deliveryFee;

  return (
    <div className="cart-items" key={group.sellerId}>
      <h3>{group.shopname}</h3>
      {group.items.map((item) => (
        <div className="cart-items-title cart-items-item" key={item._id}>
          <img src={item.image} alt="" />
          <p>{item.name}</p>
          <p>₹{item.price}</p>
          <p>x {cartItems[item._id]}</p>
          <p>₹{item.price * cartItems[item._id]}</p>
          <p onClick={() => removeFromCart(item._id)} className="cross">
            X
          </p>
        </div>
      ))}
      <p>Delivery Fee: ₹{deliveryFee}</p>
      <p><strong>Total Fee: ₹{totalFee}</strong></p>
      <hr />
    </div>
    
  );
})}

      </div>
      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>₹{getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Total Delivery</p>
              <p>₹{totalDelivery}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>₹{totalCart}</b>
            </div>
          </div>
          <button onClick={handleCheckout}>PROCEED TO CHECKOUT</button>
        </div>
        <div className="cart-promocode">
          <div>
            <p>If you have a promo code, Enter it here</p>
            <div className="cart-promocode-input">
              <input type="text" placeholder="promo code" />
              <button>Submit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

