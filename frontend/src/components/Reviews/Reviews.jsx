import React, { useContext, useEffect, useState } from 'react';
import './Reviews.css';
import { StoreContext } from '../context/StoreContext';
import { assets } from '../../assets/assets';
import { formatReviewDate } from '../../utils/formatDate.js';

const Reviews = ({ user, targetId, rating, comment, createdAt }) => {
  const { url } = useContext(StoreContext);
  const [userData, setUserData] = useState({ name: '', profilePic: '' });

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(`${url}/api/userProfile/getUserProfilePicAndName/${user}`);
        const data = await response.json();
        if (data.success) {
          setUserData({ name: data.name, profilePic: data.profilePic });
        } else {
          console.error("Failed to fetch user details");
        }
      } catch (err) {
        console.error("Error fetching user details", err);
      }
    };

    fetchUserDetails();
  }, [user, url]);

  return (
    <div className="review-container">
      <div className="user-details">
        <img
          src={
            userData.profilePic
              ? `${userData.profilePic}`
              : assets.default_profile_pic
          }
          alt="User Pic"
          onError={(e) => (e.target.src = assets.default_profile_pic)}
        />
        <p>{userData.name || "Anonymous"}</p>
      </div>
      <div className="rating-date">
        <ul className="rating">
          <li>{rating}</li>
          <svg xmlns="http://www.w3.org/2000/svg" height="15px" viewBox="0 -960 960 960" width="15px" fill="#fff">
            <path d="m384-334 96-74 96 74-36-122 90-64H518l-38-124-38 124H330l90 64-36 122ZM233-120l93-304L80-600h304l96-320 96 320h304L634-424l93 304-247-188-247 188Zm247-369Z" />
          </svg>
        </ul>
        <span>Review</span>
        <p>{formatReviewDate(createdAt)}</p>
      </div>
      <div className="comment">{comment || "No comment"}</div>
    </div>
  );
};

export default Reviews;


// import React,{useContext} from 'react'
// import './Reviews.css'
// import { StoreContext } from "../context/StoreContext";

// const Reviews = ({user,targetId,rating,comment,createdAt}) => {
//    const { url} =
//     useContext(StoreContext);


//   const userDetails =async () => {
//     const response = await fetch(`${url}/api/userProfile/getUserProfilePicAndName/${user}`);
//     const data = await response.json();
//     if (data.success) {
//       return data.user;
//     } else {
//       console.error("Failed to fetch user details");
//       return null;
//     }
//   }
//   const userData = userDetails();


//   return (
//     <div>
//         <div className="review-container">
//             <div className="user-details">
//                 <img src="" alt="" />
//                 <p>name</p>
//             </div>
//             <div className="rating-date">
//                 <ul className="rating">
//               <li>{rating}</li>
//               <svg xmlns="http://www.w3.org/2000/svg" height="15px" viewBox="0 -960 960 960" width="15px" fill="#fff"><path d="m384-334 96-74 96 74-36-122 90-64H518l-38-124-38 124H330l90 64-36 122ZM233-120l93-304L80-600h304l96-320 96 320h304L634-424l93 304-247-188-247 188Zm247-369Z"/></svg>
//               {/* ⭐  */}
//               </ul>
//               DELIVERY
//               <p>{createdAt}</p>
//             </div>
//             <div className="comment">{comment||"No comment"}</div>
//         </div>
      
//     </div>
//   )
// }

// export default Reviews
