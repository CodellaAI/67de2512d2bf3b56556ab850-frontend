
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import { Search, Filter, Star, Tag, Download } from 'lucide-react';
import axios from 'axios';
import PluginCard from '@/components/PluginCard';

export default function Plugins() {
  const [plugins, setPlugins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortOption, setSortOption] = useState('newest');
  
  const categories = [
    'All',
    'Admin Tools',
    'Economy',
    'Game Mechanics',
    'Anti-Griefing',
    'Chat',
    'Minigames',
    'World Management',
    'Utility',
  ];

  useEffect(() => {
    fetchPlugins();
  }, [selectedCategory, sortOption]);

  const fetchPlugins = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedCategory && selectedCategory !== 'All') {
        params.category = selectedCategory;
      }
      params.sort = sortOption;
      
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/plugins`, { params });
      setPlugins(response.data);
    } catch (error) {
      toast.error('Failed to load plugins');
      console.error('Error fetching plugins:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchPlugins();
  };

  const filteredPlugins = plugins.filter(plugin => 
    plugin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plugin.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Minecraft Plugins</h1>
        <p className="text-gray-600">
          Browse our collection of high-quality Minecraft plugins
        </p>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-8">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search plugins..."
              className="input-field pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Tag className="h-5 w-5 text-gray-400" />
              </div>
              <select
                className="input-field pl-10 pr-8 appearance-none"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-5 w-5 text-gray-400" />
              </div>
              <select
                className="input-field pl-10 pr-8 appearance-none"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="newest">Newest</option>
                <option value="popular">Most Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
            
            <button type="submit" className="btn-primary">
              Search
            </button>
          </div>
        </form>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((category) => (
          <button
            key={category}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === category
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Plugins Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : filteredPlugins.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPlugins.map((plugin) => (
            <PluginCard key={plugin._id} plugin={plugin} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="mb-4">
            <Image
              src="/images/empty-state.svg"
              alt="No plugins found"
              width={200}
              height={200}
              className="mx-auto"
            />
          </div>
          <h3 className="text-xl font-semibold mb-2">No plugins found</h3>
          <p className="text-gray-600 mb-6">
            We couldn't find any plugins matching your criteria.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('');
              setSortOption('newest');
            }}
            className="btn-primary"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
