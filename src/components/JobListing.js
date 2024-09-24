import React from 'react';
import './JobListing.css';
import { Link } from 'react-router-dom';
const JobListing = () => {
  return (
    <div className="job-listing-container">
      <div className="job-card">
        <div className="job-header">
          <h2 className="job-title">Software Engineer</h2>
          <p className="company-name">TechCorp</p>
          <span className="location">San Francisco, CA</span>
        </div>
        <div className="job-info">
          <div className="job-details">
            <p><strong>Salary:</strong> $120,000 - $140,000</p>
            <p><strong>Job Type:</strong> Full-Time</p>
          </div>
          <div className="job-rating">
            <span>Rating:</span>
            <span className="rating-value">4.5/5</span>
          </div>
        </div>
        <div className="job-description">
          <h3>Description</h3>
          <p>
            We are looking for a skilled Software Engineer to join our team. You will be working on the latest technologies to build scalable applications. If you're passionate about coding, this is the right place for you.
          </p>
        </div>
        <div className="apply-section">
          <a href="https://apply-link.com" className="apply-button">Apply Now</a>
        </div>
      </div>
      <div className="buttons-container">
          <Link to="/">
            <button className="nav-button">⌂</button>
          </Link>
          <Link to="/JobListing">
            <button className="nav-button" id='s_btn'>1</button>
          </Link>
          <Link to="/page3">
            <button className="nav-button">2</button>
          </Link>
        </div>
    </div>
  );
};

export default JobListing;
