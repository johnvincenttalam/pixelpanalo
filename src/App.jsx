import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Form from "./pages/Form";
import Search from "./pages/Search";
import HowToPlay from "./pages/HowToPlay";
import ContactUs from "./pages/ContactUs";
import { ToastContainer, toast } from 'react-toastify';

const App = () => {
  return (
    <>
      <ToastContainer />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/checkout" element={<Form />} />
          <Route path="/search" element={<Search />} />
          <Route path="/how-to-play" element={<HowToPlay />} />
          <Route path="/contact-us" element={<ContactUs />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
