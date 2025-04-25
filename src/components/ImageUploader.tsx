import React, { useState, useEffect, useCallback } from 'react';
import CloudinaryUploader from './CloudinaryUploader';
import { Button } from './ui/button';
import { ImagePlus, Loader2, UploadCloud } from 'lucide-react';
import { Card } from './ui/card';

interface UploadedImage {
  id: string;
  url: string;
  publicId: string;
}

interface ImageUploaderProps {
  onImagesSelected: (images: UploadedImage[]) => void;
  buttonText?: string;
  continueText?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImagesSelected,
  buttonText = "Upload Images",
  continueText = "Continue with Selected Images"
}) => {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Automatically call onImagesSelected when images are added
  useEffect(() => {
    if (uploadedImages.length > 0 && !isUploading) {
      onImagesSelected(uploadedImages);
    }
  }, [uploadedImages, isUploading, onImagesSelected]);

  const handleImageUploaded = useCallback((image: UploadedImage) => {
    console.log('Image uploaded callback received:', image);
    
    // Check if this image is already in our list (avoid duplicates)
    setUploadedImages(prevImages => {
      // Check if this image is already in the list by comparing ids
      const isDuplicate = prevImages.some(img => img.id === image.id);
      
      if (isDuplicate) {
        console.log('Duplicate image detected, not adding again:', image.id);
        return prevImages;
      }
      
      console.log('Adding new image to state:', image.id);
      return [...prevImages, image];
    });
  }, []);

  const handleUploadStart = useCallback(() => {
    console.log('Upload started');
    setIsUploading(true);
  }, []);

  const handleUploadComplete = useCallback(() => {
    console.log('Upload completed');
    setIsUploading(false);
  }, []);

  return (
    <div className="space-y-5 w-full">
      <Card className="p-8 border-2 border-dashed border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mb-4">
            <UploadCloud className="h-8 w-8 text-purple-600 dark:text-purple-400" />
          </div>
          
          <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">Upload Your Photos</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">
            Select images to create your digital album. You can upload multiple images at once.
          </p>
          
          <CloudinaryUploader 
            onImageUploaded={handleImageUploaded}
            onUploadStart={handleUploadStart}
            onUploadComplete={handleUploadComplete}
            className="w-full max-w-xs"
          />
        </div>
      </Card>
      
      {isUploading && (
        <div className="flex items-center justify-center p-4 text-gray-700 dark:text-gray-300">
          <Loader2 className="h-6 w-6 animate-spin text-purple-600 dark:text-purple-400 mr-2" />
          <span>Uploading images...</span>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
