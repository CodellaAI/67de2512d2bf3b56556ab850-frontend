
import { formatDistanceToNow } from 'date-fns';
import { Download, Clock } from 'lucide-react';

export default function VersionHistory({ versions }) {
  if (!versions || versions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No version history available.</p>
      </div>
    );
  }

  // Sort versions by date, newest first
  const sortedVersions = [...versions].sort((a, b) => 
    new Date(b.releaseDate) - new Date(a.releaseDate)
  );

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Version History</h2>
      
      <div className="space-y-6">
        {sortedVersions.map((version, index) => (
          <div 
            key={index}
            className={`border-l-4 ${
              index === 0 ? 'border-primary-500' : 'border-gray-300'
            } pl-4 pb-6`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
              <h3 className="text-lg font-semibold flex items-center">
                v{version.versionNumber}
                {index === 0 && (
                  <span className="ml-2 bg-primary-100 text-primary-800 text-xs font-medium px-2 py-0.5 rounded">
                    Latest
                  </span>
                )}
              </h3>
              <div className="flex items-center text-sm text-gray-500 mt-1 sm:mt-0">
                <Clock className="h-4 w-4 mr-1" />
                <span>
                  Released {formatDistanceToNow(new Date(version.releaseDate), { addSuffix: true })}
                </span>
              </div>
            </div>
            
            <div className="text-gray-600 mb-3 whitespace-pre-line">
              {version.changelog || 'No changelog provided for this version.'}
            </div>
            
            <div className="flex items-center text-sm text-gray-500">
              <span className="mr-4">
                Minecraft {version.minecraftVersion}
              </span>
              <span className="flex items-center">
                <Download className="h-4 w-4 mr-1" />
                {version.downloadCount || 0} downloads
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
