import React, { useState, useEffect } from 'react';
import { FileText, Download, Check, X, Eye, Clock, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import { Lawyer } from '../../types'; // Ensure Lawyer type includes: id, name, email, phone, isVerified, verificationStatus, etc.

const defaultAvatars = [
  "https://images.pexels.com/photos/5668473/pexels-photo-5668473.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop", // Male lawyer at desk
  "https://images.pexels.com/photos/5669619/pexels-photo-5669619.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop", // Female lawyer reading
  "https://images.pexels.com/photos/4427610/pexels-photo-4427610.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop", // Male lawyer looking confident
  "https://images.pexels.com/photos/6209162/pexels-photo-6209162.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop", // Female lawyer with files
  "https://images.pexels.com/photos/8112198/pexels-photo-8112198.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop", // Lawyer at laptop
  "https://images.pexels.com/photos/6941881/pexels-photo-6941881.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop", // Confident male in suit
  "https://images.pexels.com/photos/8112199/pexels-photo-8112199.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop", // Young female lawyer
  "https://images.pexels.com/photos/5668472/pexels-photo-5668472.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop", // Smiling lawyer
  "https://images.pexels.com/photos/5668483/pexels-photo-5668483.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop", // Lawyer in black robe
  "https://images.pexels.com/photos/5669607/pexels-photo-5669607.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop", // Lawyer with law book
];


const LawyerVerification: React.FC = () => {
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'pending' | 'verified' | 'rejected'>('pending');
  const [selectedLawyer, setSelectedLawyer] = useState<Lawyer | null>(null);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verificationNotes, setVerificationNotes] = useState('');

  useEffect(() => {
    fetchLawyers();
  }, []);

  const fetchLawyers = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/profile/lawyers');
      const data = await response.json();
  
      const formatted = data.map((lawyer: any) => ({
        ...lawyer,
        verificationStatus: lawyer.verificationStatus || (lawyer.isVerified ? 'verified' : 'pending'),
        documents: lawyer.documents || [],
        avatar: lawyer.avatar || defaultAvatars[Math.floor(Math.random() * defaultAvatars.length)],
      }));
  
      setLawyers(formatted);
    } catch (err) {
      console.error('Failed to fetch lawyers:', err);
    } finally {
      setLoading(false);
    }
  };
  

  const handleVerification = async (lawyerId: string, action: 'approve' | 'reject') => {
    const newStatus = action === 'approve' ? 'verified' : 'rejected';

    try {
      const res = await fetch(`http://localhost:8080/api/profile/verify/${lawyerId}?status=${newStatus}`, {
        method: 'PATCH',
      });

      if (!res.ok) throw new Error('Update failed');
      const updatedLawyer = await res.json();

      setLawyers(prev =>
        prev.map(lawyer =>
          lawyer.id === lawyerId
            ? {
                ...lawyer,
                verificationStatus: updatedLawyer.verificationStatus,
                isVerified: updatedLawyer.isVerified,
              }
            : lawyer
        )
      );
    } catch (err) {
      console.error('Error verifying lawyer:', err);
    } finally {
      setShowVerificationModal(false);
      setSelectedLawyer(null);
      setVerificationNotes('');
    }
  };

  const handleViewDocuments = (lawyer: Lawyer) => {
    setSelectedLawyer(lawyer);
    setShowVerificationModal(true);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'verified':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'verified':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredLawyers = lawyers.filter(l => l.verificationStatus === filter);

  if (loading) return <LoadingSpinner size="lg" text="Loading verification requests..." />;

  return (
    <div className="max-w-7xl mx-auto space-y-6 px-4 py-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Lawyer Verification</h1>
        <p className="text-gray-600">Review and verify lawyer applications</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {['pending', 'verified', 'rejected'].map((status) => (
          <div key={status} className="bg-white p-6 rounded shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 capitalize">{status}</p>
                <p className={`text-2xl font-bold ${getStatusColor(status)}`}>
                  {lawyers.filter(l => l.verificationStatus === status).length}
                </p>
              </div>
              {getStatusIcon(status)}
            </div>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-4 border-b">
        {(['pending', 'verified', 'rejected'] as const).map(status => (
          <button
            key={status}
            className={`pb-2 px-4 border-b-2 font-medium ${
              filter === status ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500'
            }`}
            onClick={() => setFilter(status)}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)} (
            {lawyers.filter(l => l.verificationStatus === status).length})
          </button>
        ))}
      </div>

      {/* List */}
      <div>
        {filteredLawyers.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No {filter} applications found.</p>
        ) : (
          filteredLawyers.map((lawyer) => (
            <div key={lawyer.id} className="bg-white p-6 rounded shadow mb-4">
              <div className="flex justify-between gap-4">
                <div className="flex gap-4">
                  <img
                    src={lawyer.avatar || '/default-avatar.jpg'}
                    alt={lawyer.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-lg font-semibold">{lawyer.name}</h3>
                    <p className="text-sm text-gray-600">{lawyer.email}</p>
                    <p className="text-sm text-gray-600">Bar No: {lawyer.barCouncilNumber}</p>
                    <div className={`mt-1 inline-flex items-center gap-1 text-xs px-2 py-1 rounded ${getStatusColor(lawyer.verificationStatus)}`}>
                      {getStatusIcon(lawyer.verificationStatus)}
                      {lawyer.verificationStatus.toUpperCase()}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <button
                    onClick={() => handleViewDocuments(lawyer)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
                  >
                    Review
                  </button>
                  {lawyer.verificationStatus === 'pending' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleVerification(lawyer.id, 'approve')}
                        className="bg-green-600 p-2 rounded text-white hover:bg-green-700"
                      >
                        <Check />
                      </button>
                      <button
                        onClick={() => handleVerification(lawyer.id, 'reject')}
                        className="bg-red-600 p-2 rounded text-white hover:bg-red-700"
                      >
                        <X />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Verification Modal */}
      {showVerificationModal && selectedLawyer && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Verify {selectedLawyer.name}</h2>
              <button onClick={() => setShowVerificationModal(false)} className="text-gray-500 hover:text-gray-800">
                ×
              </button>
            </div>
            <div className="space-y-4">
  <p><strong>Email:</strong> {selectedLawyer.email}</p>
  <p><strong>Phone:</strong> {selectedLawyer.phone}</p>
  <p><strong>Specializations:</strong> {selectedLawyer.specializations.join(', ')}</p>
  <p><strong>Experience:</strong> {selectedLawyer.yearsOfExperience} years</p>
  <p><strong>Education:</strong> {selectedLawyer.education.join(', ')}</p>

  {/* ✅ NEW FIELDS */}
  <p className="flex items-center gap-2">
  <strong>Aadhaar/PAN:</strong>{' '}
  {selectedLawyer.aadhaarPan ? (
    <a
      href={selectedLawyer.aadhaarPan}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-600 underline flex items-center gap-1"
    >
      <FileText className="w-4 h-4" />
      View Aadhaar/PAN
    </a>
  ) : (
    '—'
  )}
</p>

  <p><strong>Drive Link:</strong>{' '}
    {selectedLawyer.driveLink ? (
      <a
        href={selectedLawyer.driveLink}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 underline"
      >
        View Drive Folder
      </a>
    ) : (
      '—'
    )}
  </p>

  {/* Documents (if any) */}
  {selectedLawyer.documents?.length > 0 && (
    <div>
      <h4 className="font-semibold text-gray-800 mb-2">Documents:</h4>
      {/* Document list code */}
    </div>
  )}
</div>

          </div>
        </div>
      )}
    </div>
  );
};

export default LawyerVerification;
