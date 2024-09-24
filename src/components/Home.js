import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Home.css';
import { Link, useLocation } from 'react-router-dom';

const Home = () => {
  const [imagePreview, setImagePreview] = useState(null);
  const location = useLocation();

  // Restore image preview from localStorage when component mounts
  useEffect(() => {
    const storedImagePreview = localStorage.getItem('imagePreview');
    if (storedImagePreview) {
      setImagePreview(storedImagePreview);
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  const previewImage = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imgUrl = URL.createObjectURL(file);
      setImagePreview(imgUrl);

      // Automatically upload the image to Python backend for text extraction
      uploadImage(file);

      return () => URL.revokeObjectURL(imgUrl);
    }
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axios.post('http://localhost:5000/extract-text', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      console.log('Text extracted:', response.data);
    } catch (error) {
      console.error('Error extracting text:', error);
    }
  };

  // useEffect to update localStorage when imagePreview changes
  useEffect(() => {
    if (imagePreview) {
      localStorage.setItem('imagePreview', imagePreview);  // Save to localStorage
    } else {
      localStorage.removeItem('imagePreview');  // Clear if no image preview
    }
  });

  return (
    <div className="container">
      <h1 className='h1_top'>Jobs Finder</h1>
      <div className="content">
        <div className="uploader-section">
          <h2>Image Uploader</h2>
          <input type="file" accept="image/*" onChange={previewImage} />
          <div className="image-preview">
            {imagePreview && <img src={imagePreview} alt="Preview" />}
          </div>
        </div>

        <div className="ai-summary-section">
          <h2>AI Summary</h2>
          <p>This is where the AI-generated summary will appear.</p>
        </div>
      </div>
<p className='p_jobs_heading'>Recommended Jobs</p>
      {imagePreview && (
        <div className="buttons-container">
          <Link to="/">
            <button className="nav-button" id='f_btn'>⌂</button>
          </Link>
          <Link to="/JobListing">
            <button className="nav-button">1</button>
          </Link>
          <Link to="/page3">
            <button className="nav-button">2</button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Home;
