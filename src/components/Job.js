// Job.js
import React, { useEffect, useState } from 'react';
import { FaStar, FaExternalLinkAlt } from 'react-icons/fa'; 
import './Job.css'; 

const Job = () => {
  const [jobResults, setJobResults] = useState([]);
  const [selectedJobIndex, setSelectedJobIndex] = useState(null);

  useEffect(() => {
    const storedJobs = localStorage.getItem("jobs");
    if (storedJobs) {
      const parsedJobs = JSON.parse(storedJobs).job_results;
      setJobResults(parsedJobs);
    }
  }, []);

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FaStar key={i} className={`inline-block ${i <= rating ? "text-yellow-400" : "text-gray-300"}`} />
      );
    }
    return stars;
  };

  const handleReadMoreClick = (index) => {
    setSelectedJobIndex(selectedJobIndex === index ? null : index);
  };

  return (
    <div className="p-4 md:p-8 lg:p-12">
      <h1 className="text-5xl text-center font-bold mb-4 text-purple-700">Job <span className="text-5xl text-center font-bold mb-4 text-purple-100">Listings</span></h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {jobResults.length > 0 ? (
          jobResults.map((job, index) => (
            <div key={index} className={`bg-black-900 border border-purple-800 rounded-lg p-6 transition-transform duration-300 ${selectedJobIndex === index ? 'scale-105' : ''}`}>
              <h2 className="text-xl font-semibold">{job[0]}</h2> {/* positionName */}
              <p className="text-gray-600"><strong>Company:</strong> {job[3]}</p> {/* company */}
              <p className="text-gray-600"><strong>Location:</strong> {job[4]}</p> {/* location */}
              <p className="flex items-center">
                <strong className="mr-1">Rating:</strong>
                {renderStars(job[5])} {/* rating */}
                <span className="text-gray-600 ml-2">({job[5]})</span>
              </p>
              <ReadMoreDescription description={job[6]} isExpanded={selectedJobIndex === index} onToggle={() => handleReadMoreClick(index)} /> {/* description */}
              <a href={job[7]} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center text-pink-500 hover:text-purple-700 transition">
                Apply <FaExternalLinkAlt className="ml-1" />
              </a>
            </div>
          ))
        ) : (
          <p className="nodataavailable">No job data available! 😥</p>
        )}
      </div>
    </div>
  );
};

const ReadMoreDescription = ({ description, isExpanded, onToggle }) => {
  return (
    <div className="mt-4">
      <p className="text-gray-400">
        {isExpanded ? description : `${description.substring(0, 100)}...`}
        <span onClick={onToggle} className="text-purple-500 cursor-pointer hover:underline ml-1">
          {isExpanded ? " Show Less" : " Read More"}
        </span>
      </p>
    </div>
  );
};

export default Job;
