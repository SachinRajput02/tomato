import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../context/StoreContext";
const Navbar = ({ setShowSellerLogin }) => {
  const { sellerToken, setSellerToken, fetchShopName, setSellerCartItems } =
    useContext(StoreContext);

  // const {
  //   fetchShopName
  // } = useContext(StoreContext);
  const [shopName, setShopName] = useState("");

  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // for mobile sidebar

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("sellerToken");
    setSellerToken("");
    setSellerCartItems({}); // Clear cart items dynamically
    setShopName("");
    navigate("/");
  };

  useEffect(() => {
    // Fetch the shop name and update the state
    const getShopName = async () => {
      const name = await fetchShopName(); // Assuming fetchShopName returns a Promise
      setShopName(name);
    };

    getShopName();
  }, [sellerToken, fetchShopName]);

  return (
    <div className="navbar">
      <h3 className="shop_name">
        {/* {shopName || <img className="logo" src={assets.logo}></img>} */}
        {/* <img className="logo" src={assets.logo}></img> */}
        {shopName || "Fooddel Seller"}

      </h3>

      {/* <img className='shop_image' src={assets.shop_image} alt="" /> */}

      {
        !sellerToken ? (
          <div className="navbar-sign-in">
            <button onClick={() => setShowSellerLogin(true)}>Sign in</button>
          </div>
        ) : (
          <>
            <div className="manu_system">
              <div className="menu_icon" onClick={toggleSidebar}>
                <img src={assets.menu_icon} alt="menu" />
              </div>
            </div>
            <div className="menu_desktop">
              <div className="navbar-profile">
                <img src={assets.profile_icon} alt="" />
                <ul className="navbar-profile-dropdown">
                  <li onClick={() => navigate("/sellerProfile")}>
                    <img src={assets.user_icon} alt="" />
                    <p>Profile</p>
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
                  <img src={assets.menu_close_icon} alt="" />
                </div>
                <ul>
                  <li
                    onClick={() => {
                      navigate("/sellerProfile");
                      toggleSidebar();
                    }}
                  >
                    <img src={assets.user_icon} alt="user" />
                    <p>Profile</p>
                  </li>
                  <hr />
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
        )

        // <div className='navbar-profile'>
        //   <img src={assets.profile_icon} alt="" />
        //   <ul className="navbar-profile-dropdown">

        //     <li onClick={logout}><img src={assets.logout_icon} alt="" /><p>Logout</p></li>
        //   </ul>
        //   </div>
      }
    </div>
  );
};

export default Navbar;
