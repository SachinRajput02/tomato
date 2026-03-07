import { useEffect, useState, useContext, useRef } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import axios from "axios";
import L from "leaflet";
import { toast } from "react-toastify";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "./NearbyShopsComponent.css";
import { StoreContext } from "../context/StoreContext";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import Spinner from "../Spinner/Spinner";


const NearbyShops = () => {
  const {
    url,
    token,
    fav_Shops,
    setFav_Shops,
    shopNamesArray,
    setShopNamesArray,
  } = useContext(StoreContext);
  const [loading, setLoading] = useState(false);
  const [shops, setShops] = useState([]);
  const [state, setState] = useState("distance");
  const [maxDistance, setMaxDistance] = useState(1000000);
  const [limit, setLimit] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [favourites, setFavourites] = useState([]);
  const [message, setMessage] = useState("");
  const mapRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setLoading(true);
    setMessage("Fetching Your Current Location");

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setMessage("Searching Please Wait ....");

          try {
            let response;

            response = await axios.post(
              `${url}/api/findShop/getNearByShop`,
              { longitude, latitude, maxDistance },
              { headers: { "Content-Type": "application/json" } }
            );
            if (response.data.length > 0) {
              setShops(response.data);
            } else {
              // const position = await getCurrentLocation();
              const nearestRes = await axios.post(
                `${url}/api/findShop/findNearestXShops`,
                {
                  longitude,
                  latitude,
                  limit: 3,
                }
              );
              setShops(nearestRes.data);
            }

            setLoading(false);

            if (response.data.length < 1) {
              setMessage(`No nearby shops found in ${maxDistance / 1000}km.`);
            } else {
              setMessage(
                `${response.data.length} nearby shops found in ${maxDistance / 1000}km.`
              );
            }

            if (showMap) loadMap(latitude, longitude, data);
          } catch (error) {
            console.error(error);
            setErrorMsg("Failed to fetch nearby shops.");
          }
        },
        (error) => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              setErrorMsg("Location permission denied.");
              break;
            case error.POSITION_UNAVAILABLE:
              setErrorMsg("Location unavailable.");
              break;
            default:
              setErrorMsg("Error getting location.");
          }
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setErrorMsg("Geolocation not supported.");
    }
  }, [showMap, maxDistance, limit, state]);

  // useEffect(() => {
  //   setLoading(true);
  //   setMessage("Fetching Your Current Location");
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(
  //       async (position) => {
  //         const { latitude, longitude } = position.coords;
  //         setMessage("Searching Please Wait ....");
  //         try {
  //           if(state=="distance"){
  //             const response = await fetch(`${url}/api/findShop/getNearByShop`, {
  //               method: "POST",
  //               headers: { "Content-Type": "application/json" },
  //               body: JSON.stringify({ longitude, latitude, maxDistance }),
  //             });
  //           }else{
  //             const response = await axios.post(
  //           `${url}/api/findShop/findNearestXShops`,
  //           {
  //             longitude: position.longitude,
  //             latitude: position.latitude,
  //             limit: 4,
  //           },
  //         );
  //           }

  //           const data = await response.json();
  //           setLoading(false);
  //           setShops(data);
  //           if (data.length < 1) {
  //             setMessage(`No nearby shops found in ${maxDistance / 1000}km.`);
  //           } else {
  //             setMessage(` nearby shops found in ${maxDistance / 1000}km.`);
  //           }

  //           if (showMap) loadMap(latitude, longitude, data);
  //         } catch (error) {
  //           setErrorMsg("Failed to fetch nearby shops.");
  //         }
  //       },
  //       (error) => {
  //         switch (error.code) {
  //           case error.PERMISSION_DENIED:
  //             setErrorMsg("Location permission denied.");
  //             break;
  //           case error.POSITION_UNAVAILABLE:
  //             setErrorMsg("Location unavailable.");
  //             break;
  //           default:
  //             setErrorMsg("Error getting location.");
  //         }
  //       },
  //       {
  //         enableHighAccuracy: true,
  //         timeout: 10000,
  //         maximumAge: 0,
  //       }
  //     );
  //   } else {
  //     setErrorMsg("Geolocation not supported.");
  //   }
  // }, [showMap, maxDistance]);

  const loadMap = (lat, lng, shopList) => {
    if (mapRef.current) {
      mapRef.current.remove();
    }

    const map = L.map("map").setView([lat, lng], 14);
    mapRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© tomato.com",
    }).addTo(map);

    L.marker([lat, lng]).addTo(map).bindPopup("You are here");

    const markerCluster = L.markerClusterGroup();

    shopList.forEach((shop) => {
      const [long, lat] = shop.location?.coordinates || [];
      if (lat && long) {
        const marker = L.marker([lat, long]).bindPopup(shop.shopName);
        markerCluster.addLayer(marker);
      }
    });

    map.addLayer(markerCluster);
  };

  const toggleFavourite = async (sellerId) => {
    try {
      const res = await fetch(`${url}/api/findShop/addToFavourites`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
        body: JSON.stringify({ sellerId }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Something went wrong");
        return;
      }

      if (!token) {
        toast.error("Please login to add to favourites!");
        return;
      }
      setFavourites((prev) =>
        prev.includes(sellerId)
          ? prev.filter((id) => id !== sellerId)
          : [...prev, sellerId]
      );

      if (fav_Shops.some((s) => s._id === sellerId)) {
        setFav_Shops((prev) => prev.filter((s) => s._id !== sellerId));
        toast.success("Shop removed from favourites!");
      } else {
        const addedShop = shops.find((s) => s._id === sellerId);
        if (addedShop) {
          setFav_Shops((prev) => [...prev, addedShop]);
          toast.success("Shop added to   favourites!");
        }
      }
    } catch (err) {
      console.error("Error toggling favourite:", err);
    }
  };
  useEffect(() => {
    if (mapRef.current) {
      const map = L.map("map").setView([latitude, longitude], 14);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(map);
      mapRef.current = map;
    }
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="nearby-container">
      <h2>Nearby Food Shops</h2>
      {loading && <Spinner />}
      <hr />
      <div className="distance-selector">
        <ul />
        <li
          className={maxDistance == 1000000 ? "active" : ""}
          onClick={() => setMaxDistance(1000000)}
        >
          1000km
        </li>
        {/* <li className={maxDistance===1?'active':''} onClick={()=>setMaxDistance(1)}>1m</li> */}
        <li
          className={maxDistance === 1000 ? "active" : ""}
          onClick={() => setMaxDistance(1000)}
        >
          1km
        </li>
        <li
          className={maxDistance === 2000 ? "active" : ""}
          onClick={() => setMaxDistance(2000)}
        >
          2km
        </li>
        <li
          className={maxDistance === 5000 ? "active" : ""}
          onClick={() => setMaxDistance(5000)}
        >
          5km
        </li>
        <li
          className={maxDistance === 10000 ? "active" : ""}
          onClick={() => setMaxDistance(10000)}
        >
          10km
        </li>
        <li
          className={maxDistance === 15000 ? "active" : ""}
          onClick={() => setMaxDistance(15000)}
        >
          15km
        </li>
        <li
          className={maxDistance === 20000 ? "active" : ""}
          onClick={() => setMaxDistance(20000)}
        >
          20km
        </li>
      </div>

      {/* <div className="distance-selector">
        <ul />
        <li
          className={ limit== 3 ? "active" : ""}
          onClick={() => setLimit(3)}
        >
          3shop
        </li>
        <li
          className={ limit=== 2 ? "active" : ""}
          onClick={() => setLimit(2)}
        >
          2shops
        </li>
        <li
          className={limit === 5 ? "active" : ""}
          onClick={() => setLimit(5)}
        >
          5shops
        </li>
        <li
          className={limit === 8 ? "active" : ""}
          onClick={() => setLimit(8)}
        >
          8shops
        </li>
      </div> */}
      <hr />
      <p>{message}</p>
      {errorMsg && <p>{errorMsg}</p>}
      <div className="shop-card-container">
        {/* {shops.length === 0 && !loading && (
          <div className="no-shops">
            
          </div>
        )} */}

        {shops.map((shop, idx) => {
          const [long, lat] = shop.location?.coordinates || [];

          return (
            <div
              className="shop-card"
              key={idx}
              onClick={() =>
                navigate("/ShopProfile", {
                  state: { shopName: shop.shopName, shopId: shop._id },
                })
              }
            >
              <img
                src={shop.shopPic}
                alt={shop.shopName}
                className="shop-img"
              />
              <div className="shop-info">
                {/* <div className="shopname-rating">
                  <h4>{shop.shopName}</h4>
                  <h4>{shop.rating}</h4>
                </div>
                 */}
                <div className="food-shop-item-name-rating">
                  <p>{shop.shopName}</p>
                  <ul className="rating">
                    <li>{shop.rating}</li>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="15px"
                      viewBox="0 -960 960 960"
                      width="15px"
                      fill="#fff"
                    >
                      <path d="m384-334 96-74 96 74-36-122 90-64H518l-38-124-38 124H330l90 64-36 122ZM233-120l93-304L80-600h304l96-320 96 320h304L634-424l93 304-247-188-247 188Zm247-369Z" />
                    </svg>
                  </ul>
                </div>
                <div className="distance-heart">
                  <div className="distance">
                    <p>{shop.distance.toFixed(2)} km away</p>
                  </div>
                  <button
                    className="heart-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavourite(shop._id);
                    }}
                  >
                    {favourites.includes(shop._id) ? (
                      <FaHeart color="red" />
                    ) : (
                      <FaRegHeart />
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NearbyShops;
