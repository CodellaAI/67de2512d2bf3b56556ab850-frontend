
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, Star, Download, Tag } from 'lucide-react';
import FeaturedPlugins from '@/components/FeaturedPlugins';
import CategoryList from '@/components/CategoryList';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-700 to-primary-900 text-white py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                The Premier Marketplace for Minecraft Plugins
              </h1>
              <p className="text-lg md:text-xl mb-8 text-primary-100">
                Discover, buy, and sell high-quality Minecraft plugins created by the community.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/plugins" className="btn-primary flex items-center justify-center">
                  Browse Plugins <ChevronRight size={20} className="ml-2" />
                </Link>
                <Link href="/auth/signup" className="btn-secondary flex items-center justify-center">
                  Join Our Community
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative w-full max-w-md h-80">
                <div className="absolute top-0 right-0 w-64 h-64 bg-secondary-500 rounded-lg transform rotate-6 shadow-xl"></div>
                <div className="absolute top-10 left-10 w-64 h-64 bg-primary-300 rounded-lg transform -rotate-3 shadow-xl"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white p-6 rounded-lg shadow-2xl transform rotate-3">
                    <div className="w-48 h-48 relative">
                      <Image src="/images/minecraft-logo.png" alt="Minecraft Logo" fill className="object-contain" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Plugins */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Featured Plugins</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our handpicked selection of the most popular and highest-rated Minecraft plugins.
            </p>
          </div>
          <FeaturedPlugins />
          <div className="mt-12 text-center">
            <Link href="/plugins" className="btn-primary inline-flex items-center">
              View All Plugins <ChevronRight size={20} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Getting started with Minecraft Plugin Bazaar is easy. Here's how our platform works.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card p-6 text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Download size={24} className="text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Find Plugins</h3>
              <p className="text-gray-600">
                Browse our extensive collection of Minecraft plugins created by talented developers.
              </p>
            </div>
            <div className="card p-6 text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Tag size={24} className="text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Purchase</h3>
              <p className="text-gray-600">
                Buy plugins instantly with our simple one-click purchase system.
              </p>
            </div>
            <div className="card p-6 text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star size={24} className="text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Rate & Review</h3>
              <p className="text-gray-600">
                Share your experience and help others by rating and reviewing plugins you've used.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Plugin Categories</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Find exactly what you need by exploring our plugin categories.
            </p>
          </div>
          <CategoryList />
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-secondary-600 to-secondary-800 text-white">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Enhance Your Minecraft Server?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of server owners who have improved their Minecraft experience with our plugins.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/plugins" className="btn-primary">
              Browse Plugins
            </Link>
            <Link href="/auth/signup" className="bg-white hover:bg-gray-100 text-secondary-700 font-semibold py-2 px-4 rounded-md shadow-sm transition-all duration-200">
              Create an Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
