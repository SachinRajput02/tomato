import React,{useRef,useEffect} from "react";
import { Link } from "react-router-dom";
import "./ExploreShops.css";
import { assets, shop_list } from "../../assets/assets";
import { useContext } from "react";
import { StoreContext } from "../context/StoreContext";

const ExploreShops = ({ shop, setShop }) => {
  const { fav_Shops,setFav_Shops, url, token } = useContext(StoreContext);
  const listRef = useRef(null);
    useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTo({ left: 0, behavior: "smooth" });
    }
  }, [token, fav_Shops, shop_list]); // scrolls when shop list updates

  


  return (
    <div className="explore-shop" id="explore-shop">
      <h2>Your Shops</h2>
      <div className="nearby-shop-section">
        <Link to="/nearbyShops">
          <div className="nearby-shop-search-area-and-manage-shop-area nearby-shops">
            <img src={assets.nearby_me} alt="" />
            Search Your Near By Shop
          </div>
        </Link>
        <Link to="/manageShops">
          <div className="manage-shop-button nearby-shop-search-area-and-manage-shop-area">
            <img src={assets.manage_shop} alt="" /> Manage Shops
          </div>
        </Link>
      </div>
      <p className="explore-shop-text">favourite/Nearest shop you can select the shop from here </p>
      <div className="explore-shop-list" ref={listRef}>
        {/* {fav_Shops.map((item, index) => {
              return (
                <div
                  onClick={() =>
                    setShop((prev) =>
                      prev === item.shopName ? "All" : item.shopName
                    )
                  }
                  key={index}
                  className="explore-shop-list-item"
                >
                  <img
                    className={shop === item.shopName ? "active" : ""}
                    src={
                      item.shopPic
                    }
                    alt=""
                  />
                  <p>{item.shopName}</p>
                </div>
              );
            })} */}
        {fav_Shops && fav_Shops.length > 0
          ? fav_Shops.map((item, index) => {
              return (
                <div
                  onClick={() =>
                    setShop((prev) =>
                      prev === item.shopName ? "All" : item.shopName
                    )
                  }
                  key={index}
                  className="explore-shop-list-item"
                >
                  <img
                    className={shop === item.shopName ? "active" : ""}
                    src={
                      item.shopPic
                    }
                    alt=""
                  />
                  <p>{item.shopName}</p>
                </div>
              );
            })
          : shop_list.map((item, index) => {
              return (
                <div
                  onClick={() =>
                    setShop((prev) =>
                      prev === item.shop_name ? "All" : item.shop_name
                    )
                  }
                  key={index}
                  className="explore-shop-list-item"
                >
                  <img
                    className={shop === item.shop_name ? "active" : ""}
                    src={item.shop_image}
                    alt=""
                  />
                  <p>{item.shop_name}</p>
                </div>
              );
            })}
            <div className="explore-shop-list-item">you can search and add nearby shop</div>
      </div>
      <hr />
    </div>
  );
};

export default ExploreShops;
