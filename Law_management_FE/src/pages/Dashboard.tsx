import React, { useState } from 'react';
import {
  Calendar,
  MessageSquare,
  Star,
  CreditCard,
  Clock,
  TrendingUp
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import ReviewModal from './ReviewModal';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedLawyerId, setSelectedLawyerId] = useState<string | null>(null);

  if (!user) return null;

  // Inside Dashboard component
const handleSubmitReview = async (lawyerId: string, rating: number, comment: string) => {
  try {
    await axios.post('http://localhost:8080/api/reviews/add', {
      appointmentId: 1, // Optional or actual appointment ID
      clientId: user.id,
      lawyerId,
      rating,
      comment
    });
    alert('Review submitted successfully!');
  } catch (err) {
    console.error(err);
    alert('Failed to submit review');
  }
};


  const renderClientDashboard = () => (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg text-white p-6">
        <h1 className="text-2xl font-bold mb-2">Welcome back, {user.name}!</h1>
        <p className="text-blue-100">Ready to connect with legal experts?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Stat Cards */}
        <StatCard title="Upcoming" value="2" icon={<Calendar className="h-8 w-8 text-blue-600" />} desc="Appointments this week" />
        <StatCard title="Active" value="1" icon={<MessageSquare className="h-8 w-8 text-green-600" />} desc="Ongoing consultations" />
        <StatCard title="Completed" value="8" icon={<Star className="h-8 w-8 text-yellow-600" />} desc="Total consultations" />
        <StatCard title="Spent" value="₹15,500" icon={<CreditCard className="h-8 w-8 text-purple-600" />} desc="This month" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Appointment */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Appointments</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <img
                src="https://images.pexels.com/photos/5668473/pexels-photo-5668473.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop"
                alt="Lawyer"
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1">
                <p className="font-medium text-gray-900">Advocate Priya Sharma</p>
                <p className="text-sm text-gray-600">Tomorrow, 2:00 PM</p>
              </div>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                Confirmed
              </span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <ActionButton icon={<Calendar className="h-5 w-5 text-blue-600" />} text="Book New Consultation" />
            <ActionButton icon={<MessageSquare className="h-5 w-5 text-green-600" />} text="Continue Chat" />
            <ActionButton
              icon={<Star className="h-5 w-5 text-yellow-600" />}
              text="Leave Review"
              onClick={() => {
                setSelectedLawyerId('LAWYER_ID_SAMPLE'); // Replace dynamically
                setModalOpen(true);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderLawyerDashboard = () => (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg text-white p-6">
        <h1 className="text-2xl font-bold mb-2">Welcome back, {user.name}!</h1>
        <p className="text-green-100">You have 3 pending appointment requests</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Today" value="4" icon={<Clock className="h-8 w-8 text-blue-600" />} desc="Scheduled appointments" />
        <StatCard title="This Month" value="₹45,000" icon={<TrendingUp className="h-8 w-8 text-green-600" />} desc="Total earnings" />
        <StatCard title="Rating" value="4.8" icon={<Star className="h-8 w-8 text-yellow-600" />} desc="Average rating" />
        <StatCard title="Clients" value="127" icon={<MessageSquare className="h-8 w-8 text-purple-600" />} desc="Total served" />
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4">
      {user.role === 'client' ? renderClientDashboard() : renderLawyerDashboard()}

      <ReviewModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmitReview}
      />

    </div>
  );
};

export default Dashboard;

// Reusable subcomponents
const StatCard = ({ title, value, icon, desc }: any) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
      {icon}
    </div>
    <p className="text-xs text-gray-500 mt-2">{desc}</p>
  </div>
);

const ActionButton = ({ icon, text, onClick }: any) => (
  <button
    className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
    onClick={onClick}
  >
    <div className="flex items-center space-x-3">
      {icon}
      <span>{text}</span>
    </div>
  </button>
);
