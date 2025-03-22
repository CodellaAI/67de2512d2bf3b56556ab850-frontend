
'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import PluginCard from './PluginCard';

export default function FeaturedPlugins() {
  const [plugins, setPlugins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedPlugins = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/plugins?featured=true&limit=4`);
        setPlugins(response.data);
      } catch (error) {
        console.error('Error fetching featured plugins:', error);
        toast.error('Failed to load featured plugins');
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedPlugins();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
            <div className="h-48 bg-gray-200"></div>
            <div className="p-4">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>
              <div className="h-10 bg-gray-200 rounded w-full mt-4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (plugins.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No featured plugins available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {plugins.map(plugin => (
        <PluginCard key={plugin._id} plugin={plugin} />
      ))}
    </div>
  );
}
