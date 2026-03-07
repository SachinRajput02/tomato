import React, { useContext, useEffect, useState } from "react";
import "./Home.css";
import { assets } from "../../assets/assets";
import { NavLink } from "react-router-dom";
import { StoreContext } from "../../components/context/StoreContext";
import { toast } from "react-toastify";
import Header from "../../components/Header/Header";
import order_img from "../../assets/frontend_assets/order_img4.jpg";
import add_icon from "../../assets/frontend_assets/add_img3.jpg";
import products_icon from "../../assets/frontend_assets/products_icon3.png";


const Home = ({ setShowSellerLogin }) => {
  const {
    fetchShopName,
    sellerCartItems,
    getTotalSellerCartQuantity,
    food_list,
    updateAllShopStatuses,
    getShopStatus,
    sellerToken,
  } = useContext(StoreContext);

  const [shopName, setShopName] = useState("");
  const [shopStatus, setShopStatus] = useState(null);
    useEffect(() => {
    if (!sellerToken) {
      setShowSellerLogin(true);
    } else {
      setShowSellerLogin(false);
    }
  }, [sellerToken, setShowSellerLogin]);



  useEffect(() => {
    const getShopNameAndStatus = async () => {
      const name = await fetchShopName();
      const shopStatus = await getShopStatus();
      setShopName(name);
      setShopStatus(shopStatus);
    };
    getShopNameAndStatus();

  }, [sellerToken, fetchShopName,updateAllShopStatuses]);

  return (
    <div className="home-container">
      {/* <Header shopName={shopName} /> */}
        <div className="seller-home">
          <header className="seller-home-header">
            {/* <img src={assets.logo} alt="Logo" className="seller-home-logo" /> */}
               <h1>Welcome to <span className="shop-name">{shopName}</span> Dashboard</h1>

            <p>
              Manage your store efficiently and effective and grow your business with ease .
            </p>
          </header>

          {/* <div className="shop-open-close-section">
            <h2>Shop Status {shopStatus === null ? "Loading..." : shopStatus ? "Open" : "Closed"}</h2>

            <img
              onClick={()=>updateAllShopStatuses(false)}
              className="seller-shop-open-close-icon"
              src={assets.close_shop_icon}
              alt=""
            />
            <img
              onClick={()=> updateAllShopStatuses(true)}
              className="seller-shop-open-close-icon"
              src={assets.open_shop_icon}
              alt=""
            />
          </div> */}
            <section className="card shop-status-card">
    <h2>Shop Status</h2>
    <div className={`status-badge ${shopStatus ? "open" : "closed"}`}>
      {shopStatus === null ? "Loading..." : shopStatus ? "Open" : "Closed"}
    </div>
    <div className="action-buttons">
      <button className="close-btn" onClick={() => updateAllShopStatuses(false)}>
        <i className="fas fa-times-circle"></i> Close
      </button>
      <button className="open-btn" onClick={() => updateAllShopStatuses(true)}>
        <i className="fas fa-check-circle"></i> Open
      </button>
    </div>
  </section>

          <div className="seller-home-quick-access">
            <NavLink to="/Orders" className="quick-access-card-orders quick-access-card">
              <img src={order_img} alt="Orders" />
              <h3>Orders</h3>
              <p>View and manage all your orders.</p>
              <button className="home-button">Go to Orders</button>
            </NavLink>
            <NavLink to="/add" className="quick-access-card-add quick-access-card">
              <img src={add_icon} alt="Orders" />
              <h3>Add</h3>
              <p>Add product in your Shop.</p>
              <button className="home-button">Go to Add</button>
            </NavLink>

            <NavLink to="/List" className="quick-access-card-products quick-access-card">
              <img src={products_icon} alt="Products" />
              <h3>Products</h3>
              <p>Manage your products  in your shop.</p>
              <button className="home-button">View Products</button>
            </NavLink>

            <NavLink onClick={()=>toast("this feature not available yet")} to="/" className="quick-access-card quick-access-card-analytics">
              <img src={assets.analytics} alt="Analytics" />
              <h3>Analytics</h3>
              <p>Track your sales and performance.</p>
              <button className="home-button">View Analytics</button>
            </NavLink>
          </div>

          <section className="seller-home-tips">
            <h2>Tips for Success</h2>
            <ul>
              <li>💡 Keep your product listings updated and attractive.</li>
              <li>📦 Ship orders on time to maintain customer trust.</li>
              <li>📈 Use analytics to optimize your sales strategy.</li>
              <li>
                ⭐ Encourage customers to leave reviews for better visibility.
              </li>
            </ul>
          </section>

         
          <footer className="seller-home-footer">
            <p>Powered by tomato| Grow Your Business With Us</p>
          </footer>
        </div>
      
    </div>
  );
};

export default Home;
