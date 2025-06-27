import React, { useState } from 'react';
import { MapPin, Clock, DollarSign } from 'lucide-react';
import { Lawyer } from '../../types';
import LawyerProfileModal from './LawyerProfileModal';
import BookAppointmentModal from './BookAppointmentModal';
import { useAuth } from '../../context/AuthContext';

interface LawyerCardProps {
  lawyer: Lawyer;
  onBookConsultation: (lawyer: Lawyer) => void;
}

const LawyerCard: React.FC<LawyerCardProps> = ({
  lawyer,
  onBookConsultation
}) => {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);

  return (
    <>
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <img
              src={
                lawyer.avatar ||
                `https://images.pexels.com/photos/5668473/pexels-photo-5668473.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop`
              }
              alt={lawyer.name}
              className="w-16 h-16 rounded-full object-cover"
            />
            {lawyer.isVerified && (
              <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full mt-2 text-center">
                Verified
              </div>
            )}
          </div>

          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">{lawyer.name}</h3>
            <p className="text-gray-600 text-sm">{lawyer.specializations.join(', ')}</p>

            <div className="mt-3 space-y-2">
              <div className="flex items-center text-sm text-gray-700">
                <span className="bg-red-100 p-1 rounded-full mr-2">
                  <MapPin className="h-4 w-4 text-red-500" />
                </span>
                {lawyer.location}
              </div>
              <div className="flex items-center text-sm text-gray-700">
                <span className="bg-yellow-100 p-1 rounded-full mr-2">
                  <Clock className="h-4 w-4 text-yellow-500" />
                </span>
                {lawyer.yearsOfExperience} years experience
              </div>
              <div className="flex items-center text-sm text-gray-700">
                <span className="bg-green-100 p-1 rounded-full mr-2">
                  <DollarSign className="h-4 w-4 text-green-600" />
                </span>
                ₹{lawyer.consultationFee}/consultation
              </div>
            </div>

            <div className="flex items-center space-x-3 mt-4">
              <button
                onClick={() => setShowModal(true)}
                className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors text-sm font-medium"
              >
                View Profile
              </button>
              <button
                onClick={() => setShowBookingModal(true)}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Book Consultation
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Modal */}
      {showModal && (
        <LawyerProfileModal lawyer={lawyer} onClose={() => setShowModal(false)} />
      )}

      {showBookingModal && user && (
        <BookAppointmentModal
          lawyer={lawyer}
          onClose={() => setShowBookingModal(false)}
          clientId={user.id}
        />
      )}
    </>
  );
};

export default LawyerCard;
