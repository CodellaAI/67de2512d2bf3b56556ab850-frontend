
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Search, User, Package, ShoppingBag, LogOut, PlusCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
  };

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-200 ${
      isScrolled ? 'bg-white shadow-md' : 'bg-white bg-opacity-95'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold text-primary-700">
                MinecraftPluginBazaar
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              href="/plugins" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                pathname === '/plugins' 
                  ? 'text-primary-700 bg-primary-50'
                  : 'text-gray-700 hover:text-primary-700 hover:bg-primary-50'
              }`}
            >
              Plugins
            </Link>
            <Link 
              href="/plugins/upload" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                pathname === '/plugins/upload' 
                  ? 'text-primary-700 bg-primary-50'
                  : 'text-gray-700 hover:text-primary-700 hover:bg-primary-50'
              }`}
            >
              Upload
            </Link>
          </div>

          {/* Right side items */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search plugins..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {user ? (
              <div className="relative">
                <button
                  onClick={toggleProfile}
                  className="flex items-center text-gray-700 hover:text-primary-700 focus:outline-none"
                >
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-primary-600" />
                  </div>
                  <span className="ml-2 font-medium">{user.username}</span>
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                    <Link 
                      href="/profile" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </Link>
                    <Link 
                      href="/profile" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <Package className="h-4 w-4 mr-2" />
                      My Plugins
                    </Link>
                    <Link 
                      href="/plugins/upload" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Upload Plugin
                    </Link>
                    <Link 
                      href="/profile" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      onClick={() => {
                        setIsProfileOpen(false);
                      }}
                    >
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      Purchases
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link 
                  href="/auth/login" 
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary-700 hover:bg-primary-50"
                >
                  Login
                </Link>
                <Link 
                  href="/auth/signup" 
                  className="btn-primary text-sm"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary-700 hover:bg-primary-50 focus:outline-none"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link 
              href="/plugins" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                pathname === '/plugins' 
                  ? 'text-primary-700 bg-primary-50'
                  : 'text-gray-700 hover:text-primary-700 hover:bg-primary-50'
              }`}
              onClick={closeMenu}
            >
              Plugins
            </Link>
            <Link 
              href="/plugins/upload" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                pathname === '/plugins/upload' 
                  ? 'text-primary-700 bg-primary-50'
                  : 'text-gray-700 hover:text-primary-700 hover:bg-primary-50'
              }`}
              onClick={closeMenu}
            >
              Upload
            </Link>
            
            {/* Search on mobile */}
            <div className="px-3 py-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search plugins..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
            
            {/* User actions */}
            {user ? (
              <>
                <Link 
                  href="/profile" 
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-700 hover:bg-primary-50 flex items-center"
                  onClick={closeMenu}
                >
                  <User className="h-5 w-5 mr-2" />
                  Profile
                </Link>
                <Link 
                  href="/profile" 
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-700 hover:bg-primary-50 flex items-center"
                  onClick={closeMenu}
                >
                  <Package className="h-5 w-5 mr-2" />
                  My Plugins
                </Link>
                <Link 
                  href="/profile" 
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-700 hover:bg-primary-50 flex items-center"
                  onClick={closeMenu}
                >
                  <ShoppingBag className="h-5 w-5 mr-2" />
                  Purchases
                </Link>
                <button 
                  onClick={() => {
                    handleLogout();
                    closeMenu();
                  }}
                  className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-gray-100 flex items-center"
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  Logout
                </button>
              </>
            ) : (
              <div className="px-3 py-2 space-y-2">
                <Link 
                  href="/auth/login" 
                  className="block w-full px-3 py-2 rounded-md text-center text-base font-medium text-gray-700 hover:text-primary-700 border border-gray-300 hover:border-primary-500"
                  onClick={closeMenu}
                >
                  Login
                </Link>
                <Link 
                  href="/auth/signup" 
                  className="block w-full px-3 py-2 rounded-md text-center text-base font-medium text-white bg-primary-600 hover:bg-primary-700"
                  onClick={closeMenu}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
