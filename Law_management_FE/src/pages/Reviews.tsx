import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, Filter, User, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Review, Lawyer } from '../types';
import { format } from 'date-fns';
import LoadingSpinner from '../components/Common/LoadingSpinner';

const Reviews: React.FC = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | '5' | '4' | '3' | '2' | '1'>('all');
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [responseText, setResponseText] = useState('');
  const [showAddReviewModal, setShowAddReviewModal] = useState(false);
  const [newReview, setNewReview] = useState({
    lawyerId: '',
    rating: 0,
    comment: ''
  });

  useEffect(() => {
    if (user?.id) {
      fetchReviews();
      if (user.role === 'client') fetchLawyers();
    }
  }, [user]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const endpoint =
        user?.role === 'lawyer'
          ? `http://localhost:8080/api/reviews/lawyer/${user.id}`
          : `http://localhost:8080/api/reviews/client/${user.id}`;
      const res = await fetch(endpoint);
      const data = await res.json();
      setReviews(data);
    } catch (err) {
      console.error('Failed to fetch reviews:', err);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchLawyers = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/lawyers');
      const data = await res.json();
      setLawyers(data.filter((l: Lawyer) => l.isVerified));
    } catch (err) {
      console.error('Failed to fetch lawyers:', err);
    }
  };

  const handleAddResponse = async () => {
    if (!selectedReview || !responseText.trim()) return;

    try {
      const res = await fetch(`http://localhost:8080/api/reviews/${selectedReview.id}/respond`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ response: responseText })
      });

      if (res.ok) {
        setReviews(prev =>
          prev.map(r =>
            r.id === selectedReview.id
              ? { ...r, response: responseText, updatedAt: new Date().toISOString() }
              : r
          )
        );
        setShowResponseModal(false);
        setSelectedReview(null);
        setResponseText('');
      }
    } catch (error) {
      console.error('Failed to send response:', error);
    }
  };

  const handleSubmitReview = async () => {
    if (!newReview.lawyerId || newReview.rating === 0 || !newReview.comment.trim()) return;

    try {
      const res = await fetch('http://localhost:8080/api/reviews/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newReview,
          clientId: user?.id
        })
      });

      if (res.ok) {
        const added = await res.json();
        setReviews(prev => [added, ...prev]);
        setShowAddReviewModal(false);
        setNewReview({ lawyerId: '', rating: 0, comment: '' });
      }
    } catch (err) {
      console.error('Failed to submit review:', err);
    }
  };

  const renderStars = (rating: number, onClick?: (r: number) => void) => (
    <div className="flex space-x-1 cursor-pointer">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          onClick={onClick ? () => onClick(star) : undefined}
          className={`h-5 w-5 ${star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'} ${
            onClick ? 'hover:scale-110 transition-transform' : ''
          }`}
        />
      ))}
    </div>
  );

  const filteredReviews = reviews.filter(
    (review) => filter === 'all' || review.rating === parseInt(filter)
  );

  if (loading) return <LoadingSpinner size="lg" text="Loading reviews..." />;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {user?.role === 'client' ? 'My Reviews' : 'Client Reviews'}
          </h1>
          <p className="text-gray-600">
            {user?.role === 'client'
              ? 'Reviews you’ve given to lawyers'
              : 'Feedback from your clients'}
          </p>
        </div>

        {user?.role === 'client' && (
          <button
            onClick={() => setShowAddReviewModal(true)}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            <Plus className="h-4 w-4" />
            Add Review
          </button>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-center gap-4">
          <Filter className="h-5 w-5 text-gray-400" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="all">All Reviews</option>
            {[5, 4, 3, 2, 1].map((s) => (
              <option key={s} value={s}>
                {s} Star{s > 1 ? 's' : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredReviews.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews found</h3>
          <p className="text-gray-600">
            {filter === 'all'
              ? 'No reviews available yet.'
              : `No ${filter}-star reviews found.`}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredReviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-start space-x-4">
                <img
                  src={
                    user?.role === 'client'
                      ? review.lawyer?.avatar
                      : review.client?.avatar
                  }
                  alt="Profile"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {user?.role === 'client'
                        ? review.lawyer?.name
                        : review.client?.name}
                    </h3>
                    {user?.role === 'lawyer' && !review.response && (
                      <button
                        onClick={() => {
                          setSelectedReview(review);
                          setShowResponseModal(true);
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                      >
                        Respond
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    {renderStars(review.rating)}
                    <span className="text-sm text-gray-600">
                      {format(new Date(review.createdAt), 'MMM dd, yyyy')}
                    </span>
                  </div>
                  <p className="text-gray-700 mt-3">{review.comment}</p>
                  {review.response && (
                    <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mt-4">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-900">
                          {user?.role === 'client' ? 'Lawyer Response' : 'Your Response'}
                        </span>
                      </div>
                      <p className="text-blue-800">{review.response}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Review Modal */}
      {showAddReviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6 space-y-4">
            <h3 className="text-xl font-semibold text-gray-900">Add a Review</h3>

            <select
              value={newReview.lawyerId}
              onChange={(e) => setNewReview((prev) => ({ ...prev, lawyerId: e.target.value }))}
              className="w-full border border-gray-300 p-2 rounded"
            >
              <option value="">Select Lawyer</option>
              {lawyers.map((lawyer) => (
                <option key={lawyer.id} value={lawyer.id}>
                  {lawyer.name}
                </option>
              ))}
            </select>

            <div>
              <label className="block mb-1 font-medium">Rating</label>
              {renderStars(newReview.rating, (r) =>
                setNewReview((prev) => ({ ...prev, rating: r }))
              )}
            </div>

            <textarea
              rows={4}
              placeholder="Your comment..."
              value={newReview.comment}
              onChange={(e) => setNewReview((prev) => ({ ...prev, comment: e.target.value }))}
              className="w-full border border-gray-300 p-3 rounded"
            />

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => {
                  setShowAddReviewModal(false);
                  setNewReview({ lawyerId: '', rating: 0, comment: '' });
                }}
                className="flex-1 border border-gray-300 rounded px-4 py-2 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitReview}
                disabled={!newReview.lawyerId || newReview.rating === 0 || !newReview.comment.trim()}
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lawyer Respond Modal */}
      {showResponseModal && selectedReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Respond to Review</h3>
            <textarea
              value={responseText}
              onChange={(e) => setResponseText(e.target.value)}
              placeholder="Write your response..."
              className="w-full p-3 border border-gray-300 rounded-lg resize-none"
              rows={4}
            />
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowResponseModal(false);
                  setSelectedReview(null);
                  setResponseText('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleAddResponse}
                disabled={!responseText.trim()}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                Send Response
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reviews;