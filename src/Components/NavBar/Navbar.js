import React from "react";
import { Link } from "react-router-dom";
import logo from "./images/logo.png";
import Cookies from "js-cookie";

import { Await, useNavigate } from 'react-router-dom';
const Navbar = (props) => {
  const navigate = useNavigate()
  const logoutHandler = () => {
    // localStorage.removeItem("userInfo");
    Cookies.remove("homegate-token", { path: "/" });
    navigate("/")
}
  return (
    <div className="navbar-container">
      <div>
        <Link className="logo-container" to="/">
          <img className="navbar-logo" src={logo} alt="HomeGate Logo" />
          <p>{props.title}</p>
        </Link>
      </div>
      <div>
        <ul className="navbar-links">
          <li>
            <Link to="/home">Home</Link>
          </li>
          <li>
            <Link to="/services">Services</Link>
          </li>
          <li>
            <Link to="/pets">Pets</Link>
          </li>
          <li>
            <Link to="/community">Community</Link>
          </li>
          <li>
            <Link to="/contact">Contact Us</Link>
          </li>
          <li>
            <Link to="/chatbot">AI Chatbot</Link>
          </li>
        </ul>
      </div>
      <div>
        <Link to="/services">
          <button className="Navbar-button">Give a Pet</button>
        </Link>
        
          <button className="Navbar-button2" onClick={logoutHandler}>Log Out</button>
    
      </div>
    </div>
  );
};

export default Navbar;
