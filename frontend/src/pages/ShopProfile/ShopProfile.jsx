import React, { useState, useEffect, useContext, useRef } from "react";
import "./ShopProfile.css";
import ShopDetails from "../../components/ShopDetails/ShopDetails";
import FoodDisplay from "../../components/FoodDisplay/FoodDisplay";
import ExploreMenu from "../../components/ExploreMenu/ExploreMenu";
import { useLocation } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import { StoreContext } from "../../components/context/StoreContext";
import Review from "../../components/Reviews/Reviews";
import "leaflet-routing-machine";
import "@gegeweb/leaflet-routing-machine-openroute";
const OpenRouteService = import.meta.env.VITE_OpenRouteServiceKey;

const ShopProfile = () => {
  const { setShopNamesArray, url } = useContext(StoreContext);
  const { state } = useLocation();
  const shopName = state?.shopName;
  const shopId = state?.shopId;

  const [tab, setTab] = useState("Food/Menu");
  const [category, setCategory] = useState("All");
  const [shop, setShop] = useState({});
  const [reviews, setReviews] = useState(null);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [userLocation, setUserLocation] = useState(null);
  const [distanceInfo, setDistanceInfo] = useState(null);
  const mapRef = useRef(null);
  const routingControlRef = useRef(null);

  useEffect(() => {
    if (shopName) {
      setShopNamesArray(shopName);
    }
  }, [shopName, shopId]);

  const fetchShopDetails = async () => {
    if (!shopId) return;
    try {
      const response = await fetch(`${url}/api/findShop/getShopById`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sellerId: shopId }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch shop details");
      }
      setShop(data);
    } catch (err) {
      console.error("Error fetching shop details", err);
    }
  };

  useEffect(() => {
    if (shopId) {
      fetchShopDetails();
    }
  }, [shopId]);

  const fetchReviews = async () => {
    setLoadingReviews(true);
    setReviewError("");
    try {
      const response = await fetch(`${url}/api/review/Seller/${shopId}`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch reviews");
      }
      setReviews(data);
    } catch (error) {
      setReviewError(error.message);
    } finally {
      setLoadingReviews(false);
    }
  };

  useEffect(() => {
    if (tab === "Reviews" && reviews === null) {
      fetchReviews();
    }
  }, [tab]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation([position.coords.latitude, position.coords.longitude]);
      },
      (error) => {
        console.error("Location error:", error);
        // Fallback to a default location (e.g., Bharatpur, Rajasthan)
        setUserLocation([27.2173, 77.4895]);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, []);

  useEffect(() => {
    if (tab === "ShowOnMap" && shop?.location?.coordinates && userLocation) {
      if (mapRef.current) {
        mapRef.current.remove();
      }

      const map = L.map("shop-map").setView(userLocation, 14);
      mapRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(map);

      const [shopLng, shopLat] = shop.location.coordinates;

      L.marker(userLocation).addTo(map).bindPopup("You are here").openPopup();
      L.marker([shopLat, shopLng]).addTo(map).bindPopup(shop.shopName);

      // Remove existing routing control if any
      if (routingControlRef.current) {
        map.removeControl(routingControlRef.current);
      }

      // Add routing control
      const routingControl = L.Routing.control({
        waypoints: [
          L.latLng(userLocation[0], userLocation[1]),
          L.latLng(shopLat, shopLng),
        ],
        router: new L.Routing.OpenRouteService(OpenRouteService),
        lineOptions: {
          styles: [{ color: "blue", opacity: 0.6, weight: 4 }],
        },
        show: false,
        addWaypoints: false,
        routeWhileDragging: false,
        draggableWaypoints: false,
        fitSelectedRoutes: true,
        showAlternatives: false,
      })
        .on("routesfound", function (e) {
          const route = e.routes[0];
          const summary = route.summary;
          setDistanceInfo({
            distance: (summary.totalDistance / 1000).toFixed(2), // in km
            time: (summary.totalTime / 60).toFixed(0), // in minutes
          });
        })
        .addTo(map);

      routingControlRef.current = routingControl;
    }
  }, [tab, shop, userLocation]);
    useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <h1>Shop Profile</h1>
      <div className="shop-details-components"><ShopDetails sellerId={shopId} /></div>
      <hr />
      <div className="tabs-filter-switches-ControlBar shop-details-tabs">
        <ul/>
          <li
            className={tab === "Food/Menu" ? "active" : ""}
            onClick={() => setTab("Food/Menu")}
          >
            Food/Menu
          </li>
          <li
            className={tab === "Reviews" ? "active" : ""}
            onClick={() => setTab("Reviews")}
          >
            Reviews
          </li>
          <li
            className={tab === "ShowOnMap" ? "active" : ""}
            onClick={() => setTab("ShowOnMap")}
          >
            ShowOnMap
          </li>
          <li
            className={tab === "Photos" ? "active" : ""}
            onClick={() => setTab("Photos")}
          >
            Photos
          </li>
        
      </div>
      <hr />
      {tab === "Food/Menu" && (
          <ExploreMenu category={category} setCategory={setCategory} />
      )}
      {tab === "Food/Menu" && (   
          <FoodDisplay shop={shopName} category={category} />
      )}
      {tab === "Reviews" && (
        <>
          <p>Reviews for the {shopName}</p>
          <div className="reviews-div">
            {loadingReviews ? (
              <p>Loading reviews...</p>
            ) : reviewError ? (
              <p>Error: {reviewError}</p>
            ) : reviews && reviews.length > 0 ? (
              <ul>
                {reviews.map((review) => (
                  <Review
                    key={review._id}
                    targetId={review.targetId}
                    rating={review.rating}
                    comment={review.comment}
                    createdAt={review.createdAt}
                    user={review.user}
                  />
                ))}
              </ul>
            ) : (
              <div className="no-review-div fade-in">
    <img src="/assets/no-reviews.png" alt="No reviews" className="no-review-img" />
    <p>No reviews yet. for the given item </p>
  </div>
              // <div className="no-review-div">
              //   <p>No reviews yet.</p>
              // </div>
            )}
          </div>
        </>
      )}
      {tab === "ShowOnMap" && (
        <>
          <p>See your shop on the map</p>
          <div
            id="shop-map"
            className="shop-map-container"
            style={{ height: "250px", marginTop: "1rem" }}
          ></div>
          {distanceInfo && (
            <div style={{ marginTop: "1rem" }}>
              <p>
                Distance: {distanceInfo.distance} km | Estimated Time:{" "}
                {distanceInfo.time} mins
              </p>
            </div>
          )}
        </>
      )}
      {tab === "Photos" && <h3>No photos available</h3>}
    </div>
  );
};

export default ShopProfile;
