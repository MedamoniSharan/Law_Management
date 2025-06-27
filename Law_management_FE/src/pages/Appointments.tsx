import React, { useState, useEffect, useMemo } from 'react';
import {
  Calendar, Clock, Video, MessageSquare,
  AlertCircle, CheckCircle, XCircle, RotateCcw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Appointment } from '../types';
import { format, parseISO, isToday, isTomorrow } from 'date-fns';
import LoadingSpinner from '../components/Common/LoadingSpinner';

const Appointments: React.FC = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled'>('all');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  const lawyerImageUrls = [
    'https://randomuser.me/api/portraits/men/32.jpg',
    'https://randomuser.me/api/portraits/women/44.jpg',
    'https://randomuser.me/api/portraits/men/75.jpg',
    'https://randomuser.me/api/portraits/women/68.jpg',
    'https://randomuser.me/api/portraits/men/83.jpg',
    'https://randomuser.me/api/portraits/women/50.jpg',
    'https://randomuser.me/api/portraits/men/41.jpg',
    'https://randomuser.me/api/portraits/women/22.jpg',
    'https://randomuser.me/api/portraits/men/28.jpg',
    'https://randomuser.me/api/portraits/women/35.jpg'
  ];

  const getRandomImage = (index: number) => lawyerImageUrls[index % lawyerImageUrls.length];

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        user?.role === 'lawyer'
          ? `http://localhost:8080/api/appointments/lawyer/${user.id}`
          : `http://localhost:8080/api/appointments/client/${user.id}`
      );
      const data = await res.json();
      setAppointments(data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'confirmed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'completed': return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case 'cancelled': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'rescheduled': return <RotateCcw className="h-4 w-4 text-orange-500" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'rescheduled': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDateLabel = (dateString: string) => {
    const date = parseISO(dateString);
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'MMM dd, yyyy');
  };

  const handleConfirmAppointment = async (appointmentId: string) => {
    try {
      await fetch(`http://localhost:8080/api/appointments/${appointmentId}/confirm`, { method: 'PUT' });
      setAppointments(prev => prev.map(apt => apt.id === appointmentId ? { ...apt, status: 'confirmed' } : apt));
    } catch (error) {
      console.error("Confirm error:", error);
    }
  };

  const handleCancelAppointment = async () => {
    if (!selectedAppointment) return;
    try {
      await fetch(`http://localhost:8080/api/appointments/${selectedAppointment.id}/cancel`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: cancelReason }),
      });
      setAppointments(prev => prev.map(apt =>
        apt.id === selectedAppointment.id ? { ...apt, status: 'cancelled', cancelReason } : apt
      ));
      setShowCancelModal(false);
      setSelectedAppointment(null);
      setCancelReason('');
    } catch (error) {
      console.error("Cancel error:", error);
    }
  };

  const handleAddNote = async (appointmentId: string, newNote: string) => {
    if (!newNote) return;
    try {
      const res = await fetch(`http://localhost:8080/api/appointments/${appointmentId}/add-note`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note: newNote }),
      });
      const updated = await res.json();
      setAppointments(prev =>
        prev.map(apt => (apt.id === updated.id ? { ...apt, notes: updated.notes } : apt))
      );
    } catch (err) {
      console.error('Failed to add note:', err);
    }
  };

  const filteredAppointments = appointments.filter(apt => filter === 'all' || apt.status === filter);

  if (loading) return <LoadingSpinner size="lg" text="Loading appointments..." />;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
          <p className="text-gray-600 mt-1">Manage your legal consultations</p>
        </div>
        <div className="flex gap-2">
          {(['all', 'pending', 'confirmed', 'completed', 'cancelled'] as const).map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === status ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {filteredAppointments.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
          <p className="text-gray-600">
            {filter === 'all' ? "You don't have any appointments yet." : `No ${filter} appointments.`}
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredAppointments.map((appointment, index) => (
            <div key={appointment.id} className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex flex-col lg:flex-row justify-between gap-4">
                <div className="flex items-start space-x-4">
                  <img
                    src={getRandomImage(index)}
                    className="w-16 h-16 rounded-full object-cover"
                    alt="User Avatar"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {user?.role === 'client' ? `Lawyer ${appointment.lawyerId}` : `Client ${appointment.clientId}`}
                      </h3>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                        {getStatusIcon(appointment.status)}
                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />{getDateLabel(appointment.date)}</span>
                      <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{appointment.startTime} - {appointment.endTime}</span>
                      <span className="flex items-center gap-1">
                        {appointment.type === 'video' ? <Video className="h-4 w-4" /> : <MessageSquare className="h-4 w-4" />}
                        {appointment.type === 'video' ? 'Video Call' : 'Chat'}
                      </span>
                      <span className="text-green-600 font-medium">₹{appointment.fee}</span>
                    </div>

                    <div className="mt-4 bg-gray-50 p-3 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-800 mb-2">Conversation:</h4>
                      <ul className="text-sm space-y-1 max-h-32 overflow-y-auto">
                        {appointment.notes?.map((note, index) => (
                          <li key={index} className="text-gray-600 bg-white p-2 rounded shadow-sm">{note}</li>
                        ))}
                      </ul>
                      <form
                        onSubmit={async (e) => {
                          e.preventDefault();
                          const form = e.currentTarget;
                          const input = form.elements.namedItem('newNote') as HTMLInputElement;
                          const newNote = input.value.trim();
                          if (!newNote) return;
                          await handleAddNote(appointment.id, newNote);
                          input.value = '';
                        }}
                        className="mt-2 flex gap-2"
                      >
                        <input
                          name="newNote"
                          type="text"
                          placeholder="Type a message..."
                          className="flex-1 border border-gray-300 px-3 py-2 rounded text-sm"
                        />
                        <button
                          type="submit"
                          className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                        >
                          Send
                        </button>
                      </form>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  {appointment.status === 'pending' && user?.role === 'lawyer' && (
                    <>
                      <button
                        onClick={() => handleConfirmAppointment(appointment.id)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => {
                          setSelectedAppointment(appointment);
                          setShowCancelModal(true);
                        }}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium"
                      >
                        Decline
                      </button>
                    </>
                  )}
                  {appointment.status === 'completed' && (
                    <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium">
                      View Summary
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showCancelModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Cancel Appointment</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to cancel this appointment? Please provide a reason:
            </p>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg resize-none"
              rows={3}
              placeholder="Reason for cancellation..."
            />
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setSelectedAppointment(null);
                  setCancelReason('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Keep Appointment
              </button>
              <button
                onClick={handleCancelAppointment}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Cancel Appointment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;
