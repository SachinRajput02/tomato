import React from "react";
import "./BottomBar.css";
import { Link, useLocation } from "react-router-dom";
import { assets } from "../../assets/assets";
import { StoreContext } from "../context/StoreContext";
import { useContext } from "react";
const BottomBar = () => {
  const { getTotalCartQuantity, getTotalCartAmount } = useContext(StoreContext);
  const location = useLocation();

  return (
    <div className="bottombar">
      <div className="bottombar__container">
        <Link
          className={`bottombar__container__item ${
            location.pathname === "/" ? "active" : ""
          }`}
          to="/"
        >
          <img src={assets.home_icon} alt="Home" />
          <p>Home</p>
        </Link>

        <Link
          className={`bottombar__container__item ${
            location.pathname === "/userProfile" ? "active" : ""
          }`}
          to="/userProfile"
        >
          <img src={assets.person_profile_icon} alt="You" />
          <p>You</p>
        </Link>

        <Link
          className={`cart_section bottombar__container__item ${
            location.pathname === "/cart" ? "active" : ""
          }`}
          to="/cart"
        >
          <div
            className={`cart__quantity ${
              getTotalCartQuantity() === 0 ? "hidden" : ""
            }`}
          >
            {getTotalCartQuantity() !== 0 && getTotalCartQuantity()}
          </div>
          <img src={assets.cart_icon} alt="Cart" />
          <p>Cart</p>
        </Link>

        {/* <Link
          className={`cart_section bottombar__container__item ${
            location.pathname === "/cart" ? "active" : ""
          }`}
          to="/cart"
        >
          <div className={getTotalCartAmount() === 0 ? "" : "cart__quantity"}>
                    {getTotalCartQuantity()===0?'':getTotalCartQuantity()}
                  </div>
          <img src={assets.cart_icon} alt="Cart" />
          <p>Cart</p>
        </Link> */}
        <Link
          className={`bottombar__container__item ${
            location.pathname === "/myorders" ? "active" : ""
          }`}
          to="/myorders"
        >
          <img src={assets.shoppingbag} alt="Orders" />
          <p>Orders</p>
        </Link>
      </div>
    </div>
  );
};

export default BottomBar;
