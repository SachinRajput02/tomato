import { createContext, useEffect, useState } from "react";
import axios from "axios";
export const StoreContext = createContext(null);
const url = import.meta.env.VITE_BACKEND_API_URL;
const adminUrl = import.meta.env.VITE_ADMIN_API_URL;

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [fav_Shops, setFav_Shops] = useState([]);
  const [food_list, setFoodList] = useState([]);
  const [shopNamesArray, setShopNamesArray] = useState([]);
  const [cartShopNamesArray, setCartShopNamesArray] = useState([]);

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    address: {},
    profilePic: "",
  });
    useEffect(() => {
    async function loadData() {
      if (localStorage.getItem("token")) {
        setToken(localStorage.getItem("token"));
        await loadCartData(localStorage.getItem("token"));
      }
    }
    loadData();
  }, []);

  // Fetch user profile data
  const loadUserProfileData = async () => {
    try {
      const response = await axios.post(
        `${url}/api/userprofile/getUserProfile`,
        {},
        { headers: { token } }  
      );
      const { name, email, phone, address, profilePic } = response.data;

      setUserData({
        name,
        email,
        phone,
        address,
        profilePic,
      });
    } catch (error) {
      console.error("Error fetching user profile data:", error.message);
    }
  };

  const addToCart = async (itemId) => {
    if (!cartItems[itemId]) {
      setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
    } else {
      setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    }

    if (token) {
      await axios.post(
        url + "/api/cart/add",
        { itemId },
        { headers: { token } }  
      );
    }
  };

  const removeFromCart = async (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
    if (token) {
      await axios.post(
        url + "/api/cart/remove",
        { itemId },
        { headers: { token } }
      );
    }
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        // Corrected condition
        let itemInfo = food_list.find((product) => product._id === item);

        // Ensure itemInfo exists to avoid undefined error
        if (itemInfo) {
          totalAmount += itemInfo.price * cartItems[item];
        } else {
          console.warn(`Item with ID ${item} not found in food_list`);
        }
      }
    }
    return totalAmount;
  };

  const loadCartData = async (token) => {
    const response = await axios.post(
      url + "/api/cart/get",
      {},
      { headers: { token } }
    );
    setCartItems(response.data.cartData);
  };

  // StoreContext.js (new helper)
  const getCartGroupedBySeller = () => {
    const grouped = {};
    food_list.forEach((item) => {
      if (cartItems[item._id] > 0) {
        if (!grouped[item.sellerId]) {
          grouped[item.sellerId] = {
            sellerId: item.sellerId,
            shopname: item.shopname,
            items: [],
          };
        }
        grouped[item.sellerId].items.push(item);
      }
    });
    return Object.values(grouped);
  };

  // const fetchDeliveryFee = async (sellerId, distance) => {
  //   const res = await fetch(`${url}/api/seller/${sellerId}/delivery-cost?distance=${distance}`);
  //   const data = await res.json();
  //   return data.deliveryFee;
  // };

  // const getCartShopNames = () => {
  //   let shopNames = [];
  //   for (const item in cartItems){
  //     if (cartItems[item] > 0) {
  //       let itemInfo = food_list.find((product) => product._id === item);
  //       if (itemInfo && !shopNames.includes(itemInfo.shopName)) {
  //         shopNames.push(itemInfo.shopName);
  //       }
  //     }
  //   }
  //   return shopNames;
  // }

  const getTotalCartQuantity = () => {
    let totalQuantity = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = food_list.find((product) => product._id === item);
        totalQuantity += cartItems[item];
      }
    }
    return totalQuantity;
  };
  // get favourite shops
  // useEffect(() => {
  //   const fetchFavourites = async () => {
  //     try {
  //       const res = await axios.post(
  //         `${url}/api/findShop/getFavouriteShops`,
  //         {},
  //         { headers: { token } }
  //       );

  //       // console.log("Fetched fav_Shops:", res.data);
  //       setFav_Shops(Array.isArray(res.data) ? res.data : []);
  //     } catch (err) {
  //       console.error("Error fetching favourite fav_Shops", err);
  //       setFav_Shops([]);
  //     }
  //   };

  //   fetchFavourites();
  // }, [token]);

  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        return reject(new Error("Geolocation not supported"));
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => reject(error),
        { enableHighAccuracy: true }
      );
    });
  };

  // useEffect(() => {
  //   const fetchFavourites = async () => {
  //     try {
  //       console.log("Fetching favourite shops...", token);
  //       const res = await axios.post(
  //         `${url}/api/findShop/getFavouriteShops`,
  //         {},
  //         { headers: { token } }
  //       );
  //       console.log("Response from getFavouriteShops:", res.data);
  //       const parsedData =
  //         typeof res.data === "string" ? JSON.parse(res.data) : res.data;
  //       const favShops = Array.isArray(parsedData) ? parsedData : [];
  //       console.log("Parsed favourite shops:", favShops);
  //       if (favShops.length > 0) {
  //         setFav_Shops(favShops);
  //       } else {

  //         const position = await getCurrentLocation();
  //         const nearestRes = await axios.post(
  //           `${url}/api/findShop/findNearestXShops`,
  //           {
  //             longitude: position.longitude,
  //             latitude: position.latitude,
  //             limit: 3,
  //           },
  //         );
  //         const parsedData2 =
  //         typeof nearestRes.data === "string" ? JSON.parse(nearestRes.data) : nearestRes.data;
  //       const favShops2 = Array.isArray(parsedData2) ? parsedData2 : [];
  //         console.log("Fetched nearest shops:", favShops2);
  //         setFav_Shops(favShops2);
  //         setShopNamesArray(favShops2.map((shop) => shop.shopName));
  //       }
  //     } catch (err) {
  //       console.error("Error fetching favourite shops or nearest shops", err);
  //       setFav_Shops([]);
  //     }
  //   };

  //   fetchFavourites();
  // }, []);
useEffect(() => {
  const fetchFavourites = async () => {
    try {
      console.log("Fetching favourite shops...", token);

      // Step 1: Get Favourite Shops from DB
      const res = await axios.post(
        `${url}/api/findShop/getFavouriteShops`,
        {},
        { headers: { token } }
      );

      const parsedData =
        typeof res.data === "string" ? JSON.parse(res.data) : res.data;
      const favShops = Array.isArray(parsedData) ? parsedData : [];

      if (favShops.length > 0) {
        setFav_Shops(favShops);
      } else {
        // Step 2: Try to get current location with a timeout
        const defaultCoords = { latitude: 12.9716, longitude: 77.5946 }; // Example: Bangalore center
        let locationFetched = false;

        const locationPromise = new Promise((resolve) => {
          getCurrentLocation().then((pos) => {
            locationFetched = true;
            resolve(pos);
          });
        });

        const timeoutPromise = new Promise((resolve) =>
          setTimeout(() => {
            if (!locationFetched) {
              console.warn("Location taking too long, using default coordinates");
              resolve(defaultCoords);
            }
          }, 2000) // 2-second timeout
        );

        const position = await Promise.race([locationPromise, timeoutPromise]);

        const nearestRes = await axios.post(
          `${url}/api/findShop/findNearestXShops`,
          {
            longitude: position.longitude,
            latitude: position.latitude,
            limit: 3,
          }
        );

        const parsedData2 =
          typeof nearestRes.data === "string"
            ? JSON.parse(nearestRes.data)
            : nearestRes.data;
        const favShops2 = Array.isArray(parsedData2) ? parsedData2 : [];

        setFav_Shops(favShops2);
        setShopNamesArray(favShops2.map((shop) => shop.shopName));

        if (!locationFetched) {
          getCurrentLocation().then(async (realPos) => {
            const realNearestRes = await axios.post(
              `${url}/api/findShop/findNearestXShops`,
              {
                longitude: realPos.longitude,
                latitude: realPos.latitude,
                limit: 3,
              }
            );

            const realData =
              typeof realNearestRes.data === "string"
                ? JSON.parse(realNearestRes.data)
                : realNearestRes.data;

            setFav_Shops(realData);
            setShopNamesArray(realData.map((shop) => shop.shopName));
          });
        }
      }
    } catch (err) {
      console.error("Error fetching favourite shops or nearest shops", err);
      setFav_Shops([]);
    }
  };

  fetchFavourites();
}, []);



  const fetchFoodList = async () => {
    // if (!token) {
    //   const response = await axios.get(url + "/api/food/list");
    //   if(response.data.success) {
    //     setFoodList(response.data.data);
    //   }
    // }
  };

  const getFoodsByShops = async (shopNamesArray) => {
    try {
      const response = await fetch(`${url}/api/food/listFoodByShopNames`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ shopNames: shopNamesArray }),
      });

      const result = await response.json();
      if (result.success) {
        setFoodList(result.data);
      } else {
        console.error("Error fetching foods");
      }
    } catch (error) {
      console.error("Request failed:", error);
    }
  };

  useEffect(() => {
    if (fav_Shops.length > 0) {
      setShopNamesArray(fav_Shops.map((shop) => shop.shopName));
    }
  }, [fav_Shops]);

  useEffect(() => {
    if (shopNamesArray.length > 0) {
      getFoodsByShops(shopNamesArray);
    }
  }, [shopNamesArray]);
  useEffect(() => {
    async function loadData2() {
      await fetchFoodList();
    }
    loadData2();
  }, []);



  const contextValue = {
    userData,
    setUserData,
    loadUserProfileData,
    fav_Shops,
    setFav_Shops,
    food_list,
    setFoodList,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,

    getTotalCartAmount,
    getTotalCartQuantity,
    fetchFoodList,
    shopNamesArray,
    getCartGroupedBySeller,
    setShopNamesArray,
    getCurrentLocation,
    getFoodsByShops,
    loadCartData,
    url,
    adminUrl,
    token,
    setToken,
  };
  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};
export default StoreContextProvider;
