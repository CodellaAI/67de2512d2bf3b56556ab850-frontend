
'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { X } from 'lucide-react';

export default function PluginDropzone({ 
  onFileDrop, 
  acceptedFileTypes = '', 
  maxSize = 10485760, // 10MB default
  currentFile = null,
  icon = null,
  text = 'Drop your file here, or click to browse'
}) {
  const [error, setError] = useState(null);

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (rejectedFiles && rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0];
      if (rejection.errors[0].code === 'file-too-large') {
        setError(`File is too large. Max size is ${formatFileSize(maxSize)}`);
      } else if (rejection.errors[0].code === 'file-invalid-type') {
        setError(`Invalid file type. Accepted types: ${acceptedFileTypes}`);
      } else {
        setError(rejection.errors[0].message);
      }
      return;
    }

    if (acceptedFiles && acceptedFiles.length > 0) {
      setError(null);
      onFileDrop(acceptedFiles[0]);
    }
  }, [onFileDrop, maxSize, acceptedFileTypes]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes ? { 'application/java-archive': ['.jar'] } : undefined,
    maxSize,
    multiple: false
  });

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="w-full">
      {currentFile ? (
        <div className="mt-1 flex justify-between items-center p-3 border border-gray-300 rounded-md bg-gray-50">
          <div className="flex items-center">
            {icon}
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">{currentFile.name}</p>
              <p className="text-xs text-gray-500">{formatFileSize(currentFile.size)}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onFileDrop(null)}
            className="text-red-500 hover:text-red-700"
          >
            <X size={20} />
          </button>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 ${
            isDragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300 border-dashed'
          } rounded-md cursor-pointer hover:bg-gray-50 transition-colors duration-150`}
        >
          <input {...getInputProps()} />
          <div className="space-y-1 text-center">
            <div className="mx-auto h-12 w-12 text-gray-400">
              {icon || (
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
              )}
            </div>
            <div className="flex text-sm text-gray-600">
              <label
                htmlFor="file-upload"
                className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none"
              >
                <span>{text}</span>
              </label>
            </div>
            <p className="text-xs text-gray-500">
              {acceptedFileTypes ? `${acceptedFileTypes} up to ${formatFileSize(maxSize)}` : `Up to ${formatFileSize(maxSize)}`}
            </p>
            {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
