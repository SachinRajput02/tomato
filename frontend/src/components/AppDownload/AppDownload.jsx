import React from 'react'
import './AppDownload.css'
import { assets } from '../../assets/assets'
import { toast } from 'react-toastify'

const AppDownload = () => {
  const handlePlayOrAppStoreClick = () => { 
    toast.info('This feature is not available yet!')
  }
  return (
    <div className='app-download' id='app-download'>
      <p>For Better Experience Download <br />Tomato App</p>
      <div className="app-download-platforms">
        <img onClick={handlePlayOrAppStoreClick} src={assets.play_store} alt="" />
        <img onClick={handlePlayOrAppStoreClick} src={assets.app_store} alt="" />
      </div>
    </div>
  )
}

export default AppDownload
