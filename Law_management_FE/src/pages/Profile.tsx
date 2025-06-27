import React, { useState, useRef, useEffect } from 'react';
import { Save, Edit, Camera, Loader } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      bio: '',
      location: '',
      consultationFee: '',
      barCouncilNumber: '',
      yearsOfExperience: '',
      specializations: '',
      languages: '',
      education: '',
      aadhaarPan: '',
      driveLink: '',
    },    
  });

  useEffect(() => {
    if (user?.email) {
      axios
        .get(`http://localhost:8080/api/profile`, {
          params: { email: user.email },
        })
        .then((response) => reset(response.data))
        .catch((error) => console.error('Failed to fetch profile:', error));
    }
  }, [user?.email, reset]);

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
  
      // Convert string fields to arrays
      const transformedData = {
        ...data,
        consultationFee: data.consultationFee ? parseInt(data.consultationFee) : 0,
        yearsOfExperience: data.yearsOfExperience ? parseInt(data.yearsOfExperience) : 0,
        specializations: data.specializations
          ? data.specializations.split(',').map((s: string) => s.trim())
          : [],
        languages: data.languages
          ? data.languages.split(',').map((l: string) => l.trim())
          : [],
        education: data.education
          ? data.education.split(',').map((e: string) => e.trim())
          : [],
      };
  
      const response = await axios.put(
        `http://localhost:8080/api/profile?email=${user?.email}`,
        transformedData
      );
  
      // On update, show the formatted string again
      reset({
        ...response.data,
        specializations: response.data.specializations?.join(', ') || '',
        languages: response.data.languages?.join(', ') || '',
        education: response.data.education?.join(', ') || '',
      });
  
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };
  

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('Selected avatar file:', file);
      // Future: upload avatar
    }
  };

  const renderInput = (
    label: string,
    registerField: any,
    disabled: boolean,
    type: string = 'text'
  ) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        {...registerField}
        disabled={disabled}
        className={`w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
          disabled ? 'bg-gray-50' : ''
        }`}
      />
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6 space-y-6">
      {/* Header Section */}
      <div className="flex items-center space-x-6">
        <div className="relative w-20 h-20 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-3xl font-bold">
          {user?.name?.[0].toUpperCase() || 'U'}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-0 right-0 bg-white border rounded-full p-1 shadow"
          >
            <Camera className="w-4 h-4 text-purple-600" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
          />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">{user?.name}</h2>
          <p className="text-sm text-gray-500 capitalize">{user?.role}</p>
        </div>
        <button
          type="button"
          onClick={() => setIsEditing(!isEditing)}
          className="ml-auto px-4 py-2 bg-purple-100 text-purple-700 rounded-lg flex items-center gap-2 hover:bg-purple-200"
        >
          <Edit className="w-4 h-4" /> {isEditing ? 'Cancel' : 'Edit'}
        </button>
      </div>

      {/* Form Section */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {renderInput('Name', register('name', { required: 'Name is required' }), !isEditing)}
        {errors.name && (
          <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
        )}

        {renderInput('Email', register('email'), true)}
        {renderInput('Phone', register('phone'), !isEditing)}

        {/* Lawyer Fields */}
        {user?.role === 'lawyer' && (
          <>
            {isEditing ? (
              <>
                {renderInput('Bio', register('bio'), false)}
                {renderInput('Location', register('location'), false)}
                {renderInput('Consultation Fee', register('consultationFee'), false, 'number')}
                {renderInput('Bar Council Number', register('barCouncilNumber'), false)}
                {renderInput('Years of Experience', register('yearsOfExperience'), false, 'number')}
                {renderInput('Specializations (comma separated)', register('specializations'), false)}
                {renderInput('Languages (comma separated)', register('languages'), false)}
                {renderInput('Education (comma separated)', register('education'), false)}
                {renderInput('Aadhaar or PAN', register('aadhaarPan'), !isEditing)}
                {renderInput('Drive Link (optional)', register('driveLink'), !isEditing)}

              </>
            ) : (
              <div className="space-y-2 pt-4 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-purple-700">Lawyer Details</h3>
                <p><strong>Bio:</strong> {watch('bio') || '—'}</p>
                <p><strong>Location:</strong> {watch('location') || '—'}</p>
                <p><strong>Consultation Fee:</strong> ₹{watch('consultationFee') || '—'}</p>
                <p><strong>Bar Council Number:</strong> {watch('barCouncilNumber') || '—'}</p>
                <p><strong>Years of Experience:</strong> {watch('yearsOfExperience') || '—'}</p>
                <p><strong>Specializations:</strong> {(watch('specializations') || []).toString().split(',').map(s => s.trim()).join(', ') || '—'}</p>
                <p><strong>Languages:</strong> {(watch('languages') || []).toString().split(',').map(l => l.trim()).join(', ') || '—'}</p>
                <p><strong>Education:</strong> {(watch('education') || []).toString().split(',').map(e => e.trim()).join(', ') || '—'}</p>
              </div>
            )}
          </>
        )}

        {isEditing && (
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 flex items-center gap-2"
              disabled={loading}
            >
              {loading ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Changes
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default Profile;
