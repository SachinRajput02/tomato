import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const url = "https://tomato-backend-new1.onrender.com";
  const [sellerCartItems, setSellerCartItems] = useState({});
  const [sellerToken, setSellerToken] = useState("");
  const [food_list, setFoodList] = useState([]);

  const addToSellerCart = async (itemId) => {
    if (!sellerCartItems[itemId]) {
      setSellerCartItems((prev) => ({ ...prev, [itemId]: 1 }));
    } else {
      setSellerCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    }

    if (!sellerToken) {
      console.error("Seller token is missing");
      return;
    }

    try {
      const response = await axios.post(
        `${url}/api/sellerCart/selleradd`,
        { itemId },
        { headers: { sellerToken } }
      );

      if (!response.data.success) {
        console.error("Failed to add to seller cart:", response.data.message);
      }
    } catch (error) {
      console.error("Error in adding to seller cart:", error.message);
    }
  };

  const removeFromSellerCart = async (itemId) => {
    setSellerCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
    if (sellerToken) {
      await axios.post(
        url + "/api/sellerCart/sellerremove",
        { itemId },
        { headers: { sellerToken } }
      );
    }
  };
  const changeShopFoodStatus = async (foodId) => {
    const response = await axios.post(`${url}/api/food/changeshopStatus`, { id: foodId });

    // if (response.data.success) {
    //   toast.success("Food updated in Live Foods");
    // } else {
    //   toast.error("Error for Removing food from Live foods");
    // }
  };

  // Function to fetch the food list and update the status of all foods
const updateAllShopStatuses = async () => {
  try {
    // Step 1: Fetch the food list
    const response1 = await axios.get(url + "/api/food/list");
    const response2 = await axios.post(
      url + "/api/sellerCart/sellerget",
      {},
      { headers: { sellerToken } }
    );
    const foodList = response1.data.data;

    if (foodList && foodList.length > 0) {
      // Step 2: Loop through the food list and call changeShopFoodStatus for each item
      for (const food of foodList) {
        if(response2.data.sellerCartData[food._id]){
          await changeShopFoodStatus(food._id);
        }
        
      }
      // toast.success("All food shop statuses updated successfully!");
    } else {
      // toast.info("No food items found to update.");
    }
  } catch (error) {
    // console.error("Error updating all shop statuses:", error);
    // toast.error("Failed to update all shop statuses.");
  }
};
  

  const fetchShopName = async () => {
    try {
      const response = await axios.post(url + "/api/seller/shopName",{}, {
        headers: {sellerToken},
      });

      if (response.data.success) {
        console.log("Shop Name:", response.data.shopName);
        return response.data.shopName;
      } else {
        console.error("Error fetching shop name:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching shop name:", error.message);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      await fetchShopName();
      await loadCartData(sellerToken);
    };
  
    if (sellerToken) {
       fetchData();
    }
  }, [sellerToken]); // Trigger only when sellerToken changes
  



  const fetchFoodList = async () => {
    const response = await axios.get(url + "/api/food/list");
    setFoodList(response.data.data);
    console.log(localStorage.getItem("sellerToken"));
    
  };

  const loadCartData = async (sellerToken) => {
    const response = await axios.post(
      url + "/api/sellerCart/sellerget",
      {},
      { headers: { sellerToken } }
    );
    setSellerCartItems(response.data.sellerCartData);
  };

  useEffect(() => {
    async function loadData() {
      await fetchFoodList();
      
      if (localStorage.getItem("sellerToken")) {
        setSellerToken(localStorage.getItem("sellerToken"));
        await loadCartData(localStorage.getItem("sellerToken"));
      }
    }
    loadData();
  }, []);


  const getTotalSellerCartQuantity = () => {
    let totalSellerQuantity = 0;
    for (const item in sellerCartItems) {
      if (sellerCartItems[item] > 0) {
        let itemInfo = food_list.find((product) => product._id === item);
        totalSellerQuantity += sellerCartItems[item];
      }
    }
    return totalSellerQuantity;
  };

  const contextValue = {
    url,
    sellerCartItems,
    setSellerCartItems,
    sellerToken,
    setSellerToken,
    food_list,
    addToSellerCart,
    removeFromSellerCart,
    changeShopFoodStatus,
    updateAllShopStatuses,
    fetchShopName,
    fetchFoodList,
    getTotalSellerCartQuantity,
  };
  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};
export default StoreContextProvider;
