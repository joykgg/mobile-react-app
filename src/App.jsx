import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import "./App.css";
import Home from "./components/Home/Home";
import UploadImage from "./components/uploadImage/UploadImage";
import Footer from "./components/Footer";

function App() {
  return (
    <Router>
      <>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/uploadImage" element={<UploadImage />} />
        </Routes>

        <Footer />
      </>
    </Router>
  );
}

export default App;
