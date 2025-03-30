import React from 'react'
import './BottomBar.css'
import { Link } from 'react-router-dom'
import { assets } from '../../assets/assets'

const BottomBar = () => {
  return (
  
      <div className="bottombar">
        <div className="bottombar__container">
          <div className="bottombar__container__item"><Link to="/"><img src={assets.home_icon} alt="" /><p>Home</p></Link></div>
          <div className="bottombar__container__item"><Link to="/userProfile"><img src={assets.person_profile_icon} alt="" /><p>You</p></Link></div>
          <div className="bottombar__container__item"><Link to="/cart"><img src={assets.cart_icon} alt="" /><p>Cart</p></Link></div>
          <div className="bottombar__container__item"><Link to="/myorders"><img src={assets.shoppingbag} alt="" /><p>Orders</p></Link></div>
        </div>
      </div>
  )
}

export default BottomBar
