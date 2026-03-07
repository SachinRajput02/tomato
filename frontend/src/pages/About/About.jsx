import React from 'react';
import { useEffect } from "react";
import "./About.css";

export default function About() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="container-about" id='container-about'>
      <h1 id='about-us-heading'>About Us</h1>
      <p><strong>Tomato</strong> is a platform where you can buy food from your near by shop. </p>
      
      <p>Our website provide easy <strong>Shop Creation</strong>,method where you can take your orders online and served them online delivery boy or ofline mode which method you want.  </p>
      
      <p>Currently, this website created as a project to showcase full-stack web development skills, demonstrating expertise in frontend and backend technologies.</p>
      
      <button type="button" className="btn btn-primary">
        <a href="https://github.com/SachinRajput02/tomato" target="_blank" rel="noopener noreferrer">
          GitHub Code
        </a>
      </button>
    </div>
  );
}
