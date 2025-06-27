import React from 'react';
import { X, MapPin, Clock, DollarSign, Briefcase, User } from 'lucide-react';
import { Lawyer } from '../../types';

interface LawyerProfileModalProps {
  lawyer: Lawyer | null;
  onClose: () => void;
}

const LawyerProfileModal: React.FC<LawyerProfileModalProps> = ({ lawyer, onClose }) => {
  if (!lawyer) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 px-4">
      <div className="bg-white max-w-2xl w-full rounded-lg shadow-lg p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Lawyer Profile</h2>
          <p className="text-sm text-gray-500">Detailed view of the selected lawyer</p>
        </div>

        <div className="flex items-start space-x-6">
          <img
            src={lawyer.avatar || 'https://images.pexels.com/photos/5668473/pexels-photo-5668473.jpeg'}
            alt={lawyer.name}
            className="w-24 h-24 rounded-full object-cover border"
          />

          <div className="flex-1 space-y-3">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{lawyer.name}</h3>
              <p className="text-sm text-gray-600">{lawyer.role}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 text-red-500 mr-2" />
                <span>{lawyer.location}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 text-yellow-500 mr-2" />
                <span>{lawyer.yearsOfExperience} years of experience</span>
              </div>
              <div className="flex items-center">
                <DollarSign className="h-4 w-4 text-green-600 mr-2" />
                <span>₹{lawyer.consultationFee}/consultation</span>
              </div>
              <div className="flex items-center">
                <Briefcase className="h-4 w-4 text-blue-600 mr-2" />
                <span>{lawyer.specializations.join(', ')}</span>
              </div>
              <div className="flex items-center">
                <User className="h-4 w-4 text-purple-500 mr-2" />
                <span>{lawyer.languages.join(', ')}</span>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-800 mt-4 mb-1">Education</h4>
              <ul className="list-disc list-inside text-sm text-gray-700">
                {lawyer.education.map((edu, idx) => (
                  <li key={idx}>{edu}</li>
                ))}
              </ul>
            </div>

            {lawyer.bio && (
              <div>
                <h4 className="text-sm font-semibold text-gray-800 mt-4 mb-1">Bio</h4>
                <p className="text-sm text-gray-700 leading-relaxed">{lawyer.bio}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LawyerProfileModal;
