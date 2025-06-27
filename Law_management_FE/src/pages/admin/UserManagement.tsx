import React, { useState, useEffect } from 'react';
import { Search, MoreVertical, Eye, Ban, Trash2, UserCheck, Mail, Phone } from 'lucide-react';
import { format } from 'date-fns';
import LoadingSpinner from '../../components/Common/LoadingSpinner';

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: 'client' | 'lawyer' | 'admin';
  isActive?: boolean;
  avatar?: string;
  bio?: string | null;
  location?: string | null;
  consultationFee?: number | null;
  barCouncilNumber?: string | null;
  yearsOfExperience?: number | null;
  specializations?: string[];
  languages?: string[];
  education?: string[];
  createdAt?: string | Date;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'client' | 'lawyer'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showActionMenu, setShowActionMenu] = useState<number | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8080/api/profile/all');
      const data = await res.json();
      const formatted = data.map((user: any) => ({
        ...user,
        createdAt: user.createdAt ? new Date(user.createdAt) : new Date(),
        isActive: user.isActive ?? true,
      }));
      setUsers(formatted);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users
    .filter(user => user.role !== 'admin')
    .filter(user => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && user.isActive) ||
        (statusFilter === 'inactive' && !user.isActive);
      return matchesSearch && matchesRole && matchesStatus;
    });

  const handleUserAction = (userId: number, action: 'activate' | 'deactivate' | 'delete') => {
    setUsers(prev =>
      prev
        .map(user =>
          user.id === userId
            ? action === 'delete'
              ? null
              : { ...user, isActive: action === 'activate' }
            : user
        )
        .filter(Boolean) as User[]
    );
    setShowActionMenu(null);
  };

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  if (loading) return <LoadingSpinner size="lg" text="Loading users..." />;

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">User Management</h1>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute top-3 left-3 text-gray-400 w-4 h-4" />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search users..."
            className="w-full pl-10 py-2 border rounded-md border-gray-300 focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value as any)}
          className="py-2 px-3 border rounded-md border-gray-300"
        >
          <option value="all">All Roles</option>
          <option value="client">Clients</option>
          <option value="lawyer">Lawyers</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="py-2 px-3 border rounded-md border-gray-300"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left text-sm font-medium text-gray-500">User</th>
              <th className="p-3 text-left text-sm font-medium text-gray-500">Role</th>
              <th className="p-3 text-left text-sm font-medium text-gray-500">Contact</th>
              <th className="p-3 text-left text-sm font-medium text-gray-500">Status</th>
              <th className="p-3 text-left text-sm font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredUsers.map(user => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="p-3">
                  <div className="text-sm font-semibold text-gray-900">{user.name}</div>
                  <div className="text-sm text-gray-500">{user.email}</div>
                </td>
                <td className="p-3 capitalize text-sm">{user.role}</td>
                <td className="p-3 text-sm text-gray-900">
                  <div className="flex items-center gap-1">
                    <Mail className="w-4 h-4 text-gray-400" />
                    {user.email}
                  </div>
                  {user.phone && (
                    <div className="flex items-center gap-1">
                      <Phone className="w-4 h-4 text-gray-400" />
                      {user.phone}
                    </div>
                  )}
                </td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="p-3 space-x-2">
                  <button onClick={() => handleViewUser(user)} className="text-blue-600 hover:text-blue-800">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setShowActionMenu(prev => prev === user.id ? null : user.id)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>

                  {showActionMenu === user.id && (
                    <div className="absolute bg-white shadow rounded border mt-2 z-50">
                      <ul className="text-sm text-gray-700">
                        <li>
                          <button
                            onClick={() => handleUserAction(user.id, user.isActive ? 'deactivate' : 'activate')}
                            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 w-full text-left"
                          >
                            {user.isActive ? <Ban className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                            {user.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={() => handleUserAction(user.id, 'delete')}
                            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 w-full text-left text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-xl w-full">
            <h3 className="text-lg font-semibold mb-4">User Details</h3>
            <div className="space-y-2">
              <p><strong>Name:</strong> {selectedUser.name}</p>
              <p><strong>Email:</strong> {selectedUser.email}</p>
              <p><strong>Phone:</strong> {selectedUser.phone || 'N/A'}</p>
              <p><strong>Role:</strong> {selectedUser.role}</p>
              <p><strong>Status:</strong> {selectedUser.isActive ? 'Active' : 'Inactive'}</p>
              {selectedUser.role === 'lawyer' && (
                <>
                  {selectedUser.bio && <p><strong>Bio:</strong> {selectedUser.bio}</p>}
                  {selectedUser.location && <p><strong>Location:</strong> {selectedUser.location}</p>}
                  {selectedUser.consultationFee && <p><strong>Consultation Fee:</strong> ₹{selectedUser.consultationFee}</p>}
                  {selectedUser.barCouncilNumber && <p><strong>Bar Council No.:</strong> {selectedUser.barCouncilNumber}</p>}
                  {selectedUser.yearsOfExperience && <p><strong>Experience:</strong> {selectedUser.yearsOfExperience} years</p>}
                  {selectedUser.specializations?.length > 0 && (
                    <p><strong>Specializations:</strong> {selectedUser.specializations.join(', ')}</p>
                  )}
                  {selectedUser.languages?.length > 0 && (
                    <p><strong>Languages:</strong> {selectedUser.languages.join(', ')}</p>
                  )}
                  {selectedUser.education?.length > 0 && (
                    <p><strong>Education:</strong> {selectedUser.education.join(', ')}</p>
                  )}
                </>
              )}
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowUserModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-800 rounded hover:bg-gray-200"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleUserAction(selectedUser.id, selectedUser.isActive ? 'deactivate' : 'activate');
                  setShowUserModal(false);
                }}
                className={`px-4 py-2 text-white rounded ${
                  selectedUser.isActive ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {selectedUser.isActive ? 'Deactivate' : 'Activate'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;