// components/ReviewModal.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Lawyer {
  id: string;
  name: string;
}

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (lawyerId: string, rating: number, review: string) => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [selectedLawyer, setSelectedLawyer] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      axios.get('http://localhost:8080/api/lawyers')
        .then((res) => setLawyers(res.data))
        .catch((err) => console.error('Failed to load lawyers:', err));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Leave a Review</h2>

        <label className="block text-sm font-medium mb-1">Select Lawyer</label>
        <select
          value={selectedLawyer}
          onChange={(e) => setSelectedLawyer(e.target.value)}
          className="w-full border rounded p-2 mb-4"
        >
          <option value="">-- Select --</option>
          {lawyers.map((lawyer) => (
            <option key={lawyer.id} value={lawyer.id}>
              {lawyer.name}
            </option>
          ))}
        </select>

        <label className="block text-sm font-medium mb-1">Rating</label>
        <select
          className="w-full border rounded p-2 mb-4"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
        >
          {[5, 4, 3, 2, 1].map((val) => (
            <option key={val} value={val}>{val} Star{val > 1 ? 's' : ''}</option>
          ))}
        </select>

        <label className="block text-sm font-medium mb-1">Comment</label>
        <textarea
          className="w-full border rounded p-2 h-24 mb-4"
          value={review}
          onChange={(e) => setReview(e.target.value)}
        />

        <div className="flex justify-end space-x-2">
          <button onClick={onClose} className="px-4 py-2 text-gray-700 hover:underline">Cancel</button>
          <button
            onClick={() => {
              if (!selectedLawyer) return alert("Please select a lawyer.");
              onSubmit(selectedLawyer, rating, review);
              onClose();
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
