import { createContext, useEffect, useState } from "react";
import axios from "axios"
export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const url = "https://tomato-backend-new1.onrender.com";
  const [token, setToken] = useState("");
  
  const [food_list, setFoodList] = useState([]);

  const addToCart = async (itemId) => {
    if (!cartItems[itemId] ) {
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
        if (cartItems[item] > 0) {  // Corrected condition
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


  const fetchFoodList = async () => {
    const response = await axios.get(url + "/api/food/list");
    setFoodList(response.data.data);
    // console.log(localStorage.getItem("token"));

    // console.log(localStorage.getItem("sellerToken"))
  };

  const loadCartData = async (token) => {
    const response = await axios.post(
      url + "/api/cart/get",
      {},
      { headers: { token } }
    );
    setCartItems(response.data.cartData);
  };

  
  useEffect(() => {
    async function loadData() {
      await fetchFoodList();
      if (localStorage.getItem("token")) {
        setToken(localStorage.getItem("token"));
        await loadCartData(localStorage.getItem("token"));
      }
    }
    loadData();
  }, []);

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

  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    getTotalCartQuantity,
    fetchFoodList,
    loadCartData,
    url,
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













//correct code here

// import { createContext, useEffect, useState } from "react";
// import axios from "axios"
// export const StoreContext = createContext(null);

// const StoreContextProvider = (props) => {
//   const [cartItems, setCartItems] = useState({});
//   const url = "http://localhost:4000";
//   const [token, setToken] = useState("");
//   const [food_list, setFoodList] = useState([]);

//   const addToCart = async (itemId) => {
//     if (!cartItems[itemId]) {
//       setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
//     } else {
//       setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
//     }
//     if (token) {
//       await axios.post(
//         url + "/api/cart/add",
//         { itemId },
//         { headers: { token } }
//       );
//     }
//   };

//   const removeFromCart = async (itemId) => {
//     setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
//     if (token) {
//       await axios.post(
//         url + "/api/cart/remove",
//         { itemId },
//         { headers: { token } }
//       );
//     }
//   };

//   const getTotalCartAmount = () => {
//     let totalAmount = 0;
//     for (const item in cartItems) {
//         if (cartItems[item] > 0) {  // Corrected condition
//             let itemInfo = food_list.find((product) => product._id === item);
            
//             // Ensure itemInfo exists to avoid undefined error
//             if (itemInfo) {
//                 totalAmount += itemInfo.price * cartItems[item];
//             } else {
//                 console.warn(`Item with ID ${item} not found in food_list`);
//             }
//         }
//     }
//     return totalAmount;
// };


//   const fetchFoodList = async () => {
//     const response = await axios.get(url + "/api/food/list");
//     setFoodList(response.data.data);
//     console.log(localStorage.getItem("token"));

//     // console.log(localStorage.getItem("sellerToken"))
//   };

//   const loadCartData = async (token) => {
//     const response = await axios.post(
//       url + "/api/cart/get",
//       {},
//       { headers: { token } }
//     );
//     setCartItems(response.data.cartData);
//   };

//   useEffect(() => {
//     async function loadData() {
//       await fetchFoodList();
//       if (localStorage.getItem("token")) {
//         setToken(localStorage.getItem("token"));
//         await loadCartData(localStorage.getItem("token"));
//       }
//     }
//     loadData();
//   }, []);

//   const getTotalCartQuantity = () => {
//     let totalQuantity = 0;
//     for (const item in cartItems) {
//       if (cartItems[item] > 0) {
//         let itemInfo = food_list.find((product) => product._id === item);
//         totalQuantity += cartItems[item];
//       }
//     }
//     return totalQuantity;
//   };

//   const contextValue = {
//     food_list,
//     cartItems,
//     setCartItems,
//     addToCart,
//     removeFromCart,
//     getTotalCartAmount,
//     getTotalCartQuantity,
//     url,
//     token,
//     setToken,
//   };
//   return (
//     <StoreContext.Provider value={contextValue}>
//       {props.children}
//     </StoreContext.Provider>
//   );
// };
// export default StoreContextProvider;
