import React, { useState } from 'react'
import {ToastContainer} from 'react-toastify'
import Navbar from './components/Navbar/Navbar'
import {Route, Routes}from 'react-router-dom'
import Home from './pages/Home/Home'
import Cart from './pages/Cart/Cart'
import PlaceOrder from './pages/PlaceOrder/PlaceOrder'
import Profile from './pages/Profile/Profile.jsx'
import Footer from './components/Footer/Footer'
import BottomBar from './components/BottomBar/BottomBar.jsx'
import LoginPopup from './components/LoginPopup/LoginPopup'
import './App.css';
import Verify from './pages/Verify/Verify.jsx'
import MyOrders from './pages/MyOrders/MyOrders'
import About from './pages/About/About.jsx'






const App = () => {

  const [showLogin,setShowLogin]=useState()
  
  


  return (
    <>
    {showLogin?<LoginPopup setShowLogin={setShowLogin} />:<></>}


    <div className='app'>
      <ToastContainer />
      <Navbar setShowLogin={setShowLogin} />
      <Routes>
        <Route path='/'element={<Home/>}/>
        <Route path='/cart'element={<Cart/>}/>
        <Route path='/userProfile' element={<Profile/>}/>
        <Route path='/order'element={<PlaceOrder/>}/>
        <Route path='/verify' element={<Verify/>}/>
        <Route path='/myorders' element={<MyOrders/>}/>
        <Route path='/about' element={<About/>}/>
      </Routes>
      
    </div>
    <Footer/>
    <BottomBar/>

    </>
  )
}

export default App
