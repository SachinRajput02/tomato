import React, { useContext, useState } from "react";
import "./Navbar.css";
import { assets } from "../../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { StoreContext } from "../context/StoreContext";
const Navbar = ({ setShowLogin }) => {
  const [menu, setMenu] = useState("home");

  const { getTotalCartAmount, getTotalCartQuantity, token, setToken } =
    useContext(StoreContext);

  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    navigate("/");
  };

  return (
    <div className="navbar">
      <Link to="/">
        <img src={assets.logo} alt="" className="logo" />
      </Link>
      <ul className="navbar-menu">
        <Link
          to="/"
          onClick={() => setMenu("home")}
          className={menu === "home" ? "active" : ""}
        >
          home
        </Link>
        <a
          href="#explore-menu"
          onClick={() => setMenu("menu")}
          className={menu === "menu" ? "active" : ""}
        >
          menu
        </a>
        {/* <a
          href="#app-download"
          onClick={() => setMenu("mobile-app")}
          className={menu === "mobile-app" ? "active" : ""}
        >
          mobile-app
        </a> */}
        <a
          href="#footer"
          onClick={() => setMenu("contact-us")}
          className={menu === "contact-us" ? "active" : ""}
        >
          contact us
        </a>
        <Link
          to="/about"
          onClick={() => setMenu("about-us")}
          className={menu === "about-us" ? "active" : ""}
        >
          about us
        </Link>
      </ul>
      <div className="navbar-right">
        <div className="navbar-search-bar">
          <input type="text" placeholder="Search Shops" />
          <img src={assets.search_icon} alt="" />
        </div>
        
        <div className="navbar-cart ">
          <Link to="/cart">
            <img src={assets.basket_icon} alt="" />
          </Link>
          <div className={getTotalCartAmount() === 0 ? "" : "dot"}>
            {getTotalCartQuantity()===0?'':getTotalCartQuantity()}
          </div>
        </div>

        {!token ? (
          <div className="navbar-sign-in">
            <button>Sign in</button>
            <ul className="navbar-sign-in-drop-down">
              <li onClick={() => setShowLogin(true)}>
                <p>As a User</p>
              </li>

              <li
                onClick={() => (window.location.href = `https://tomato-admin-arqd.onrender.com`)}
              >
                <p>As a Seller</p>
              </li>
            </ul>
          </div>
        ) : (
          <div className="navbar-profile">
            <img src={assets.profile_icon} alt="" />
            <ul className="navbar-profile-dropdown">
            <li onClick={() => navigate("/userProfile")}>
                <img src={assets.user_icon} alt="" />
                <p>Profile</p>
              </li>
              <hr />
              <li onClick={() => navigate("/myorders")}>
                <img src={assets.bag_icon} alt="" />
                <p>Orders</p>
              </li>
              <hr />
              <li onClick={logout}>
                <img src={assets.logout_icon} alt="" />
                <p>Logout</p>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
