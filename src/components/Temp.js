import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone"; // Import useDropzone from react-dropzone
import Tesseract from "tesseract.js"; // Import Tesseract.js
import "./Home.css";
import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate for routing

const Home = () => {
  const genAI = new GoogleGenerativeAI(
    "AIzaSyAgq0yvib3_NNgeliiaVeSJa8rN4deQUyo"
  ); // Use your actual API key
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const [imagePreview, setImagePreview] = useState(null);
  const [extractedText, setExtractedText] = useState(""); // State to hold extracted text
  const [isExtracting, setIsExtracting] = useState(false); // State to track extraction status
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [points, setPoints] = useState([]);
  const [loading, setLoading] = useState(false); // Loading state for job storage
  const navigate = useNavigate(); // Initialize navigate for programmatic routing

  useEffect(() => {
    localStorage.clear();
  }, []);

  // Restore image preview from localStorage when component mounts
  useEffect(() => {
    const storedImagePreview = localStorage.getItem("imagePreview");
    if (storedImagePreview) {
      setImagePreview(storedImagePreview);
    }
  }, []);

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0]; // Get the first dropped file
    if (file) {
      const imgUrl = URL.createObjectURL(file);
      setImagePreview(imgUrl);

      // Automatically extract text from the image using Tesseract.js
      extractTextFromImage(file);

      return () => URL.revokeObjectURL(imgUrl); // Cleanup the object URL
    }
  };

  const extractTextFromImage = (file) => {
    setIsExtracting(true); // Set extracting status to true
    Tesseract.recognize(file, "eng", {
      logger: (info) => console.log(info), // Log progress
    })
      .then(({ data: { text } }) => {
        console.log("Extracted Text:", text);
        setExtractedText(text); // Set the extracted text to state
      })
      .catch((err) => {
        console.error("Error extracting text:", err);
        setExtractedText("Error extracting text.");
      })
      .finally(() => {
        setIsExtracting(false); // Set extracting status to false once done
      });
  };

  useEffect(() => {
    const sendPoints = async () => {
      try {
        setLoading(true); // Start loading when sending points
        const response = await axios.post(
          "https://fdsbackend.onrender.com/extract-text",
          { points }, // Send points array as JSON
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        console.log("Text extracted:", response.data);
        
        const jobsData = JSON.stringify(response.data); // Convert to string
        localStorage.setItem("jobs", jobsData); // Store in localStorage
        console.log("Jobs successfully stored in localStorage");
  
        setLoading(false); // Stop loading when jobs are stored
        navigate("/job"); // Redirect to job page after completion
      } catch (error) {
        console.error("Error sending points:", error);
        setLoading(false); // Stop loading in case of error
      }
    };
  
    if (points.length > 0) {
      sendPoints();
    }
  }, [points, navigate]);
  

  // useEffect to update localStorage when imagePreview changes
  useEffect(() => {
    if (imagePreview) {
      localStorage.setItem("imagePreview", imagePreview); // Save to localStorage
    } else {
      localStorage.removeItem("imagePreview"); // Clear if no image preview
    }
  }, [imagePreview]);

  const generateContent = async () => {
    setIsGeneratingSummary(true);
    const prompt = `give the title of jobs which this resume can apply for (just only the keywords no desc no extra points nothing just keywords) any 5 don't give numbering only asterisks per point and no desc
      ${extractedText}`;
    try {
      const result = await model.generateContent(prompt);
      const responseText = await result.response.text(); // Properly await the response
  
      // Split the response into lines and filter out empty lines
      const generatedPoints = responseText
        .split("*")
        .filter((line) => line.trim() !== ""); // Filter empty lines
  
      setPoints(generatedPoints); // Update the points state
      setExtractedText(generatedPoints); // Store the result in extractedText too
  
      // Store generated points in localStorage
      const pointsToStore = JSON.stringify(generatedPoints);
      localStorage.setItem("jobs", pointsToStore); // Store jobs in local storage
      console.log("Jobs stored in localStorage:", pointsToStore); // Debugging console log
    } catch (error) {
      console.error("Error generating content:", error);
    } finally {
      setIsGeneratingSummary(false); // Hide loader after generation is done
    }
  };
  

  // Set up the dropzone
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div className="container">
      <h1 className="h1_top">
        <span className="parta">Career</span>
        <span className="partb">Bridge</span>
      </h1>
      <div className="content">
        <div className="button-85 adjheight">
          <h2>Image Uploader</h2>
          <br />
          <div {...getRootProps({ className: "dropzone" })}>
            <input {...getInputProps()} />
            <p>Drag 'n' drop some files here, or click to select files</p>
          </div>
          <br />
          <br />
          <div className="image-preview button-85">
            {imagePreview && <img src={imagePreview} alt="Preview" />}
          </div>
        </div>

        <div className="button-85 adjheight">
          <h2>AI Summary</h2>
          <br />
          {Array.isArray(extractedText) && extractedText.length > 0 ? (
            extractedText.map((point, index) => (
              <div className="design" key={index}>
                {point}
              </div>
            ))
          ) : (
            <li>This is where the AI-generated summary will appear.</li>
          )}
        </div>
      </div>

      <div className="flexi">
        {isExtracting && (
          <div className="loadingscreen"></div>
        )}

        {isGeneratingSummary && (
          <div className="loader"></div> // The loader will be displayed here
        )}
        {!isExtracting && !isGeneratingSummary && (
          <>
            <button
              className="button-901"
              id="processButton"
              onClick={generateContent}
              disabled={isExtracting} // Disable if extracting
            >
              Generate Summary
            </button>
            <button className="button-901" onClick={() => navigate("/job")}>
              Find Jobs
            </button>
          </>
        )}
      </div>
      <br />
    </div>
  );
};

export default Home;
