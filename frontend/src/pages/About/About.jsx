import React from 'react';
import "./About.css";

export default function About() {
  return (
    <div className="container-about">
      <h1>About Us</h1>
      <p><strong>GharWaliDukan</strong> is a platform where you can buy food from your near by shop </p>
      
      <p>Our website provide easy <strong>Shop Creation</strong>,method where you can take your orders online and served them online delivery boy or ofline mode that youi want  </p>
      
      <p>Currently, this website serves as a project to showcase full-stack web development skills, demonstrating expertise in frontend and backend technologies.</p>
      
      <button type="button" className="btn btn-primary">
        <a href="https://github.com/SachinRajput02/NewsDarshan" target="_blank" rel="noopener noreferrer">
          GitHub Code
        </a>
      </button>
    </div>
  );
}
