import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Components/NavBar/Navbar";
import Home from "./Components/Home/Home";
import Footer from "./Components/Footer/Footer";
import Services from "./Components/Services/Services";
import Contact from "./Components/Contact/Contact";
import Pets from "./Components/Pets/Pets";
import AdoptForm from "./Components/AdoptForm/AdoptForm";
import AdminLogin from "./Components/AdminPanel/AdminLogin";
import Community from "./Components/Community/Community";
import Chatbot from "./Components/Chatbot/Chatbot";
import "./App.css";
import HomePage from "./Components/auth/HomePage";

const Layout = ({ children }) => (
  <>
    <Navbar title="FindMyPet" />
    {children}
    <Footer title="FindMyPet" />
  </>
);

const App = () => {
  return (
    <Router>
      <Routes>
      <Route 
          path="/" 
          element={
            
             <HomePage/>
            
          } 
        />
        <Route 
          path="/home" 
          element={
            <Layout>
              <Home description="Ensure you are fully prepared to provide proper care and attention to your pet before welcoming them into your home." />
            </Layout>
          } 
        />
        <Route 
          path="/services" 
          element={
            <Layout>
              <Services />
            </Layout>
          } 
        />
        <Route 
          path="/contact" 
          element={
            <Layout>
              <Contact />
            </Layout>
          } 
        />
        <Route 
          path="/pets" 
          element={
            <Layout>
              <Pets />
            </Layout>
          } 
        />
        <Route 
          path="/community" 
          element={
            <Layout>
              <Community />
            </Layout>
          } 
        />
        <Route 
          path="/adopt-form" 
          element={
            <Layout>
              <AdoptForm />
            </Layout>
          } 
        />
        <Route 
          path="/admin" 
          element={<AdminLogin />} 
        />
        <Route 
          path="/chatbot" 
          element={
            <Layout>
              <Chatbot />
            </Layout>
          } 
        />
      </Routes>
    </Router>
  );
};

export default App;
