import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import Tesseract from "tesseract.js";
import "./Home.css";
import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const genAI = new GoogleGenerativeAI("AIzaSyAgq0yvib3_NNgeliiaVeSJa8rN4deQUyo");
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const [imagePreview, setImagePreview] = useState(null);
  const [extractedText, setExtractedText] = useState(""); // State to hold extracted text
  const [isExtracting, setIsExtracting] = useState(false); // State to track image extraction
  const [points, setPoints] = useState([]);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false); // State for summary generation
  const [loading, setLoading] = useState(false); // Loading state for job storage
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.clear();
  }, []);

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
      extractTextFromImage(file); // Extract text when the image is dropped
      return () => URL.revokeObjectURL(imgUrl);
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

  const generateContent = async () => {
    setIsGeneratingSummary(true); // Show loader for summary generation
    const prompt = `
      give the title of jobs which this resume can apply for (just only the keywords no desc no extra points nothing just keywords) any 5 don't give numbering only asterisks per point and no desc
      ${extractedText}
    `;

    try {
      const result = await model.generateContent(prompt);
      const responseText = await result.response.text(); // Get the generated response

      // Split the response into lines and filter out empty lines
      const points = responseText
        .split("*")
        .filter((line) => line.trim() !== "");

      setPoints(points);
      setExtractedText(points);
      console.log(points);
    } catch (error) {
      console.error("Error generating content:", error);
    } finally {
      setIsGeneratingSummary(false); // Hide loader after generation is done
    }
  };

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
        {/* Loader for Extracting Text */}
        {isExtracting && (
          <div className="loadingscreen"></div>
        )}

        {/* Loader for Generating Summary */}
        {isGeneratingSummary && (
          <div className="loader"></div> // The loader will be displayed here
        )}

        {/* Buttons (disabled during loading) */}
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
