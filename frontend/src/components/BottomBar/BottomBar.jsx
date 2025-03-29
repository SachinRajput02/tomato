import React from 'react'
import './BottomBar.css'
import { Link } from 'react-router-dom'
import { assets } from '../../assets/assets'

const BottomBar = () => {
  return (
    <div>
      <div className="bottombar">
        <div className="bottombar__container">
          <div className="bottombar__container__item"><img src={assets.home_icon} alt="" /><p>Home</p></div>
          <div className="bottombar__container__item"><img src={assets.person_profile_icon} alt="" /><p>You</p></div>
          <div className="bottombar__container__item"><img src={assets.cart_icon} alt="" /><p>Cart</p></div>
          <div className="bottombar__container__item"><img src={assets.shoppingbag} alt="" /><p>Orders</p></div>
        </div>
      </div>
    </div>
  )
}

export default BottomBar
