import React, { useContext, useEffect, useState } from "react";
import "./Home.css";
import { assets } from "../../assets/assets";
import { NavLink } from "react-router-dom";
import { StoreContext } from "../../components/context/StoreContext";

const Home = ({ setShowSellerLogin }) => {
  const {
    fetchShopName,
    sellerCartItems,
    getTotalSellerCartQuantity,
    food_list,
    updateAllShopStatuses,
    sellerToken,
  } = useContext(StoreContext);

  const [shopName, setShopName] = useState("");
  const [shopStatus, setShopStatus] = useState(null);

  const handleImageClick = (imgIndex) => {
    if (shopStatus=== imgIndex) {
      // If the same image is clicked again, do nothing
      return;
    }
    setShopStatus(imgIndex); // Set the clicked image as selected
  };

  useEffect(() => {
    const getShopName = async () => {
      const name = await fetchShopName();
      setShopName(name);
    };

    getShopName();
  }, [sellerToken, fetchShopName]);

  useEffect(() => {
    if (!sellerToken) {
      setShowSellerLogin(true);
    } else {
      setShowSellerLogin(false);
    }
  }, [sellerToken, setShowSellerLogin]);

  return (
    <>
      {!sellerToken ? (
        <p>......Login and get your dashboard.....</p> // Placeholder while waiting for login
      ) : (
        <div className="seller-home">
          {/* Header Section */}
          <header className="seller-home-header">
            <img src={assets.logo} alt="Logo" className="seller-home-logo" />
            <img
              onClick={updateAllShopStatuses}
              className="seller-shop-open-close-icon"
              src={assets.close_shop_icon}
              alt=""
            />
            <img
              onClick={updateAllShopStatuses}
              className="seller-shop-open-close-icon"
              src={assets.open_shop_icon}
              alt=""
            />
            <h1>Welcome to `{shopName}` Dashboard</h1>

            <p>
              Manage your store efficiently and grow your business with ease.
            </p>
          </header>

          {/* Quick Access Section */}
          <div className="seller-home-quick-access">
            <NavLink to="/Orders" className="quick-access-card">
              <img src={assets.order_icon} alt="Orders" />
              <h3>Orders</h3>
              <p>View and manage all your orders.</p>
              <button className="home-button">Go to Orders</button>
            </NavLink>
            <NavLink to="/add" className="quick-access-card">
              <img src={assets.add_icon} alt="Orders" />
              <h3>Add</h3>
              <p>Add product in your Shop.</p>
              <button className="home-button">Go to Add</button>
            </NavLink>

            <NavLink to="/List" className="quick-access-card">
              <img src={assets.parcel_icon} alt="Products" />
              <h3>Products</h3>
              <p>Manage your products and items in your shop.</p>
              <button className="home-button">View Products</button>
            </NavLink>

            <NavLink to="/" className="quick-access-card">
              <img src={assets.analytics} alt="Analytics" />
              <h3>Analytics</h3>
              <p>Track your sales and performance.</p>
              <button className="home-button">View Analytics</button>
            </NavLink>
          </div>

          {/* Motivational Tips Section */}
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

          {/* Footer Section */}
          <footer className="seller-home-footer">
            <p>Powered by tomato| Grow Your Business With Us</p>
          </footer>
        </div>
      )}
    </>
  );
};

export default Home;
