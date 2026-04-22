import React, { useState } from 'react';
import AdoptForm from '../AdoptForm/AdoptForm';
import { formatDistanceToNow } from 'date-fns';

const PetsViewer = (props) => {
  const [showPopup, setShowPopup] = useState(false);
  const endpoint = process.env.REACT_APP_BASE_URL;
  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  const formatTimeAgo = (updatedAt) => {
    const date = new Date(updatedAt);
    return formatDistanceToNow(date, { addSuffix: true });
  };

  return (
    <div className='pet-view-card'>
      <div className='pet-card-pic'>
        <img src={`${endpoint}/images/${props.pet.filename}`} alt={props.pet.name} />
      </div>
      <div className='pet-card-details'>
        <h2>{props.pet.name}</h2>
        <p><b>Type:</b> {props.pet.type}</p>
        <p><b>Age:</b> {props.pet.age}</p>
        <p><b>Location:</b> {props.pet.area}</p>
        <p><b>Posted by:</b> {formatTimeAgo(props.pet.updatedAt)}</p>
        
        <div className='contact-info'>
          <p><b>Contact Info:</b></p>
          <p>📧 <a href={`mailto:${props.pet.email}`}>{props.pet.email}</a></p>
          <p>📱 <a href={`tel:${props.pet.phone}`}>{props.pet.phone}</a></p>
        </div>
      </div>
      <div className='show-interest-btn'>
        <button onClick={togglePopup}>Show Interest <i className="fa fa-paw"></i></button>
      </div>
      {showPopup && (
        <div className='popup'>
          <div className='popup-content'>
            <AdoptForm closeForm={togglePopup} pet={props.pet}/>
          </div>
          <button onClick={togglePopup} className='close-btn'>
            Close <i className="fa fa-times"></i>
          </button>
        </div>
      )}
    </div>
  );
};

export default PetsViewer;
