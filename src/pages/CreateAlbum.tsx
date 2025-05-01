import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ImageUploader from '@/components/ImageUploader';
import ImageGrid from '@/components/ImageGrid';
import AlbumCarousel from '@/components/AlbumCarousel';
import AlbumPreview from '@/components/AlbumPreview';
import { saveAlbum, Album } from '@/services/albumService';
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface UploadedImage {
  id: string;
  url: string;
  publicId?: string;
  file?: File;
}

const CreateAlbum = () => {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [selectedCoverId, setSelectedCoverId] = useState<string | null>(null);
  const [albumName, setAlbumName] = useState<string>("My Album");
  const [photographerName, setPhotographerName] = useState<string>("");
  const [step, setStep] = useState<'upload' | 'cover' | 'arrange'>('upload');
  const [saving, setSaving] = useState<boolean>(false);
  const navigate = useNavigate();

  // When uploading is complete, automatically select the first image as cover if none is selected
  useEffect(() => {
    if (images.length > 0 && !selectedCoverId && step === 'cover') {
      console.log(`Auto-selecting first image (ID: ${images[0].id}) as cover`);
      setSelectedCoverId(images[0].id);
    }
  }, [images, selectedCoverId, step]);

  const handleImagesSelected = useCallback((uploadedImages: UploadedImage[]) => {
    console.log("Images selected in CreateAlbum:", uploadedImages.length);
    
    if (uploadedImages.length === 0) {
      toast.error("No images selected");
      return;
    }
    
    // Store all the images at once to avoid state conflicts
    setImages(uploadedImages);
    
    // Set first image as default cover
    if (uploadedImages.length > 0 && !selectedCoverId) {
      console.log(`Setting first image (ID: ${uploadedImages[0].id}) as default cover`);
      setSelectedCoverId(uploadedImages[0].id);
    }
    
    // Move to cover selection step
    setStep('cover');
    
  }, [selectedCoverId]);

  const handleCoverSelect = useCallback((id: string) => {
    console.log(`Selected cover image with ID: ${id}`);
    setSelectedCoverId(id);
  }, []);

  const handleAlbumNameChange = useCallback((name: string) => {
    setAlbumName(name);
  }, []);

  const handlePhotographerNameChange = useCallback((name: string) => {
    setPhotographerName(name);
  }, []);

  const handleSaveAlbum = useCallback(async (password?: string) => {
    if (saving) return;
    
    if (!selectedCoverId || images.length === 0) {
      toast.error("Please select a cover image and ensure you've uploaded images");
      return;
    }

    if (!albumName.trim()) {
      toast.error("Please provide an album name");
      return;
    }

    try {
      setSaving(true);
      const coverImage = images.find(img => img.id === selectedCoverId)?.url || '';
      
      // Arrange images with cover image first
      const orderedImages = [
        ...images.filter(img => img.id === selectedCoverId),
        ...images.filter(img => img.id !== selectedCoverId)
      ];
      
      const newAlbum: Album = {
        id: `album-${Date.now()}`,
        title: albumName.trim(),
        photographerName: photographerName.trim() || undefined,
        coverImage: coverImage,
        coverImagePublicId: selectedCoverId,
        images: orderedImages,
        createdAt: new Date().toISOString()
      };

      console.log("Saving album with images:", newAlbum.images.length);
      console.log(password ? "Album will be password protected" : "Album will not have a password");
      
      const result = await saveAlbum(newAlbum, password);
      
      if (result) {
        toast.success(password ? "Password-protected album saved successfully!" : "Album saved successfully!");
        navigate('/albums');
      } else {
        toast.error("Failed to save album");
      }
    } catch (error) {
      console.error("Error saving album:", error);
      toast.error("Failed to save album");
    } finally {
      setSaving(false);
    }
  }, [images, selectedCoverId, albumName, photographerName, navigate, saving]);

  return (
    <div className="container mx-auto py-6 sm:py-8 bg-white dark:bg-gray-900 min-h-screen">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center text-gray-900 dark:text-white">Create New Album</h1>
      
      {step === 'upload' && (
        <div className="max-w-xl mx-auto">
          <ImageUploader onImagesSelected={handleImagesSelected} />
        </div>
      )}

      {step === 'cover' && (
        <div className="space-y-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-4 text-center text-gray-900 dark:text-white">Select Cover Photo</h2>
          <p className="text-center text-gray-600 dark:text-gray-300 mb-4">
            Choose which image will appear as the cover of your album.
            {images.length > 0 ? ` You've uploaded ${images.length} images.` : ' No images available.'}
          </p>
          
          {images.length > 0 ? (
            <>
              <ImageGrid
                images={images}
                onCoverSelect={handleCoverSelect}
                selectedCoverId={selectedCoverId}
              />
              <div className="flex justify-center mt-6">
                <Button 
                  onClick={() => setStep('arrange')}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                  disabled={!selectedCoverId}
                >
                  Continue
                </Button>
              </div>
            </>
          ) : (
            <div className="p-8 border border-red-300 dark:border-red-700 rounded-md bg-red-50 dark:bg-red-900/20 text-center">
              <p className="text-red-600 dark:text-red-400 font-medium">No images available for cover selection</p>
              <Button 
                onClick={() => setStep('upload')}
                className="mt-4 bg-red-600 hover:bg-red-700 text-white"
              >
                Go Back and Upload Images
              </Button>
            </div>
          )}
        </div>
      )}

      {step === 'arrange' && selectedCoverId && (
        <div className="space-y-6 sm:space-y-8">
          <h2 className="text-lg sm:text-xl font-semibold mb-4 text-center text-gray-900 dark:text-white">Preview Your Digital Album</h2>
          <p className="text-center text-gray-600 dark:text-gray-300 mb-4">
            Preview your album with {images.length} images. Your album cover is set.
          </p>
          <div className="grid grid-cols-1 gap-6 sm:gap-8">
            <AlbumCarousel 
              images={images}
              selectedCoverId={selectedCoverId}
            />
            <div className="w-full max-w-md mx-auto">
              <AlbumPreview
                coverImage={images.find(img => img.id === selectedCoverId)?.url || ''}
                imageCount={images.length}
                albumName={albumName}
                photographerName={photographerName}
                onAlbumNameChange={handleAlbumNameChange}
                onPhotographerNameChange={handlePhotographerNameChange}
                onSave={handleSaveAlbum}
                isSaving={saving}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateAlbum;
