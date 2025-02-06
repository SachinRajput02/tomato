import React from 'react'
import './rough.css'

const rough = () => {
  return (
    <div>
      <div className="navbar">
  <div className="navbar-left">
    <h3>
      {shopName || <img className="logo" src={assets.logo} alt="Logo" />}
    </h3>
  </div>

  <div className="navbar-center">
    <img className="shop_image" src={assets.shop_image} alt="Shop" />
  </div>

  <div className="navbar-right">
    {!sellerToken ? (
      <div className="navbar-sign-in">
        <button onClick={() => setShowSellerLogin(true)}>Sign In</button>
      </div>
    ) : (
      <div className="navbar-profile">
        <img src={assets.profile_icon} alt="Profile" className="profile-icon" />
        <ul className="navbar-profile-dropdown">
          <li onClick={logout}>
            <img src={assets.logout_icon} alt="Logout" />
            <p>Logout</p>
          </li>
        </ul>
      </div>
    )}
  </div>
</div>

    </div>
  )
}

export default rough
