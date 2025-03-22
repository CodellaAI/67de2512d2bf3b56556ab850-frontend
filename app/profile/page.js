
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import { 
  User, 
  Mail, 
  Settings, 
  Package, 
  ShoppingBag, 
  Edit, 
  PlusCircle,
  LogOut
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import PluginCard from '@/components/PluginCard';

export default function Profile() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('plugins');
  const [myPlugins, setMyPlugins] = useState([]);
  const [purchasedPlugins, setPurchasedPlugins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }

    fetchUserData();
  }, [user, router, activeTab]);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'plugins') {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/plugins/user`,
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        setMyPlugins(response.data);
      } else if (activeTab === 'purchases') {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/purchases`,
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        setPurchasedPlugins(response.data);
      }
    } catch (error) {
      toast.error('Failed to load your data');
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
    toast.success('Logged out successfully');
  };

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
            <div className="flex flex-col items-center mb-6">
              <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <User className="h-12 w-12 text-primary-600" />
              </div>
              <h2 className="text-xl font-bold">{user.username}</h2>
              <p className="text-gray-600">{user.email}</p>
              <div className="mt-4 flex space-x-2">
                <Link href="/profile/settings" className="btn-secondary text-sm py-1 px-3 flex items-center">
                  <Settings className="h-4 w-4 mr-1" />
                  Settings
                </Link>
                <button 
                  onClick={handleLogout}
                  className="bg-red-100 hover:bg-red-200 text-red-700 font-semibold py-1 px-3 rounded-md shadow-sm transition-all duration-200 text-sm flex items-center"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Logout
                </button>
              </div>
            </div>
            
            <div className="space-y-2">
              <button
                className={`w-full text-left px-4 py-2 rounded-md flex items-center ${
                  activeTab === 'plugins'
                    ? 'bg-primary-50 text-primary-700'
                    : 'hover:bg-gray-100'
                }`}
                onClick={() => setActiveTab('plugins')}
              >
                <Package className="h-5 w-5 mr-2" />
                My Plugins
              </button>
              <button
                className={`w-full text-left px-4 py-2 rounded-md flex items-center ${
                  activeTab === 'purchases'
                    ? 'bg-primary-50 text-primary-700'
                    : 'hover:bg-gray-100'
                }`}
                onClick={() => setActiveTab('purchases')}
              >
                <ShoppingBag className="h-5 w-5 mr-2" />
                Purchased Plugins
              </button>
              <Link 
                href="/profile/settings"
                className={`w-full text-left px-4 py-2 rounded-md flex items-center ${
                  activeTab === 'settings'
                    ? 'bg-primary-50 text-primary-700'
                    : 'hover:bg-gray-100'
                }`}
              >
                <Settings className="h-5 w-5 mr-2" />
                Account Settings
              </Link>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="md:col-span-3">
          {activeTab === 'plugins' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">My Plugins</h2>
                <Link href="/plugins/upload" className="btn-primary flex items-center">
                  <PlusCircle className="mr-2 h-5 w-5" />
                  Upload New Plugin
                </Link>
              </div>
              
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
                </div>
              ) : myPlugins.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myPlugins.map((plugin) => (
                    <div key={plugin._id} className="relative">
                      <PluginCard plugin={plugin} />
                      <Link 
                        href={`/plugins/${plugin._id}/edit`}
                        className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
                      >
                        <Edit className="h-5 w-5 text-gray-700" />
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-lg shadow-md">
                  <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No plugins yet</h3>
                  <p className="text-gray-600 mb-6">
                    You haven't uploaded any plugins yet. Start sharing your creations with the community!
                  </p>
                  <Link href="/plugins/upload" className="btn-primary inline-flex items-center">
                    <PlusCircle className="mr-2 h-5 w-5" />
                    Upload Your First Plugin
                  </Link>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'purchases' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Purchased Plugins</h2>
              
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
                </div>
              ) : purchasedPlugins.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {purchasedPlugins.map((purchase) => (
                    <PluginCard key={purchase._id} plugin={purchase.plugin} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-lg shadow-md">
                  <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No purchases yet</h3>
                  <p className="text-gray-600 mb-6">
                    You haven't purchased any plugins yet. Explore our marketplace to find amazing plugins!
                  </p>
                  <Link href="/plugins" className="btn-primary inline-flex items-center">
                    Browse Plugins
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
