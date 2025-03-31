import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <div className='footer' id='footer'>
      <div className="footer-content">
        <div className="footer-content-left">
          <img src={assets.logo} alt="" />
          <p>Stay connected with us! For any inquiries, feel free to contact us or call us. Follow us on social media for the latest updates and exclusive offers. We’re here to assist you 24/7!</p>
          <div className="footer-social-icon">
              <img src={assets.facebook_icon} alt="" /><img src={assets.linkedin_icon} alt="" /><img src={assets.twitter_icon} alt="" />
          </div>

        </div>
        <div className="footer-content-center">
          <h2>COMPANY</h2>
          <ul>
              <li>Home</li>
              <li><Link  to="/about">About Us</Link></li>
              
              <li>Delivery</li>
              <li>Privacy Policy</li>
          </ul>
        </div>
        <div className="footer-content-right">
          <h2>GET IN TOUCH</h2>
          <ul>
              <li>+919636000000</li>
              <li>Contact@tomato.com</li>
          </ul>
        </div>
      </div>
      <hr />
      <div>
        
        <p className="footer-copyright">Copyright 2024 © Tomato.com - All Right Reserved. </p>
        
      </div>
      
    </div>
  )
}

export default Footer
