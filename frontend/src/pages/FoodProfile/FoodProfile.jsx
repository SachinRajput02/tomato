import React,{useEffect} from 'react'
import FoodDetails from '../../components/FoodDetails/FoodItemDetails'

const FoodProfile = () => {
   useEffect(() => {
      window.scrollTo(0, 0);
    }, []);

  return (
    <div>
        {/* <h1>Food Profile</h1> */}
        <FoodDetails />
      
    </div>
  )
}

export default FoodProfile
