
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DisplayBookings = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/bookings');
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  return (
    <div>
      <h2>Bookings:</h2>
      <table className="table">
        <thead className="thead-dark">
          <tr>
            <th scope="col">Student Name</th>
            <th scope="col">Student Section</th>
            <th scope="col">Court Number</th>
            <th scope="col">Match Date</th>
            <th scope="col">Time Slot</th>
            <th scope="col">Booking Date</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking._id}>
              <td>{booking.studentName}</td>
              <td>{booking.section}</td>
              <td>{booking.courtNumber}</td>
              <td>{booking.matchDate.substring(0, 10)}</td>
              <td>{booking.timeSlot}</td>
              <td>{booking.bookingDate.substring(0, 10)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DisplayBookings;