import React, { useState, useEffect } from 'react';
import { Search, Filter, MapPin, DollarSign, Briefcase } from 'lucide-react';
import axios from 'axios';
import { Lawyer } from '../types';
import LawyerCard from '../components/Lawyer/LawyerCard';
import LoadingSpinner from '../components/Common/LoadingSpinner';

const FindLawyers: React.FC = () => {
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [filteredLawyers, setFilteredLawyers] = useState<Lawyer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    specialization: '',
    location: '',
    maxFee: 10000,
    experience: 0,
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchLawyers();
  }, []);

  useEffect(() => {
    filterLawyers();
  }, [searchTerm, filters, lawyers]);

  const fetchLawyers = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:8080/api/lawyers');
      // ✅ Filter only verified lawyers
      const verifiedLawyers = res.data.filter((lawyer: Lawyer) => lawyer.isVerified === true);
      setLawyers(verifiedLawyers);
    } catch (err) {
      console.error('Error fetching lawyers:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterLawyers = () => {
    let filtered = [...lawyers];

    if (searchTerm) {
      filtered = filtered.filter(lawyer =>
        lawyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lawyer.specializations.some(spec =>
          spec.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    if (filters.specialization) {
      filtered = filtered.filter(lawyer =>
        lawyer.specializations.includes(filters.specialization)
      );
    }

    if (filters.location) {
      filtered = filtered.filter(lawyer =>
        lawyer.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.maxFee < 10000) {
      filtered = filtered.filter(lawyer => lawyer.consultationFee <= filters.maxFee);
    }

    if (filters.experience > 0) {
      filtered = filtered.filter(lawyer => lawyer.yearsOfExperience >= filters.experience);
    }

    setFilteredLawyers(filtered);
  };

  const specializations = [
    'Corporate Law', 'Criminal Law', 'Family Law', 'Property Law',
    'Civil Law', 'Contract Law', 'Tax Law', 'Labor Law'
  ];

  if (loading) {
    return <LoadingSpinner size="lg" text="Finding lawyers for you..." />;
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Find Legal Experts</h1>
        <p className="text-gray-600">Connect with verified lawyers for your legal needs</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-blue-600" />
            <input
              type="text"
              placeholder="Search by name or specialization..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <Filter className="h-5 w-5 mr-2 text-purple-600" /> Filters
          </button>
        </div>

        {showFilters && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                <select
                  value={filters.specialization}
                  onChange={(e) => setFilters(prev => ({ ...prev, specialization: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Specializations</option>
                  {specializations.map(spec => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-red-600" />
                  <input
                    type="text"
                    placeholder="City, State"
                    value={filters.location}
                    onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Fee (₹)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-green-600" />
                  <input
                    type="number"
                    placeholder="5000"
                    value={filters.maxFee}
                    onChange={(e) => setFilters(prev => ({ ...prev, maxFee: Number(e.target.value) }))}
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Min Experience (years)</label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-3 h-4 w-4 text-yellow-600" />
                  <input
                    type="number"
                    placeholder="5"
                    value={filters.experience}
                    onChange={(e) => setFilters(prev => ({ ...prev, experience: Number(e.target.value) }))}
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mb-4">
        <p className="text-gray-600">
          Showing {filteredLawyers.length} verified lawyer{filteredLawyers.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="grid gap-6">
        {filteredLawyers.map(lawyer => (
          <LawyerCard key={lawyer.id} lawyer={lawyer} />
        ))}
      </div>

      {filteredLawyers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No verified lawyers found matching your criteria.</p>
          <p className="text-gray-400 mt-2">Try adjusting your filters or search terms.</p>
        </div>
      )}
    </div>
  );
};

export default FindLawyers;
