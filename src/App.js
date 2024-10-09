import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import JobListing from './components/JobListing';
import Contact from './components/Contact';
import Job from './components/Job';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/JobListing" element={<JobListing />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/job" element={<Job />} />
      </Routes>
    </Router>
  );
};

export default App;
