import React from 'react'
import './Header.css'

const Header = () => {
  return (
    <div className='header'>
      <div className="header-contents">
        <h2>Order from your favourite Shop</h2>
        <p>choose from a diverse menu featuring a delectable arry of dishes crafted with the finest ingredients and culinary expertise.our mission is to satisfy your cravings and elevate your dining experience , one delicious meal at a time </p>
        <a href="#explore-menu"><button>View Menu</button></a>
      </div>
    </div>
  )
}

export default Header
