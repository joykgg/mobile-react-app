import React from "react";
import "./homeStyles.css";
import { Link } from "react-router-dom";
import { WebcamCapture } from "../Webcam/Webcam";

const Home = () => {
  return (
    <div className="home-container">
      <div className="container">
        <div className="text">
          <h1>Cassava Brown Streak Detector</h1>
          <form className="form" onSubmit={(e) => e.preventDefault()}>
            <WebcamCapture />
          </form>
          <Link to="/uploadImage" className="chbtn">
            Upload Image
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
