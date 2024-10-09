import React, { useEffect, useState } from 'react';
import { FaStar, FaExternalLinkAlt } from 'react-icons/fa'; // Importing icons from Font Awesome
import './Job.css'; // Make sure to import your CSS file

const Job = () => {
  const [jobResults, setJobResults] = useState([]);
  const [selectedJobIndex, setSelectedJobIndex] = useState(null);

  // Fetch job data from local storage on component mount
  useEffect(() => {
    const storedJobs = localStorage.getItem("jobs");
    if (storedJobs) {
      const parsedJobs = JSON.parse(storedJobs).job_results;
      setJobResults(parsedJobs);
    }
  }, []);

  // Function to display star rating
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FaStar key={i} color={i <= rating ? "#ffc107" : "#e4e5e9"} />
      );
    }
    return stars;
  };

  const handleReadMoreClick = (index) => {
    setSelectedJobIndex(selectedJobIndex === index ? null : index);
  };

  return (
    <div className="job-list">
      {jobResults.length > 0 ? (
        jobResults.map((job, index) => (
          <div key={index} className={`job-card ${selectedJobIndex === index ? 'active' : ''}`}>
            <h2 className="job-title">{job[0]}</h2> {/* positionName */}
            <p><strong>Company:</strong> {job[3]}</p> {/* company */}
            <p><strong>Location:</strong> {job[4]}</p> {/* location */}
            <p><strong>Rating:</strong> {renderStars(job[5])} ({job[5]})</p> {/* rating */}
            <ReadMoreDescription description={job[6]} isExpanded={selectedJobIndex === index} onToggle={() => handleReadMoreClick(index)} /> {/* description */}
            <a href={job[7]} target="_blank" rel="noopener noreferrer" className="apply-link">
              Apply <FaExternalLinkAlt />
            </a>
          </div>
        ))
      ) : (
        <p>No job data available</p>
      )}
    </div>
  );
};

// ReadMoreDescription Component
const ReadMoreDescription = ({ description, isExpanded, onToggle }) => {
  return (
    <div className="description">
      <p>
        {isExpanded ? description : `${description.substring(0, 100)}...`}
        <span onClick={onToggle} className="read-more">
          {isExpanded ? " Show Less" : " Read More"}
        </span>
      </p>
    </div>
  );
};

export default Job;
