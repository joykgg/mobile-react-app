import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./uploadImage.css";

const UploadImage = () => {
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [apiResponse, setApiResponse] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    setImageUrl(URL.createObjectURL(selectedFile)); // Create a URL for the selected image
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      alert("Please select an image file.");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await axios.post(
        "https://e339-35-233-190-208.ngrok-free.app/predict",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("API response:", response.data);
      setApiResponse(response.data); // Update the state with the API response
      alert("Image submitted successfully and analyzed.");
    } catch (error) {
      console.error("Error uploading image:", error);
      if (error.response) {
        // More specific error information if available
        alert(
          `Error uploading image: ${
            error.response.data.error || "Server error"
          }`
        );
      } else {
        alert("Error uploading image. Please check your network connection.");
      }
    }
  };

  return (
    <div className="home-container">
      <div className="container">
        <div className="text">
          <h1>Upload image</h1>
          <form onSubmit={handleSubmit}>
            <input type="file" onChange={handleFileChange} />
            <button type="submit">Submit</button>
          </form>
          {imageUrl && (
            <div>
              <h2>Posted Image:</h2>
              <img src={imageUrl} alt="Uploaded" style={{ maxWidth: "100%" }} />
            </div>
          )}
          {apiResponse && (
            <div>
              <h3>Model Prediction:</h3>
              {apiResponse.prediction.class === "brown_streak" ? (
                <p className="disease-danger">Affected!</p>
              ) : (
                <p className="disease-safe">Healthy</p>
              )}
              <p>Confidence: {apiResponse.prediction.confidence}%</p>
            </div>
          )}
          <Link to="/" className="chbtn">
            Take a Photo
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UploadImage;
