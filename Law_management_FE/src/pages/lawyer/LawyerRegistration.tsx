import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Upload, FileText, Check, ArrowRight, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface LawyerRegistrationData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  professionalInfo: {
    barCouncilNumber: string;
    yearOfEnrollment: string;
    specializations: string[];
    yearsOfExperience: number;
    currentPracticeArea: string;
    consultationFee: number;
    languages: string[];
  };
  educationInfo: {
    lawDegree: string;
    university: string;
    graduationYear: string;
    additionalQualifications: string[];
  };
  documents: {
    profilePhoto: File | null;
    lawDegree: File | null;
    barCouncilCertificate: File | null;
    idProof: File | null;
    experienceCertificate: File | null;
  };
}

const LawyerRegistration: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<LawyerRegistrationData>>({});
  const [uploadedFiles, setUploadedFiles] = useState<{[key: string]: File}>({});
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors }, watch } = useForm();

  const specializations = [
    'Corporate Law', 'Criminal Law', 'Family Law', 'Property Law',
    'Civil Law', 'Contract Law', 'Tax Law', 'Labor Law',
    'Intellectual Property', 'Environmental Law', 'Banking Law', 'Insurance Law'
  ];

  const languages = [
    'English', 'Hindi', 'Bengali', 'Telugu', 'Marathi', 'Tamil',
    'Gujarati', 'Urdu', 'Kannada', 'Odia', 'Punjabi', 'Malayalam'
  ];

  const handleFileUpload = (fieldName: string, file: File) => {
    setUploadedFiles(prev => ({
      ...prev,
      [fieldName]: file
    }));
  };

  const onSubmit = (data: any) => {
    setFormData(prev => ({
      ...prev,
      [`step${currentStep}`]: data
    }));

    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      // Submit complete form
      console.log('Complete form data:', { ...formData, documents: uploadedFiles });
      // Navigate to verification pending page
      navigate('/lawyer/verification-pending');
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3, 4].map((step) => (
        <React.Fragment key={step}>
          <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
            step <= currentStep ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
          }`}>
            {step < currentStep ? <Check className="h-5 w-5" /> : step}
          </div>
          {step < 4 && (
            <div className={`w-16 h-1 ${
              step < currentStep ? 'bg-blue-600' : 'bg-gray-200'
            }`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  const renderPersonalInfo = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Personal Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name *
          </label>
          <input
            {...register('fullName', { required: 'Full name is required' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.fullName && (
            <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address *
          </label>
          <input
            type="email"
            {...register('email', { required: 'Email is required' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number *
          </label>
          <input
            type="tel"
            {...register('phone', { required: 'Phone number is required' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.phone && (
            <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date of Birth *
          </label>
          <input
            type="date"
            {...register('dateOfBirth', { required: 'Date of birth is required' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.dateOfBirth && (
            <p className="text-red-500 text-xs mt-1">{errors.dateOfBirth.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Address *
        </label>
        <textarea
          {...register('address', { required: 'Address is required' })}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
        {errors.address && (
          <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            City *
          </label>
          <input
            {...register('city', { required: 'City is required' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.city && (
            <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            State *
          </label>
          <input
            {...register('state', { required: 'State is required' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.state && (
            <p className="text-red-500 text-xs mt-1">{errors.state.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            PIN Code *
          </label>
          <input
            {...register('pincode', { required: 'PIN code is required' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.pincode && (
            <p className="text-red-500 text-xs mt-1">{errors.pincode.message}</p>
          )}
        </div>
      </div>
    </div>
  );

  const renderProfessionalInfo = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Professional Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bar Council Registration Number *
          </label>
          <input
            {...register('barCouncilNumber', { required: 'Bar Council number is required' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.barCouncilNumber && (
            <p className="text-red-500 text-xs mt-1">{errors.barCouncilNumber.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Year of Enrollment *
          </label>
          <input
            type="number"
            {...register('yearOfEnrollment', { required: 'Year of enrollment is required' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.yearOfEnrollment && (
            <p className="text-red-500 text-xs mt-1">{errors.yearOfEnrollment.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Years of Experience *
          </label>
          <input
            type="number"
            {...register('yearsOfExperience', { required: 'Years of experience is required' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.yearsOfExperience && (
            <p className="text-red-500 text-xs mt-1">{errors.yearsOfExperience.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Consultation Fee (₹) *
          </label>
          <input
            type="number"
            {...register('consultationFee', { required: 'Consultation fee is required' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.consultationFee && (
            <p className="text-red-500 text-xs mt-1">{errors.consultationFee.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Specializations * (Select multiple)
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-40 overflow-y-auto border border-gray-300 rounded-md p-3">
          {specializations.map((spec) => (
            <label key={spec} className="flex items-center space-x-2">
              <input
                type="checkbox"
                value={spec}
                {...register('specializations', { required: 'At least one specialization is required' })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{spec}</span>
            </label>
          ))}
        </div>
        {errors.specializations && (
          <p className="text-red-500 text-xs mt-1">{errors.specializations.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Languages * (Select multiple)
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-h-32 overflow-y-auto border border-gray-300 rounded-md p-3">
          {languages.map((lang) => (
            <label key={lang} className="flex items-center space-x-2">
              <input
                type="checkbox"
                value={lang}
                {...register('languages', { required: 'At least one language is required' })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{lang}</span>
            </label>
          ))}
        </div>
        {errors.languages && (
          <p className="text-red-500 text-xs mt-1">{errors.languages.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Current Practice Area
        </label>
        <textarea
          {...register('currentPracticeArea')}
          rows={3}
          placeholder="Describe your current practice area and experience..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>
    </div>
  );

  const renderEducationInfo = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Education Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Law Degree *
          </label>
          <select
            {...register('lawDegree', { required: 'Law degree is required' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Degree</option>
            <option value="LLB">LLB</option>
            <option value="BA LLB">BA LLB</option>
            <option value="BBA LLB">BBA LLB</option>
            <option value="LLM">LLM</option>
            <option value="Other">Other</option>
          </select>
          {errors.lawDegree && (
            <p className="text-red-500 text-xs mt-1">{errors.lawDegree.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            University/Institution *
          </label>
          <input
            {...register('university', { required: 'University is required' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.university && (
            <p className="text-red-500 text-xs mt-1">{errors.university.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Graduation Year *
          </label>
          <input
            type="number"
            {...register('graduationYear', { required: 'Graduation year is required' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.graduationYear && (
            <p className="text-red-500 text-xs mt-1">{errors.graduationYear.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Additional Qualifications
        </label>
        <textarea
          {...register('additionalQualifications')}
          rows={4}
          placeholder="List any additional qualifications, certifications, or courses (one per line)..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>
    </div>
  );

  const renderDocumentUpload = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Document Upload</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { key: 'profilePhoto', label: 'Profile Photo', required: true },
          { key: 'lawDegree', label: 'Law Degree Certificate', required: true },
          { key: 'barCouncilCertificate', label: 'Bar Council Certificate', required: true },
          { key: 'idProof', label: 'Government ID Proof', required: true },
          { key: 'experienceCertificate', label: 'Experience Certificate', required: false }
        ].map((doc) => (
          <div key={doc.key} className="border-2 border-dashed border-gray-300 rounded-lg p-6">
            <div className="text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-sm font-medium text-gray-900 mb-2">
                {doc.label} {doc.required && '*'}
              </h4>
              
              {uploadedFiles[doc.key] ? (
                <div className="text-green-600">
                  <Check className="h-5 w-5 mx-auto mb-1" />
                  <p className="text-xs">{uploadedFiles[doc.key].name}</p>
                </div>
              ) : (
                <div>
                  <input
                    type="file"
                    id={doc.key}
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(doc.key, file);
                    }}
                    className="hidden"
                  />
                  <label
                    htmlFor={doc.key}
                    className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload File
                  </label>
                  <p className="text-xs text-gray-500 mt-2">
                    PDF, JPG, PNG (Max 5MB)
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-yellow-800 mb-2">Important Notes:</h4>
        <ul className="text-xs text-yellow-700 space-y-1">
          <li>• All documents must be clear and legible</li>
          <li>• Profile photo should be professional</li>
          <li>• Certificates must be original or certified copies</li>
          <li>• Files should not exceed 5MB each</li>
          <li>• Supported formats: PDF, JPG, PNG</li>
        </ul>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Lawyer Registration</h1>
            <p className="text-gray-600 mt-2">Complete your profile to start practicing on VidyutLaw</p>
          </div>

          {renderStepIndicator()}

          <form onSubmit={handleSubmit(onSubmit)}>
            {currentStep === 1 && renderPersonalInfo()}
            {currentStep === 2 && renderProfessionalInfo()}
            {currentStep === 3 && renderEducationInfo()}
            {currentStep === 4 && renderDocumentUpload()}

            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={goToPreviousStep}
                  className="flex items-center px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </button>
              )}
              
              <button
                type="submit"
                className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 ml-auto"
              >
                {currentStep === 4 ? 'Submit for Verification' : 'Next'}
                {currentStep < 4 && <ArrowRight className="h-4 w-4 ml-2" />}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LawyerRegistration;