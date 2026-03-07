import React, { useContext, useState } from "react";
import "./Navbar.css";
import { assets } from "../../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { StoreContext } from "../context/StoreContext";
const Navbar = ({ setShowLogin }) => {
  const [menu, setMenu] = useState("home");

  const {
    getTotalCartAmount,
    getTotalCartQuantity,
    adminUrl,
    token,
    setToken,
  } = useContext(StoreContext);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const [signinbarOpen, setSigninbarOpen] = useState(false);


  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    navigate("/");
  };

  return (
    <div className="navbar" id="navbar">
      <Link to="/">
        {/* <img src={assets.logo} alt="" className="logo" /> */}
        <h2 >Fooddel</h2>
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
            <div
              className={`cart__quantity_desktop cart__quantity  ${
                getTotalCartQuantity() === 0 ? "hidden" : ""
              }`}
            >
              {getTotalCartQuantity() === 0 ? "" : getTotalCartQuantity()}
            </div>
          </Link>
        </div>

        {!token ? (
          <div className="navbar-sign-in">
            <button className="login-button-guide" onClick={() => setSigninbarOpen(true)}>Sign in</button>
            {signinbarOpen && (
             <ul className={`navbar-sign-in-drop-down`}>
              <li onClick={() => {setShowLogin(true); setSigninbarOpen(false);}}>
                <p>As a Customer</p>
              </li>

              <li onClick={() => (window.location.href = `${adminUrl}`)}>
                <p>As a Seller</p>
              </li>
            </ul>
            )}
          </div>
        ) : (
          <>
            <div className="manu_system">
              <div className="menu_icon" onClick={toggleSidebar}>
                <img src={assets.menuicon} alt="menu" />
              </div>
            </div>
            <div className="menu_desktop">
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
            </div>
            {isSidebarOpen && (
              <div className="mobile_sidebar">
                <div className="close_btn" onClick={toggleSidebar}>
                  <img src={assets.menucloseicon} alt="" />
                </div>
                <ul>
                  <li
                    onClick={() => {
                      navigate("/userProfile");
                      toggleSidebar();
                    }}
                  >
                    <img src={assets.user_icon} alt="user" />
                    <p>Profile</p>
                  </li>
                  
                  <li
                    onClick={() => {
                      navigate("/about");
                      toggleSidebar();
                    }}
                  >
                    {/* <img src={assets.user_icon} alt="user" /> */}
                    <p>About-us</p>
                  </li>
                  <li
                    onClick={() => {
                      navigate("/privacyPolicy");
                      toggleSidebar();
                    }}
                  >
                    <p>Privacy Policy</p>
                  </li>
                  
                  <li
                    onClick={() => {
                      logout();
                      toggleSidebar();
                    }}
                  >
                    <img src={assets.logout_icon} alt="logout" />
                    <p>Logout</p>
                  </li>
                </ul>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
