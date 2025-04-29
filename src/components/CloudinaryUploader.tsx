import React, { useState, useRef, useEffect } from 'react';
import { uploadImage, uploadMultipleImages } from '@/services/albumService';
import { Button } from '@/components/ui/button';
import { UploadCloud, AlertCircle, X } from 'lucide-react';

interface CloudinaryUploaderProps {
  onImageUploaded: (imageData: { id: string; url: string; publicId: string }) => void;
  onUploadStart?: () => void;
  onUploadComplete?: () => void;
  className?: string;
  allowMultiple?: boolean;
}

const CloudinaryUploader: React.FC<CloudinaryUploaderProps> = ({ 
  onImageUploaded,
  onUploadStart,
  onUploadComplete,
  className = '',
  allowMultiple = true
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [recentUploads, setRecentUploads] = useState<Array<{ id: string, success: boolean }>>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Log recent uploads for debugging
  useEffect(() => {
    if (recentUploads.length > 0) {
      console.log(`Recent uploads (${recentUploads.length}):`, 
        recentUploads.map(u => `${u.id} - ${u.success ? 'Success' : 'Failed'}`).join(', '));
    }
  }, [recentUploads]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    
    if (!files || files.length === 0) {
      return;
    }
    
    // Convert FileList to array
    const filesArray = Array.from(files);
    console.log(`Selected ${filesArray.length} files for upload:`, 
      filesArray.map(f => `${f.name} (${(f.size / 1024).toFixed(1)}KB)`).join(', '));
    
    // Validate file types and sizes
    const invalidTypeFile = filesArray.find(file => {
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/jpg'];
      return !validTypes.includes(file.type);
    });
    
    if (invalidTypeFile) {
      setError(`"${invalidTypeFile.name}" is not a valid image type. Please upload JPEG, PNG, GIF, or WebP files only.`);
      return;
    }
    
    const tooLargeFile = filesArray.find(file => file.size > 30 * 1024 * 1024);
    if (tooLargeFile) {
      setError(`"${tooLargeFile.name}" exceeds the 30MB size limit.`);
      return;
    }
    
    try {
      setUploading(true);
      setError(null);
      
      // Notify parent that upload is starting
      if (onUploadStart) {
        onUploadStart();
      }
      
      // For multiple files, always use the multiple upload endpoint when there's more than one file
      if (filesArray.length > 1) {
        console.log(`Uploading ${filesArray.length} files as a batch`);
        setUploadProgress(10); // Initial progress
        
        try {
          // Ensure we're using the multiple upload endpoint for multiple files
          const results = await uploadMultipleImages(filesArray);
          console.log('Multiple upload results:', results);
          
          if (results && Array.isArray(results)) {
            setUploadProgress(70);
            console.log(`Successfully uploaded ${results.length} images`);
            
            // Keep track of uploads for debugging
            const newUploads = results.map(r => ({ id: r.id, success: true }));
            setRecentUploads(prev => [...prev, ...newUploads]);
            
            // CRITICAL FIX: Process each image one by one to avoid state issues
            for (const result of results) {
              console.log('Processing image for parent component:', result);
              onImageUploaded(result);
            }
            
            setUploadProgress(100);
          } else {
            throw new Error('No results returned from server');
          }
        } catch (uploadError) {
          console.error('Failed to upload multiple images:', uploadError);
          setError(uploadError instanceof Error ? uploadError.message : 'Failed to upload images');
          throw uploadError;
        }
      } else {
        // Use single upload for a single file
        console.log(`Uploading single file: ${filesArray[0].name}`);
        setUploadProgress(10);
        
        const result = await uploadImage(filesArray[0]);
        
        if (result) {
          console.log(`Successfully uploaded ${filesArray[0].name}:`, result);
          
          // Keep track of upload for debugging
          setRecentUploads(prev => [...prev, { id: result.id, success: true }]);
          
          // Notify parent component
          onImageUploaded(result);
          setUploadProgress(100);
        } else {
          console.error(`Failed to upload ${filesArray[0].name}`);
          
          // Keep track of failed upload for debugging
          setRecentUploads(prev => [...prev, { id: 'failed-' + Date.now(), success: false }]);
          
          throw new Error(`Failed to upload image: ${filesArray[0].name}`);
        }
      }
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.message || 'Failed to upload image');
    } finally {
      setUploading(false);
      
      // Notify parent that upload is complete
      if (onUploadComplete) {
        onUploadComplete();
      }
      
      setTimeout(() => setUploadProgress(0), 1000); // Reset progress after a delay
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-center">
        <Button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="bg-purple-600 hover:bg-purple-700 flex gap-2 items-center px-6 py-2.5 text-base"
          disabled={uploading}
        >
          <UploadCloud className="h-5 w-5" />
          <span>{uploading ? `Uploading ${uploadProgress}%...` : 'Select Images'}</span>
        </Button>
        
        <input
          type="file"
          multiple={allowMultiple}
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/jpeg,image/png,image/gif,image/webp"
          disabled={uploading}
        />
      </div>
      
      {error && (
        <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-2 rounded-md">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="ml-auto text-gray-500 hover:text-gray-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
      
      {uploading && uploadProgress > 0 && (
        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
          <div 
            className="bg-purple-600 h-2.5 rounded-full transition-all duration-300" 
            style={{ width: `${uploadProgress}%` }}
          ></div>
        </div>
      )}
      
      {recentUploads.length > 0 && (
        <div className="text-xs text-gray-500">
          Recently uploaded: {recentUploads.length} files
        </div>
      )}
    </div>
  );
};

export default CloudinaryUploader; 