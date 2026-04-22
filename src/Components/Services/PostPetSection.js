import React, { useState, useEffect } from "react";
import Notification from "../UI/Notification";
import postPet from "./images/postPet.png";

const PostPetSection = () => {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [area, setArea] = useState("");
  const [justification, setJustification] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [formError, setFormError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [ageError, setAgeError] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [notification, setNotification] = useState(null);
  const [type, setType] = useState("None");
  const [picture, setPicture] = useState(null);
  const [fileName, setFileName] = useState("");
  const [medicalReport, setMedicalReport] = useState(null);
  const [medicalFileName, setMedicalFileName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); 
  const endpoint = process.env.REACT_APP_BASE_URL;
  useEffect(() => {
    if (!isSubmitting) {
      setEmailError(false);
      setAgeError(false);
      setFormError(false);
    }
  }, [isSubmitting]);

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  const isEmailValid = (email) => {
    const emailPattern = /^[a-zA-Z0-9._-]+@gmail\.com$/;
    return emailPattern.test(email);
  };

  const handlePictureChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setPicture(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  const handleMedicalReportChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setMedicalReport(selectedFile);
      setMedicalFileName(selectedFile.name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !name ||
      !age ||
      !area ||
      !justification ||
      !email ||
      !phone ||
      !fileName ||
      !medicalFileName ||
      type === "None" ||
      ageError
    ) {
      setFormError(true);
      return;
    }

    if (!isEmailValid(email)) {
      setEmailError(true);
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("age", age);
    formData.append("area", area);
    formData.append("justification", justification);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("type", type);

    if (picture) {
      formData.append("picture", picture);
    }

    if (medicalReport) {
      formData.append("medicalReport", medicalReport);
    }

    try {
      const response = await fetch(`${endpoint}/services`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      // console.log("Form submitted successfully");

      setEmailError(false);
      setFormError(false);
      setName("");
      setAge("");
      setArea("");
      setMedicalReport(null);
      setMedicalFileName("");
      setJustification("");
      setEmail("");
      setPhone("");
      setPicture(null);
      setFileName("");
      // show modern notification instead of old popup
      setNotification("Application Submitted; we'll get in touch with you soon.");
      // keep legacy popup state for compatibility (not used)
      setShowPopup(false);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <section className="post-pet-section">
      <h2>Post a Pet for Adoption</h2>
      <img src={postPet} alt="Pet Looking for a Home" />

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="input-box">
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="input-box">
          <label>Pet Age:</label>
          <input
            type="text"
            value={age}
            onChange={(e) => {setAge(e.target.value);}}
          />
        </div>

        <div className="input-box">
          <label>Picture:</label>
          <label className="post-report-pictue">
            <span className="file-input-text">
              {fileName || "Choose a Picture"}
            </span>
            <input
              className="file-input"
              type="file"
              accept="image/*"
              onChange={handlePictureChange}
            />
          </label>
        </div>

        <div className="input-box">
          <label>Location:</label>
          <input
            type="text"
            value={area}
            onChange={(e) => setArea(e.target.value)}
          />
        </div>

        {/* <div className="filter-selection-service"> */}
        <div className="input-box">
          <label >Type:</label>
          
          <select
            value={type}
            onChange={(event) => setType(event.target.value)}
          >
            <option value="None">None</option>
            <option value="Dog">Dog</option>
            <option value="Cat">Cat</option>
            <option value="Rabbit">Rabbit</option>
            <option value="Bird">Bird</option>
            <option value="Fish">Fish</option>
            <option value="Other">Other</option>
          </select>
          
        </div>

        

        <h3>Contact Information</h3>

        <div className="input-box">
          <label>Email:</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="input-box">
          <label>Ph.No:</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div className="input-box">
          <label>Description:</label>
          <textarea
            rows="4"
            value={justification}
            onChange={(e) => setJustification(e.target.value)}
            placeholder="Care Requirements , Adoption Requirements , Diet Plan , Special Needs , Follow up Conditions etc..... "
          ></textarea>
        </div>
        <div className="input-box">
          <label>Medical Report:</label>
          <label className="post-report-pictue">
            <span className="file-input-text">
              {medicalFileName || "Upload  Report"}
            </span>
            <input
              className="file-input"
              type="file"
              accept="image/*"
              onChange={handleMedicalReportChange}
            />
          </label>
        </div>

        {emailError && (
          <p className="error-message">Please provide a valid email address.</p>
        )}
        {formError && (
          <p className="error-message">Please fill out all fields correctly.</p>
        )}

        <button type="submit" className="cta-button-pps" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Your Pet"}
        </button>

        {notification && (
          <Notification
            message={notification}
            type="success"
            duration={4500}
            onClose={() => setNotification(null)}
          />
        )}
      </form>
    </section>
  );
};

export default PostPetSection;
