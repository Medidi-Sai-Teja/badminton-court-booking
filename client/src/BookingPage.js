import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';



const BookingPage = () => {
  const [courtNumber, setCourtNumber] = useState('');
  const [matchDate, setMatchDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  const getCurrentDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };


  const handleSubmit = (event) => {
    event.preventDefault();
  
    const matchDay = new Date(matchDate).toLocaleDateString('en-US', { weekday: 'long' });

    if (!courtNumber || !matchDate || !timeSlot) {
      setErrorMessage('Please fill all fields!!');
      return;
    }
    if(matchDay === "Sunday"){
      setErrorMessage("Batminton Court is closed on Sundays!! Please book for working days!");
      return;
    }


    const newBooking = {
      courtNumber,
      matchDate,
      timeSlot,
    };

    
    console.log(newBooking);
    axios
      .post('http://localhost:5000/bookings', newBooking)
      .then((response) => {
        console.log(response.data);
        setCourtNumber('');
        setMatchDate('');
        setTimeSlot('');
        setErrorMessage('');

        console.log(response.data.message);
        alert(response.data.message);
      })
      .catch((error) => { 
        console.log(error);
        alert(error.response.data.error);
      });
  };
  return (
    <div className="container">
      <h1>Booking Page</h1>
      {errorMessage && <p className="alert alert-danger">{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
      

        <div className="mb-3">
          <label className="form-label">Court Number:</label>
          <select
            className="form-select"
            value={courtNumber}
            onChange={(event) => setCourtNumber(event.target.value)}
          >
            <option value="">Select Court Number</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
          </select>
        </div>
 
        <div className="mb-3">
          <label className="form-label">Match Date:</label>
          <input
            type="date"
            className="form-control"
            value={matchDate}
            onChange={(event) => setMatchDate(event.target.value)}
            min={getCurrentDate()}
          />
        </div> 


        <div className="mb-3">
          <label className="form-label">Time Slot:</label>
          <select
            className="form-select"
            value={timeSlot}
            onChange={(event) => setTimeSlot(event.target.value)}
          >
            <option value="">Select a time slot</option>
            <option value="03:45-04:30">03:45-04:30</option>
            <option value="04:30-05:30">04:30-05:30</option>
            <option value="02:30-03:45">02:30-03:45</option>
          </select>
        </div>
        
        <button type="submit" className="btn btn-primary">
          Book Now
        </button>
      </form>
    </div>
  );
  };
  
  export default BookingPage;