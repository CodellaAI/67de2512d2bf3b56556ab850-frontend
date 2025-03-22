
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { Upload, X, Plus, FileText } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import PluginDropzone from '@/components/PluginDropzone';

export default function UploadPlugin() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [pluginFile, setPluginFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [features, setFeatures] = useState(['']);
  
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    description: '',
    version: '1.0.0',
    requirements: '',
    minecraftVersion: '',
  });

  const categories = [
    'Admin Tools',
    'Economy',
    'Game Mechanics',
    'Anti-Griefing',
    'Chat',
    'Minigames',
    'World Management',
    'Utility',
    'Other',
  ];

  useEffect(() => {
    // Check if user is logged in
    if (!user) {
      toast.error('Please login to upload plugins');
      router.push('/auth/login');
    }
  }, [user, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnailFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFeatureChange = (index, value) => {
    const updatedFeatures = [...features];
    updatedFeatures[index] = value;
    setFeatures(updatedFeatures);
  };

  const addFeature = () => {
    setFeatures([...features, '']);
  };

  const removeFeature = (index) => {
    const updatedFeatures = features.filter((_, i) => i !== index);
    setFeatures(updatedFeatures);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!pluginFile) {
      toast.error('Please upload a plugin JAR file');
      return;
    }

    if (!thumbnailFile) {
      toast.error('Please upload a thumbnail image');
      return;
    }

    const filteredFeatures = features.filter(feature => feature.trim() !== '');

    setLoading(true);
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('version', formData.version);
      formDataToSend.append('minecraftVersion', formData.minecraftVersion);
      formDataToSend.append('requirements', formData.requirements);
      
      filteredFeatures.forEach((feature, index) => {
        formDataToSend.append(`features[${index}]`, feature);
      });
      
      formDataToSend.append('pluginFile', pluginFile);
      formDataToSend.append('thumbnailFile', thumbnailFile);

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/plugins`,
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      toast.success('Plugin uploaded successfully!');
      router.push('/plugins');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload plugin');
      console.error('Error uploading plugin:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Upload a New Plugin</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Plugin Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="input-field"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                  Price (USD) *
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  className="input-field"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  className="input-field"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="version" className="block text-sm font-medium text-gray-700 mb-1">
                  Version *
                </label>
                <input
                  type="text"
                  id="version"
                  name="version"
                  className="input-field"
                  value={formData.version}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="minecraftVersion" className="block text-sm font-medium text-gray-700 mb-1">
                  Minecraft Version *
                </label>
                <input
                  type="text"
                  id="minecraftVersion"
                  name="minecraftVersion"
                  className="input-field"
                  placeholder="e.g. 1.19.2, 1.20+"
                  value={formData.minecraftVersion}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="mb-6">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                rows="6"
                className="input-field"
                value={formData.description}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Features
              </label>
              {features.map((feature, index) => (
                <div key={index} className="flex items-center mb-2">
                  <input
                    type="text"
                    className="input-field"
                    value={feature}
                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                    placeholder={`Feature ${index + 1}`}
                  />
                  {features.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addFeature}
                className="flex items-center text-primary-600 hover:text-primary-700 font-medium text-sm mt-2"
              >
                <Plus size={16} className="mr-1" /> Add Feature
              </button>
            </div>
            
            <div className="mb-6">
              <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-1">
                Requirements
              </label>
              <textarea
                id="requirements"
                name="requirements"
                rows="3"
                className="input-field"
                value={formData.requirements}
                onChange={handleChange}
                placeholder="List any dependencies or requirements for your plugin"
              ></textarea>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Plugin JAR File *
                </label>
                <PluginDropzone 
                  onFileDrop={(file) => setPluginFile(file)} 
                  acceptedFileTypes=".jar"
                  currentFile={pluginFile}
                  icon={<FileText size={24} />}
                  text="Drop your JAR file here, or click to browse"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Thumbnail Image *
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  {thumbnailPreview ? (
                    <div className="text-center">
                      <img
                        src={thumbnailPreview}
                        alt="Thumbnail preview"
                        className="mx-auto h-32 w-32 object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setThumbnailFile(null);
                          setThumbnailPreview(null);
                        }}
                        className="mt-2 inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-1 text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="thumbnail-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none"
                        >
                          <span>Upload a thumbnail</span>
                          <input
                            id="thumbnail-upload"
                            name="thumbnail-upload"
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            onChange={handleThumbnailChange}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 2MB</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => router.back()}
                className="btn-secondary mr-4"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary flex items-center"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-5 w-5" />
                    Upload Plugin
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
