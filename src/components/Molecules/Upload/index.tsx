'use client';

import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, X } from 'lucide-react';

interface UploadProps {
  onFileChange: (file: File | null) => void;
  className?: string;
}

export default function Upload({ onFileChange, className }: UploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
      onFileChange(selectedFile);

      const objectUrl = URL.createObjectURL(selectedFile);
      setPreview(objectUrl);
    }
  }, [onFileChange]);

  useEffect(() => {
    // Clean up the object URL on unmount
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.png', '.jpg', '.gif'] },
    maxFiles: 1,
  });

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setFile(null);
    setPreview(null);
    onFileChange(null);
  };

  return (
    <div
      {...getRootProps()}
      className={`relative border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer transition-colors hover:border-blue-500 ${isDragActive ? 'border-blue-500 bg-blue-50' : ''} ${className}`}
    >
      <input {...getInputProps()} />
      {preview && file ? (
        <div className="w-full h-24 flex items-center justify-center">
          <img src={preview} alt={file.name} className="max-h-full max-w-full object-contain rounded-md" />
          <button
            type="button"
            onClick={handleRemoveFile}
            className="absolute top-[-10px] right-[-10px] bg-red-500 text-white rounded-full p-1 z-10"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-2 text-gray-500 h-24">
          <UploadCloud size={32} />
          <p className="text-sm">Kéo thả hoặc nhấn để chọn ảnh</p>
        </div>
      )}
    </div>
  );
}
