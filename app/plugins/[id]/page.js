
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { 
  Download, 
  ShoppingCart, 
  Star, 
  Calendar, 
  Tag, 
  User, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  MessageSquare,
  Check,
  ArrowLeft
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import VersionHistory from '@/components/VersionHistory';
import ReviewSection from '@/components/ReviewSection';
import { formatDistanceToNow } from 'date-fns';

export default function PluginDetails() {
  const { id } = useParams();
  const [plugin, setPlugin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('description');
  const [showFullDescription, setShowFullDescription] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    fetchPluginDetails();
  }, [id]);

  const fetchPluginDetails = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/plugins/${id}`);
      setPlugin(response.data);
    } catch (error) {
      toast.error('Failed to load plugin details');
      console.error('Error fetching plugin details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    if (!user) {
      toast.error('Please login to purchase this plugin');
      router.push('/auth/login');
      return;
    }

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/purchases`,
        { pluginId: id },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      toast.success('Plugin purchased successfully!');
      fetchPluginDetails(); // Refresh to update purchase status
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to purchase plugin');
    }
  };

  const handleDownload = async () => {
    if (!user) {
      toast.error('Please login to download this plugin');
      router.push('/auth/login');
      return;
    }

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/plugins/${id}/download`,
        { 
          headers: { Authorization: `Bearer ${user.token}` },
          responseType: 'blob'
        }
      );
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${plugin.name}.jar`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success('Download started!');
    } catch (error) {
      toast.error('Failed to download plugin');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!plugin) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Plugin Not Found</h2>
        <p className="mb-6">The plugin you're looking for doesn't exist or has been removed.</p>
        <Link href="/plugins" className="btn-primary">
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Plugins
        </Link>
      </div>
    );
  }

  const isOwned = user && plugin.purchases && plugin.purchases.some(purchase => 
    purchase.user.toString() === user.id
  );

  const isAuthor = user && plugin.author._id === user.id;

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/plugins" className="flex items-center text-primary-600 hover:text-primary-700 mb-6">
        <ArrowLeft className="mr-2 h-5 w-5" />
        Back to Plugins
      </Link>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Plugin Header */}
        <div className="bg-gradient-to-r from-primary-700 to-primary-900 text-white p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-24 h-24 relative rounded-lg overflow-hidden flex-shrink-0 bg-white">
              <Image
                src={plugin.thumbnailUrl || '/images/default-plugin.png'}
                alt={plugin.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-grow">
              <h1 className="text-3xl font-bold mb-2">{plugin.name}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  <span>By {plugin.author.username}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>Updated {formatDistanceToNow(new Date(plugin.updatedAt), { addSuffix: true })}</span>
                </div>
                <div className="flex items-center">
                  <Tag className="h-4 w-4 mr-1" />
                  <span>{plugin.category}</span>
                </div>
                <div className="flex items-center">
                  <Download className="h-4 w-4 mr-1" />
                  <span>{plugin.downloadCount} downloads</span>
                </div>
                <div className="flex items-center">
                  <Star className="h-4 w-4 mr-1 text-yellow-400" />
                  <span>{plugin.averageRating ? plugin.averageRating.toFixed(1) : 'No ratings'}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3 w-full md:w-auto">
              <div className="text-center bg-white bg-opacity-20 py-2 px-4 rounded-lg">
                <span className="text-2xl font-bold">${plugin.price.toFixed(2)}</span>
              </div>
              {isOwned || isAuthor ? (
                <button 
                  onClick={handleDownload}
                  className="btn-primary flex items-center justify-center"
                >
                  <Download className="mr-2 h-5 w-5" />
                  Download
                </button>
              ) : (
                <button 
                  onClick={handlePurchase}
                  className="btn-primary flex items-center justify-center"
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Purchase
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex overflow-x-auto">
            <button
              className={`py-4 px-6 font-medium text-sm focus:outline-none ${
                activeTab === 'description'
                  ? 'border-b-2 border-primary-600 text-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('description')}
            >
              Description
            </button>
            <button
              className={`py-4 px-6 font-medium text-sm focus:outline-none ${
                activeTab === 'versions'
                  ? 'border-b-2 border-primary-600 text-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('versions')}
            >
              Version History
            </button>
            <button
              className={`py-4 px-6 font-medium text-sm focus:outline-none ${
                activeTab === 'reviews'
                  ? 'border-b-2 border-primary-600 text-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('reviews')}
            >
              Reviews
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'description' && (
            <div>
              <div className={`prose max-w-none ${!showFullDescription && 'max-h-96 overflow-hidden relative'}`}>
                <h2 className="text-2xl font-bold mb-4">About this plugin</h2>
                <p className="whitespace-pre-line">{plugin.description}</p>
                
                {plugin.features && plugin.features.length > 0 && (
                  <>
                    <h3 className="text-xl font-semibold mt-6 mb-3">Features</h3>
                    <ul className="list-disc pl-5 space-y-2">
                      {plugin.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}

                {plugin.requirements && (
                  <>
                    <h3 className="text-xl font-semibold mt-6 mb-3">Requirements</h3>
                    <p className="whitespace-pre-line">{plugin.requirements}</p>
                  </>
                )}
              </div>
              
              {plugin.description.length > 300 && (
                <button
                  className="mt-4 text-primary-600 hover:text-primary-700 font-medium flex items-center"
                  onClick={() => setShowFullDescription(!showFullDescription)}
                >
                  {showFullDescription ? (
                    <>
                      Show Less <ChevronUp className="ml-1 h-5 w-5" />
                    </>
                  ) : (
                    <>
                      Show More <ChevronDown className="ml-1 h-5 w-5" />
                    </>
                  )}
                </button>
              )}
            </div>
          )}

          {activeTab === 'versions' && (
            <VersionHistory versions={plugin.versions} />
          )}

          {activeTab === 'reviews' && (
            <ReviewSection 
              pluginId={id} 
              reviews={plugin.reviews} 
              averageRating={plugin.averageRating}
              totalReviews={plugin.reviews?.length || 0}
              isOwned={isOwned}
            />
          )}
        </div>
      </div>
    </div>
  );
}
