import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone"; // Import useDropzone from react-dropzone
import Tesseract from "tesseract.js"; // Import Tesseract.js
import "./Home.css";
import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from 'axios';
//hello punit
const Home = () => {
  const genAI = new GoogleGenerativeAI(
    "AIzaSyAgq0yvib3_NNgeliiaVeSJa8rN4deQUyo"
  ); // Use your actual API key
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const [imagePreview, setImagePreview] = useState(null);
  const [extractedText, setExtractedText] = useState(""); // State to hold extracted text
  const [isExtracting, setIsExtracting] = useState(false); // State to track extraction status
  const [points,setpoints]=useState([]);

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






  //this for connecting to python backend
  useEffect(() => {
    const sendPoints = async () => {
      try {
        const response = await axios.post(
          'http://localhost:5000/extract-text',
          { points }, // Send points array as JSON
          {
            headers: { 'Content-Type': 'application/json' },
          }
        );
        console.log('Text extracted:', response.data);
        console.log('Points sent:', points);
      } catch (error) {
        console.error('Error sending points:', error);
      }
    };
  
    if (points.length > 0) { // Ensure we only send if points are populated
      sendPoints();
    }
  }, [points]);
  
  











  // useEffect to update localStorage when imagePreview changes
  useEffect(() => {
    if (imagePreview) {
      localStorage.setItem("imagePreview", imagePreview); // Save to localStorage
    } else {
      localStorage.removeItem("imagePreview"); // Clear if no image preview
    }
  }, [imagePreview]);

  const generateContent = async () => {
    const prompt = `
      give the title of jobs which this resume can apply for (just only the keywords no desc no extra points nothing just keywords) any 5 don't give numbering only asteriks per point and no desc
      ${extractedText}
    `;

    try {
      const result = await model.generateContent(prompt);
      const responseText = result.response.text(); // Get the generated response

      // Split the response into lines and filter out empty lines
      const points = responseText
        .split("*")
        .filter((line) => line.trim() !== "");

      setpoints(points);

      // Update state with the list of keywords
      setExtractedText(points);
      console.log(points);
    } catch (error) {
      console.error("Error generating content:", error);
    }
  };

  // Set up the dropzone
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div className="container">
      <h1 className="h1_top">
        <span className="parta">Career</span><span className="partb">Bridge</span>
        
      </h1>
      <div className="content">
        <div className="button-85">
          <h2>Image Uploader</h2>
          <br />
          {/* Drag and Drop Area */}
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

        <div className="button-85">
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
        <button
          className="button-901"
          id="processButton"
          onClick={generateContent}
          disabled={isExtracting} // Disable button if extracting text
        >
          Generate Summary
        </button>
        <button
          className="button-901"
        >
          Find Jobs
        </button>
      </div>
      <br />
    </div>
  );
};

export default Home;
