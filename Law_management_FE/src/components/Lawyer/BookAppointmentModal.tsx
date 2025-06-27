import React, { useState } from 'react';
import axios from 'axios';
import { Lawyer } from '../../types';

interface Props {
  lawyer: Lawyer;
  onClose: () => void;
  clientId: number; // Pass logged-in client ID
}

const BookAppointmentModal: React.FC<Props> = ({ lawyer, onClose, clientId }) => {
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [type, setType] = useState('video');
  const [notes, setNotes] = useState('');

  const handleBooking = async () => {
    try {
      const payload = {
        clientId,
        lawyerId: lawyer.id,
        type: type === 'chat' ? 'chat' : 'video', // ensures valid values only
        notes: notes ? [notes] : [],              // ✅ wrap note in array
        date,
        startTime,
        endTime,
        fee: lawyer.consultationFee,
      };
  
      const response = await axios.post('http://localhost:8080/api/appointments/book', payload);
      console.log('Appointment booked:', response.data);
      alert('Appointment successfully booked!');
      onClose();
    } catch (error) {
      console.error('Booking failed:', error);
      alert('Something went wrong. Please try again.');
    }
  };
  

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Book Consultation with {lawyer.name}
        </h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border px-3 py-2 rounded-md"
          />
        </div>

        <div className="mb-4 flex gap-4">
          <div className="w-1/2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full border px-3 py-2 rounded-md"
            />
          </div>
          <div className="w-1/2">
            <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full border px-3 py-2 rounded-md"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full border px-3 py-2 rounded-md"
          >
            <option value="chat">Chat</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full border px-3 py-2 rounded-md"
            rows={3}
          />
        </div>

        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={handleBooking}
            disabled={
              !date || !startTime || !endTime || !type || !lawyer?.consultationFee
            }
            
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Confirm Booking
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookAppointmentModal;
