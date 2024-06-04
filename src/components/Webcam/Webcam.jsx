import React, { useState, useCallback, useRef } from "react";
import Webcam from "react-webcam";
import axios from "axios";

const videoConstraints = {
  width: 240,
  height: 280,
  facingMode: { exact: "environment" },
};

export const WebcamCapture = () => {
  const [image, setImage] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [apiResponse, setApiResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Loading state to handle UI during network request
  const webcamRef = useRef(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
  }, [webcamRef]);

  const handleSubmit = async () => {
    if (!image) {
      alert("No image captured.");
      return;
    }

    setIsLoading(true); // Start loading
    try {
      const base64Response = await fetch(image);
      const blob = await base64Response.blob();
      const formData = new FormData();
      formData.append("image", blob, "captured-image.jpg");

      const response = await axios.post(
        "https://85a7-34-32-194-219.ngrok-free.app/predict",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setApiResponse(response.data);
      setImageUrl(image);
      alert("Image submitted successfully!");
    } catch (error) {
      console.error("Error posting the image:", error);
      if (error.response) {
        alert(
          "Failed to submit the image. Server responded with an error: " +
            error.response.data.message
        );
      } else {
        alert(
          "Failed to submit the image. Please check your network connection."
        );
      }
    }
    setIsLoading(false); // Stop loading regardless of the result
  };

  return (
    <div className="webcam-container">
      <div className="webcam-img">
        {image ? (
          <img src={image} alt="Captured" />
        ) : (
          <Webcam
            audio={false}
            height={280}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width={240}
            videoConstraints={videoConstraints}
          />
        )}
      </div>
      <div>
        {image ? (
          <>
            <button onClick={() => setImage("")} className="webcam-btn">
              Retake Image
            </button>
            <button
              onClick={handleSubmit}
              className="webcam-btn"
              disabled={isLoading}
            >
              {isLoading ? "Submitting..." : "Submit Image"}
            </button>
          </>
        ) : (
          <button onClick={capture} className="webcam-btn">
            Capture
          </button>
        )}
      </div>
      {imageUrl && (
        <div>
          <h2>Posted Image:</h2>
          <img src={imageUrl} alt="Uploaded" style={{ maxWidth: "100%" }} />
        </div>
      )}
      {apiResponse && (
        <div>
          <h2>Predictions:</h2>
          {apiResponse.prediction.class === "brown_streak" ? (
            <p className="disease-danger">Affected!</p>
          ) : (
            <p className="disease-safe">Healthy</p>
          )}
          <p>Confidence: {apiResponse.prediction.confidence}%</p>
        </div>
      )}
    </div>
  );
};
