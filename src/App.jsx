import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Header from './Components/Header';
import Footer from './Components/Footer';
import Homepage from './Pages/Homepage';
import './App.css'
import { ToastContainer } from 'react-toastify';
import Team from './Pages/Team';
import ContactUs from './Pages/ContactUs';


function App() {

  return (
    <>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/view/:id" element={<Homepage />} />
          <Route path="/team" element={<Team />} />
          <Route path="/contact-us" element={<ContactUs />} />
        </Routes>
        <Footer />

      </Router>

      <ToastContainer className="z-[999999]" />
    </>
  )
}

export default App
