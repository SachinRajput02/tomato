import React, { useState } from 'react'
import './App.css';
import {ToastContainer} from 'react-toastify'
import {Route, Routes}from 'react-router-dom'

//pages
import Home from './pages/Home/Home'
import Cart from './pages/Cart/Cart'
import NearbyShops from './pages/NearbyShops/NearbyShops.jsx'
import PlaceOrder from './pages/PlaceOrder/PlaceOrder'
import Profile from './pages/Profile/Profile.jsx'

import Verify from './pages/Verify/Verify.jsx'
import MyOrders from './pages/MyOrders/MyOrders'
import About from './pages/About/About.jsx'
import PrivacyPolicy from './components/PrivacyPolicy/PrivacyPolicy.jsx';
import ManageShops from './pages/ManageShops/ManageShops.jsx'
import ShopProfile from './pages/ShopProfile/ShopProfile.jsx'
 import FoodProfile from './pages/FoodProfile/FoodProfile.jsx'

// components
import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer'
import BottomBar from './components/BottomBar/BottomBar.jsx'
import LoginPopup from './components/LoginPopup/LoginPopup'
import ChatBox from './components/ChatBox/ChatBox.jsx'


import AppTour from './utils/TourGuide.jsx';

const App = () => {

  const [showLogin,setShowLogin]=useState()
  

  return (
    <>
    {showLogin?<LoginPopup setShowLogin={setShowLogin} />:<></>}

    <Navbar setShowLogin={setShowLogin} />
    <div className='app'>
      <ToastContainer />

      <AppTour />
      <Routes>
        <Route path='/'element={<Home/>}/>
        <Route path='/cart'element={<Cart/>}/>
        <Route path='/userProfile' element={<Profile/>}/>
        <Route path='/manageShops' element={<ManageShops/>}/>
        <Route path='/order'element={<PlaceOrder/>}/>
        <Route path='/verify' element={<Verify/>}/>
        <Route path='/myorders' element={<MyOrders/>}/>
        <Route path='/about' element={<About/>}/>
        <Route path='/privacyPolicy' element={<PrivacyPolicy/>}/>
        {/* <Route path='/chatbox' element={<ChatBox orderId="67fab43cb0f6c225ad124b72" sender="67efe638c622550f943a3bc9" />}/>  */}
        <Route path='/nearbyShops' element={<NearbyShops/>}/>
        <Route path='/ShopProfile' element={<ShopProfile/>}/>
        <Route path='/FoodProfile' element={<FoodProfile/>}/>
        


      </Routes>
      
    </div>
    <Footer/>
    <BottomBar/>
    </>
  )
}

export default App
