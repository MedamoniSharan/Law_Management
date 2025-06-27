import React, { useState, useEffect, useRef } from 'react';
import { Send, Paperclip, Video, Phone, Clock, User, FileText, Download, Mic, MicOff, VideoOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Consultation, Message } from '../types';
import { format } from 'date-fns';
import LoadingSpinner from '../components/Common/LoadingSpinner';

const Consultations: React.FC = () => {
  const { user } = useAuth();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [activeConsultation, setActiveConsultation] = useState<Consultation | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [isVideoCall, setIsVideoCall] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchConsultations();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [activeConsultation?.messages]);

  const fetchConsultations = async () => {
    setLoading(true);
    // Mock data - replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockConsultations: Consultation[] = [
      {
        id: '1',
        appointmentId: 'apt1',
        appointment: {
          id: 'apt1',
          clientId: 'client1',
          lawyerId: 'lawyer1',
          client: {
            id: 'client1',
            name: 'John Doe',
            email: 'john@example.com',
            role: 'client',
            avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
            createdAt: new Date()
          },
          lawyer: {
            id: 'lawyer1',
            name: 'Advocate Priya Sharma',
            email: 'priya@example.com',
            role: 'lawyer',
            avatar: 'https://images.pexels.com/photos/5668473/pexels-photo-5668473.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
            barCouncilNumber: 'BAR123456',
            specializations: ['Corporate Law'],
            yearsOfExperience: 8,
            education: ['LLB from Delhi University'],
            consultationFee: 2500,
            rating: 4.8,
            reviewCount: 45,
            languages: ['English', 'Hindi'],
            location: 'Mumbai, Maharashtra',
            isVerified: true,
            verificationStatus: 'verified',
            availability: [],
            createdAt: new Date()
          },
          date: '2024-01-15',
          startTime: '14:00',
          endTime: '15:00',
          type: 'chat',
          status: 'confirmed',
          fee: 2500,
          createdAt: new Date()
        },
        status: 'active',
        startedAt: new Date(),
        messages: [
          {
            id: '1',
            consultationId: '1',
            senderId: 'lawyer1',
            senderName: 'Advocate Priya Sharma',
            content: 'Hello! I\'m ready to help you with your legal consultation. What can I assist you with today?',
            type: 'text',
            timestamp: new Date(Date.now() - 300000)
          },
          {
            id: '2',
            consultationId: '1',
            senderId: 'client1',
            senderName: 'John Doe',
            content: 'Hi, I need help reviewing a contract for my business. I have some concerns about the termination clauses.',
            type: 'text',
            timestamp: new Date(Date.now() - 240000)
          },
          {
            id: '3',
            consultationId: '1',
            senderId: 'lawyer1',
            senderName: 'Advocate Priya Sharma',
            content: 'I\'d be happy to help you review the contract. Could you please share the document so I can take a look at the specific clauses you\'re concerned about?',
            type: 'text',
            timestamp: new Date(Date.now() - 180000)
          }
        ],
        documents: [
          {
            id: '1',
            name: 'Service_Agreement.pdf',
            url: '/documents/service_agreement.pdf',
            type: 'application/pdf',
            size: 245760,
            uploadedBy: 'client1',
            uploadedAt: new Date(Date.now() - 120000)
          }
        ]
      }
    ];

    setConsultations(mockConsultations);
    if (mockConsultations.length > 0) {
      setActiveConsultation(mockConsultations[0]);
    }
    setLoading(false);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (!message.trim() || !activeConsultation) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      consultationId: activeConsultation.id,
      senderId: user!.id,
      senderName: user!.name,
      content: message,
      type: 'text',
      timestamp: new Date()
    };

    setActiveConsultation(prev => prev ? {
      ...prev,
      messages: [...prev.messages, newMessage]
    } : null);

    setMessage('');
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !activeConsultation) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      consultationId: activeConsultation.id,
      senderId: user!.id,
      senderName: user!.name,
      content: `Shared file: ${file.name}`,
      type: 'file',
      timestamp: new Date(),
      fileName: file.name,
      fileSize: file.size,
      fileUrl: URL.createObjectURL(file)
    };

    setActiveConsultation(prev => prev ? {
      ...prev,
      messages: [...prev.messages, newMessage]
    } : null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatTime = (date: Date) => {
    return format(date, 'HH:mm');
  };

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading consultations..." />;
  }

  if (consultations.length === 0) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No active consultations</h3>
          <p className="text-gray-600">Your consultations will appear here when they start.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-8rem)]">
      <div className="flex h-full bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Consultations List */}
        <div className="w-1/3 border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Active Consultations</h2>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {consultations.map((consultation) => (
              <div
                key={consultation.id}
                onClick={() => setActiveConsultation(consultation)}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                  activeConsultation?.id === consultation.id ? 'bg-blue-50 border-blue-200' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={user?.role === 'client' 
                      ? consultation.appointment?.lawyer?.avatar 
                      : consultation.appointment?.client?.avatar
                    }
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user?.role === 'client' 
                        ? consultation.appointment?.lawyer?.name 
                        : consultation.appointment?.client?.name
                      }
                    </p>
                    <p className="text-xs text-gray-500">
                      {consultation.status === 'active' ? 'Active now' : 'Waiting to start'}
                    </p>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${
                    consultation.status === 'active' ? 'bg-green-400' : 'bg-yellow-400'
                  }`} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Interface */}
        {activeConsultation && (
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img
                    src={user?.role === 'client' 
                      ? activeConsultation.appointment?.lawyer?.avatar 
                      : activeConsultation.appointment?.client?.avatar
                    }
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {user?.role === 'client' 
                        ? activeConsultation.appointment?.lawyer?.name 
                        : activeConsultation.appointment?.client?.name
                      }
                    </h3>
                    <p className="text-sm text-gray-600">
                      {activeConsultation.status === 'active' ? 'Online' : 'Waiting to start'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-1" />
                    {activeConsultation.startedAt && format(activeConsultation.startedAt, 'HH:mm')}
                  </div>
                  
                  {activeConsultation.appointment?.type === 'video' && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setIsMuted(!isMuted)}
                        className={`p-2 rounded-full ${isMuted ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'} hover:bg-gray-200`}
                      >
                        {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={() => setIsVideoEnabled(!isVideoEnabled)}
                        className={`p-2 rounded-full ${!isVideoEnabled ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'} hover:bg-gray-200`}
                      >
                        {isVideoEnabled ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={() => setIsVideoCall(!isVideoCall)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                      >
                        {isVideoCall ? 'End Video' : 'Start Video'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Video Call Area */}
            {isVideoCall && (
              <div className="h-64 bg-gray-900 relative">
                <div className="absolute inset-0 flex items-center justify-center text-white">
                  <div className="text-center">
                    <Video className="h-12 w-12 mx-auto mb-2" />
                    <p>Video call interface would be integrated here</p>
                    <p className="text-sm text-gray-300 mt-1">WebRTC or third-party video SDK</p>
                  </div>
                </div>
                <div className="absolute bottom-4 right-4 w-32 h-24 bg-gray-800 rounded-lg flex items-center justify-center">
                  <User className="h-8 w-8 text-gray-400" />
                </div>
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {activeConsultation.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs lg:max-w-md ${
                    msg.senderId === user?.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  } rounded-lg p-3`}>
                    {msg.type === 'file' ? (
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{msg.fileName}</p>
                          {msg.fileSize && (
                            <p className="text-xs opacity-75">{formatFileSize(msg.fileSize)}</p>
                          )}
                        </div>
                        <button className="p-1 hover:bg-black hover:bg-opacity-10 rounded">
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <p className="text-sm">{msg.content}</p>
                    )}
                    <p className={`text-xs mt-1 ${
                      msg.senderId === user?.id ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {formatTime(msg.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
                >
                  <Paperclip className="h-5 w-5" />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type your message..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Consultations;