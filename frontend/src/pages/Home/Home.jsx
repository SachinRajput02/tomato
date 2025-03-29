import React, { useState } from 'react'
import './Home.css'
import Header from '../../components/Header/Header'
import ExploreShops from '../../components/ExploreShops/ExploreShops'
import ExploreMenu from '../../components/ExploreMenu/ExploreMenu'
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay'
import AppDownload from '../../components/AppDownload/AppDownload'
import LoginPopup from '../../components/LoginPopup/LoginPopup'


const Home = () => {
  const[category,setCategory]=useState("All"); 
  return (
    <div>
      
      <Header/>
      <ExploreShops/>
      <ExploreMenu category={category} setCategory={setCategory}/>
      <FoodDisplay category={category}/>
      <AppDownload/>
      
    </div>
  )
}

export default Home
