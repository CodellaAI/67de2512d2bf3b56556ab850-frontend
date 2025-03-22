
import Link from 'next/link';
import Image from 'next/image';
import { Star, Download } from 'lucide-react';

export default function PluginCard({ plugin }) {
  if (!plugin) return null;
  
  return (
    <Link href={`/plugins/${plugin._id}`} className="card group transition-all duration-200 hover:-translate-y-1">
      <div className="relative h-48 w-full bg-gray-100">
        <Image
          src={plugin.thumbnailUrl || '/images/default-plugin.png'}
          alt={plugin.name}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200"></div>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{plugin.name}</h3>
          <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded">
            {plugin.category}
          </span>
        </div>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{plugin.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-400 mr-1" />
              <span>{plugin.averageRating ? plugin.averageRating.toFixed(1) : 'N/A'}</span>
            </div>
            <div className="flex items-center">
              <Download className="h-4 w-4 mr-1" />
              <span>{plugin.downloadCount || 0}</span>
            </div>
          </div>
          <div className="font-bold text-primary-700">${plugin.price.toFixed(2)}</div>
        </div>
      </div>
    </Link>
  );
}
