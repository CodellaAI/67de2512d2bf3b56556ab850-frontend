
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Star, MessageSquare, ThumbsUp, Flag, ChevronDown, ChevronUp } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';

export default function ReviewSection({ pluginId, reviews = [], averageRating = 0, totalReviews = 0, isOwned = false }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please login to leave a review');
      router.push('/auth/login');
      return;
    }
    
    if (!isOwned) {
      toast.error('You need to purchase this plugin before leaving a review');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/plugins/${pluginId}/reviews`,
        { rating, comment },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      
      toast.success('Review submitted successfully!');
      setComment('');
      // Refresh the page to show the new review
      window.location.reload();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 3);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Reviews</h2>
      
      {/* Rating summary */}
      <div className="bg-gray-50 p-6 rounded-lg mb-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="text-5xl font-bold text-gray-900 mr-4">
              {averageRating ? averageRating.toFixed(1) : 'N/A'}
            </div>
            <div>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-5 w-5 ${
                      star <= Math.round(averageRating)
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Based on {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
              </p>
            </div>
          </div>
          
          {isOwned && (
            <button
              onClick={() => document.getElementById('write-review').scrollIntoView({ behavior: 'smooth' })}
              className="btn-primary"
            >
              Write a Review
            </button>
          )}
        </div>
      </div>
      
      {/* Reviews list */}
      {reviews.length > 0 ? (
        <div className="space-y-6 mb-8">
          {displayedReviews.map((review, index) => (
            <div key={index} className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center mb-2">
                    <div className="font-semibold mr-2">{review.user.username}</div>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${
                            star <= review.rating
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">
                    {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                  </p>
                </div>
                <button className="text-gray-400 hover:text-gray-500">
                  <Flag className="h-4 w-4" />
                </button>
              </div>
              <p className="text-gray-700 mb-4">{review.comment}</p>
              <div className="flex items-center text-sm text-gray-500">
                <button className="flex items-center mr-4 hover:text-gray-700">
                  <ThumbsUp className="h-4 w-4 mr-1" />
                  Helpful ({review.helpfulCount || 0})
                </button>
              </div>
            </div>
          ))}
          
          {reviews.length > 3 && (
            <button
              onClick={() => setShowAllReviews(!showAllReviews)}
              className="flex items-center justify-center w-full py-2 text-primary-600 hover:text-primary-700 font-medium"
            >
              {showAllReviews ? (
                <>
                  Show Less <ChevronUp className="ml-1 h-5 w-5" />
                </>
              ) : (
                <>
                  Show All Reviews <ChevronDown className="ml-1 h-5 w-5" />
                </>
              )}
            </button>
          )}
        </div>
      ) : (
        <div className="text-center py-8 bg-gray-50 rounded-lg mb-8">
          <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No reviews yet</h3>
          <p className="text-gray-600">
            Be the first to review this plugin!
          </p>
        </div>
      )}
      
      {/* Write a review form */}
      {isOwned ? (
        <div id="write-review" className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold mb-4">Write a Review</h3>
          <form onSubmit={handleSubmitReview}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rating
              </label>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`h-8 w-8 ${
                        star <= rating
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
                Your Review
              </label>
              <textarea
                id="comment"
                rows="4"
                className="input-field"
                placeholder="Share your experience with this plugin..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        </div>
      ) : user ? (
        <div className="bg-gray-50 p-6 rounded-lg text-center">
          <p className="mb-4">You need to purchase this plugin to leave a review.</p>
        </div>
      ) : (
        <div className="bg-gray-50 p-6 rounded-lg text-center">
          <p className="mb-4">Please login to leave a review.</p>
          <button
            onClick={() => router.push('/auth/login')}
            className="btn-primary"
          >
            Login to Review
          </button>
        </div>
      )}
    </div>
  );
}
