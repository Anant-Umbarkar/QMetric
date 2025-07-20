import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import LandingPage from "./components/pages/LandingPage";
import Components from "./components/Components";
import UploadPage from "./components/pages/UploadPage";
import Footer from "./components/Footer";
import ScrollToTop from './ScrollToTop';
import ResultPage from "./components/pages/ResultPage";
import "./App.css";
import "animate.css";

function App() {
  return (
    <div className="bg-black min-h-screen text-white">
      <Navbar />
      <ScrollToTop/>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/upload" element={< UploadPage/>} />
        <Route path="/components" element={<Components />} />
        <Route path="/result" element={<ResultPage/>} />
      </Routes>
      <Footer/>
    </div>
  );
}

export default App;
