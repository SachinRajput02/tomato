import React, { useContext, useEffect, useState } from "react";
import "./FoodDisplay.css";
import { useNavigate } from "react-router-dom";
import { StoreContext } from "../context/StoreContext";
import Fooditem from "../Fooditem/Fooditem";

const FoodDisplay = ({ category, shop }) => {
  const navigate = useNavigate();
  const { food_list } = useContext(StoreContext);

  const [filteredFoodList, setFilteredFoodList] = useState([]);
  const [sortBy, setSortBy] = useState("default");

  useEffect(() => {
    if (food_list && food_list.length > 0) {
      let filtered = food_list.filter((item) => item.shopStatus === true);

      switch (sortBy) {
        case "priceAsc":
          filtered.sort((a, b) => a.price - b.price);
          break;
        case "priceDesc":
          filtered.sort((a, b) => b.price - a.price);
          break;
        case "ratingAsc":
          filtered.sort((a, b) => a.rating - b.rating);
          break;
        case "ratingDesc":
          filtered.sort((a, b) => b.rating - a.rating);
          break;
        default:
          break;
      }

      setFilteredFoodList(filtered);
    } else {
      setFilteredFoodList([]);
    }
  }, [food_list, sortBy]);

  const handleResetSort = () => {
    setSortBy("default");
  };

  const finalList = filteredFoodList.filter(
    (item) =>
      (shop === "All" || shop === item.shopname) &&
      (category === "All" || category === item.category)
  );

  return (
    <div className="food-display" id="food-display">
      <h2>Top dishes near you</h2>

      {/* Sort & Filter Bar */}
      <div className="tabs-filter-switches-ControlBar enhanced-bar">
        <div className="sort-control">
          <label htmlFor="sort-select">Sort By:</label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="default">Default </option>
            <option value="priceAsc">Price (Low to High) ▲</option>
            <option value="priceDesc">Price (High to Low) ▼</option>
            <option value="ratingAsc">Rating (Low to High) ▲</option>
            <option value="ratingDesc">Rating (High to Low) ▼</option>
          </select>
          {sortBy !== "default" && (
            <button onClick={handleResetSort} className="reset-button">
              Reset
            </button>
          )}
        </div>
      </div>

      {finalList.length > 0 ? (
  <div className="food-display-list">
    {finalList.map((item, index) => (
      <Fooditem
        key={index}
        id={item._id}
        name={item.name}
        description={item.description}
        price={item.price}
        image={item.image}
        shopname={item.shopname}
        shopId={item.sellerId}
        
        rating={item.rating}
      />
    ))}
  </div>
) : (
  <div className="no-food-message">
    <h3>😢 Sorry! No food items available right now.</h3>
    <p>Try changing filters or check back later!</p>
  </div>
)}




      <hr />
    </div>
  );
};

export default FoodDisplay;






// import React, { useContext, useEffect, useState } from "react";
// import "./FoodDisplay.css";
// import { useNavigate } from "react-router-dom";
// import { StoreContext } from "../context/StoreContext";
// import Fooditem from "../Fooditem/Fooditem";

// const FoodDisplay = ({ category, shop }) => {
//   const navigate = useNavigate();
//   const { food_list } = useContext(StoreContext);

//   const [filteredFoodList, setFilteredFoodList] = useState([]);
//   const [sortBy, setSortBy] = useState("default");

//   useEffect(() => {
//     if (food_list && food_list.length > 0) {
//       let filtered = food_list.filter((item) => item.shopStatus === true);

//       switch (sortBy) {
//         case "priceAsc":
//           filtered.sort((a, b) => a.price - b.price);
//           break;
//         case "priceDesc":
//           filtered.sort((a, b) => b.price - a.price);
//           break;
//         case "ratingAsc":
//           filtered.sort((a, b) => a.rating - b.rating);
//           break;
//         case "ratingDesc":
//           filtered.sort((a, b) => b.rating - a.rating);
//           break;
//         default:
//           break;
//       }

//       setFilteredFoodList(filtered);
//     }
//   }, [food_list, sortBy]);

//   const handleResetSort = () => {
//     setSortBy("default");
//   };

//   return (
//     <div className="food-display" id="food-display">
//       <h2>Top dishes near you</h2>

//       {/* Sort & Filter Bar */}
//       <div className="tabs-filter-switches-ControlBar enhanced-bar">
//         {/* <div className="filter-button">
//           Filter{" "}
//           <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px" fill="#333">
//             <path d="M440-120v-240h80v80h320v80H520v80h-80Zm-320-80v-80h240v80H120Zm160-160v-80H120v-80h160v-80h80v240h-80Zm160-80v-80h400v80H440Zm160-160v-240h80v80h160v80H680v80h-80Zm-480-80v-80h400v80H120Z" />
//           </svg>
//         </div> */}

//         <div className="sort-control">
//           <label htmlFor="sort-select">Sort By:</label>
//           <select id="sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
//             <option value="default">Default </option>
//             <option value="priceAsc">Price (Low to High) ▲</option>
//             <option value="priceDesc">Price (High to Low) ▼</option>
//             <option value="ratingAsc">Rating (Low to High) ▲</option>
//             <option value="ratingDesc">Rating (High to Low) ▼</option>
//           </select>
//           {sortBy !== "default" && (
//             <button onClick={handleResetSort} className="reset-button">
//               Reset
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Food Item List */}
//       <div className="food-display-list">
//         {filteredFoodList.map((item, index) => {
//           if (shop === "All" || shop === item.shopname ) {
//             if (category === "All" || category === item.category ) {
//               return (
//                 <Fooditem
//                   key={index}
//                   id={item._id}
//                   name={item.name}
//                   description={item.description}
//                   price={item.price}
//                   image={item.image}
//                   shopname={item.shopname}
//                   rating={item.rating}
//                 />
//               );
//             }
//           }
//           return null;
//         })}
//       </div>

//       <hr />
//     </div>
//   );
// };

// export default FoodDisplay;



