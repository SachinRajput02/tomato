import React,{useContext} from 'react'
import './FoodDisplay.css'
import  {StoreContext} from '../context/StoreContext'
import Fooditem from '../Fooditem/Fooditem'


const FoodDisplay = ({category}) => {
  const {food_list}=useContext(StoreContext)
  // Filter food items based on shopStatus before mapping
  const filteredFoodList = food_list.filter(
    (item) => item.shopStatus === true
  );

  return (
    
      <div className="food-display" id='food-display'>
        <h2>top dishes near you</h2>
        <div className="food-display-list">
          
          {filteredFoodList.map((item,index)=>{
            {console.log(category,item.category);}
            if(category==="All" || category===item.category){
              return <Fooditem key={index} id={item._id} name={item.name} description={item.description} price={item.price} image={item.image}  shopname={item.shopname} />
            }
            
            

          })}
        </div>
      </div>
    
  )
}

export default FoodDisplay;
