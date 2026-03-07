import React from 'react'
import "./Spinner.css"
import { assets } from '../../assets/assets'

const Spinner = ()=> {
        return (
            <div className="Spinner">
                <img className="my-3" src={assets.Spinner} alt="loading" />
            </div>
        )
}

export default Spinner