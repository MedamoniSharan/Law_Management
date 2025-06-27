export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'client' | 'lawyer' | 'admin';
  avatar?: string;
  createdAt: Date;
  isActive?: boolean;
}

export interface Client extends User {
  role: 'client';
  address?: string;
  dateOfBirth?: string;
}

export interface Lawyer extends User {
  role: 'lawyer';
  barCouncilNumber: string;
  specializations: string[];
  yearsOfExperience: number;
  education: string[];
  bio?: string;
  consultationFee: number;
  rating: number;
  reviewCount: number;
  languages: string[];
  location: string;
  isVerified: boolean;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  availability: AvailabilitySlot[];
  documents?: LawyerDocument[];
  totalEarnings?: number;
  completedConsultations?: number;
  aadhaarPan?: string; // Should be a URL string pointing to a document
  driveLink?: string;
}

export interface Admin extends User {
  role: 'admin';
  permissions: string[];
}

export interface LawyerDocument {
  id: string;
  type: 'degree' | 'bar_certificate' | 'id_proof';
  url: string;
  name: string;
  uploadedAt: Date;
  verified: boolean;
}

export interface AvailabilitySlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
}

export interface Appointment {
  id: string;
  clientId: string;
  lawyerId: string;
  date: string;
  startTime: string;
  endTime: string;
  type: 'video' | 'chat';
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'rescheduled';
  notes: string[]; // <-- make sure it's a string array
  fee: number;
  cancelReason?: string;
}


export interface Consultation {
  id: string;
  appointmentId: string;
  appointment?: Appointment;
  status: 'waiting' | 'active' | 'completed' | 'cancelled';
  startedAt?: Date;
  endedAt?: Date;
  duration?: number;
  messages: Message[];
  documents: ConsultationDocument[];
  summary?: string;
}

export interface ConsultationDocument {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedBy: string;
  uploadedAt: Date;
}

export interface Review {
  id: string;
  clientId: string;
  lawyerId: string;
  appointmentId: string;
  client?: Client;
  lawyer?: Lawyer;
  rating: number;
  comment: string;
  response?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface Message {
  id: string;
  consultationId: string;
  senderId: string;
  senderName: string;
  content: string;
  type: 'text' | 'file' | 'system';
  timestamp: Date;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
}

export interface Payment {
  id: string;
  appointmentId: string;
  clientId: string;
  lawyerId: string;
  amount: number;
  platformFee: number;
  lawyerAmount: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: string;
  transactionId?: string;
  createdAt: Date;
  completedAt?: Date;
}

export interface Dispute {
  id: string;
  appointmentId: string;
  clientId: string;
  lawyerId: string;
  type: 'payment' | 'service' | 'behavior' | 'other';
  description: string;
  status: 'open' | 'investigating' | 'resolved' | 'closed';
  resolution?: string;
  createdAt: Date;
  resolvedAt?: Date;
}

export interface PlatformStats {
  totalUsers: number;
  totalClients: number;
  totalLawyers: number;
  verifiedLawyers?: number;
  totalAppointments: number;
  totalRevenue: number;
  monthlyRevenue: number;
  activeConsultations: number;
  pendingVerifications: number;
  disputesCount: number;
}

