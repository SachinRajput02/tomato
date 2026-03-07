import React from "react";
import "./BottomBar.css";
import { Link, useLocation } from "react-router-dom";
import { assets } from "../../assets/assets";
// import { StoreContext } from "../context/StoreContext";

const BottomBar = () => {
  // const { getTotalCartQuantity, getTotalCartAmount } = useContext(StoreContext);
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
            location.pathname === "/add" ? "active" : ""
          }`}
          to="/add"
        >
          <img src={assets.addcircle_icon} alt="You" />
          <p>Add</p>
        </Link>

        <Link
          className={`cart_section bottombar__container__item ${
            location.pathname === "/orders" ? "active" : ""
          }`}
          to="/orders"
        >
          {/* <div
            className={`cart__quantity ${
              getTotalCartQuantity() === 0 ? "hidden" : ""
            }`}
          >
            {getTotalCartQuantity() !== 0 && getTotalCartQuantity()}
          </div> */}
          <img src={assets.order_icon} alt="Cart" />
          <p>Orders</p>
        </Link>
        <Link
          className={`bottombar__container__item ${
            location.pathname === "/list" ? "active" : ""
          }`}
          to="/list"
        >
          <img src={assets.inventory_icon} alt="Orders" />
          <p>products</p>
        </Link>
      </div>
    </div>
  );
};

export default BottomBar;
