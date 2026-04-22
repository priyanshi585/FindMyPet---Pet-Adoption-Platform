import React, { useState } from "react";
import Notification from "../UI/Notification";

function AdoptForm(props) {
  const [email, setEmail] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [livingSituation, setLivingSituation] = useState("");
  const [previousExperience, setPreviousExperience] = useState("");
  const [familyComposition, setFamilyComposition] = useState("");
  const [formError, setFormError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [ErrPopup, setErrPopup] = useState(false);
  const [SuccPopup, setSuccPopup] = useState(false);
  const [notification, setNotification] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const endpoint = process.env.REACT_APP_BASE_URL;
  const isEmailValid = (email) => {
    const emailPattern = /^[a-zA-Z0-9._-]+@gmail\.com$/;
    return emailPattern.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailError(false);

    if (
      !email ||
      !phoneNo ||
      !livingSituation ||
      !previousExperience ||
      !familyComposition
    ) {
      setFormError(true);
      return;
    }

    if (!isEmailValid(email)) {
      setEmailError(true);
      return;
    }

    try {

      setIsSubmitting(true)

      const response = await fetch(`${endpoint}/form/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          phoneNo,
          livingSituation,
          previousExperience,
          familyComposition,
          petId: props.pet._id
        })
      })

      if (!response.ok) {
        setNotification({ message: "Oops!... Connection Error.", type: "error" });
        return;
      } else {
        setNotification({ 
          message: `Adoption Form of ${props.pet.name} is Submitted; we'll get in touch with you soon for further process.`,
          type: "success",
          onClose: () => props.closeForm()
        });
      }
    }
    catch (err) {
      setNotification({ message: "Oops!... Connection Error.", type: "error" });
      console.error(err);
      return;
    } finally {
      setIsSubmitting(false)

    }

    setEmailError(false);
    setFormError(false);
    setEmail("");
    setPhoneNo("");
    setLivingSituation("");
    setPreviousExperience("");
    setFamilyComposition("");
  };

  return (
    <div className="custom-adopt-form-container">
      <h2 className="custom-form-heading">Pet Adoption Application</h2>
      <div className="form-pet-container">
        <div className="pet-details">
          <div className="pet-pic">
            <img src={`${endpoint}/images/${props.pet.filename}`} alt={props.pet.name} />
          </div>
          <div className="pet-info">
            <h2>{props.pet.name}</h2>
            <p>
              <b>Type:</b> {props.pet.type}
            </p>
            <p>
              <b>Age:</b> {props.pet.age}
            </p>
            <p>
              <b>Location:</b> {props.pet.location}
            </p>
          </div>
        </div>
        <div className="form-div">
          <form onSubmit={handleSubmit} className="custom-form">
            <div className="custom-input-box">
              <div className="email-not-valid">
                <label className="custom-label">Email:</label>
                {emailError && (
                  <p>
                    Please provide valid email address.
                  </p>
                )}
              </div>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="custom-input"
              />
            </div>
            <div className="custom-input-box">
              <label className="custom-label">Phone No.</label>
              <input
                type="text"
                value={phoneNo}
                onChange={(e) => setPhoneNo(e.target.value)}
                className="custom-input"
              />
            </div>
            <div className="custom-input-box">
              <label className="custom-label">Pet Living Situation:</label>
              <input
                type="text"
                value={livingSituation}
                onChange={(e) => setLivingSituation(e.target.value)}
                className="custom-input"
              />
            </div>
            <div className="custom-input-box">
              <label className="custom-label">Previous Pet Experience:</label>
              <input
                type="text"
                value={previousExperience}
                onChange={(e) => setPreviousExperience(e.target.value)}
                className="custom-input"
              />
            </div>
            <div className="custom-input-box">
              <label className="custom-label">Any Other Pets:</label>
              <input
                type="text"
                value={familyComposition}
                onChange={(e) => setFamilyComposition(e.target.value)}
                className="custom-input"
              />
            </div>
            {formError && (
              <p className="error-message">Please fill out all fields.</p>
            )}
            <button disabled={isSubmitting} type="submit" className="custom-cta-button custom-m-b">
              {isSubmitting ? 'Submitting' : 'Submit'}
            </button>
            {notification && (
              <Notification
                message={notification.message}
                type={notification.type}
                duration={notification.type === "error" ? 4000 : 4500}
                onClose={() => {
                  setNotification(null);
                  if (notification.onClose) notification.onClose();
                }}
              />
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdoptForm;
