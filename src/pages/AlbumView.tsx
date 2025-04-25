import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getAlbumById, Album } from '@/services/albumService';
import { Card } from "@/components/ui/card";
import AlbumCarousel from '@/components/AlbumCarousel';
import { Camera } from 'lucide-react';

const AlbumView = () => {
  const { id } = useParams<{ id: string }>();
  const [album, setAlbum] = useState<Album | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [coverImageId, setCoverImageId] = useState<string | null>(null);

  useEffect(() => {
    const fetchAlbum = async () => {
      if (!id) {
        setLoading(false);
        return;
      }
      
      try {
        const albumData = await getAlbumById(id);
        setAlbum(albumData);
        
        // Set the cover image ID
        if (albumData?.images && albumData.images.length > 0) {
          setCoverImageId(albumData.images[0].id);
        }
      } catch (error) {
        console.error("Error fetching album:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlbum();
  }, [id]);

  if (loading) {
    return <div className="text-center py-8">Loading album...</div>;
  }

  if (!album) {
    return <div className="text-center py-8">Album not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-center break-words">{album.title}</h1>
        
        {album.photographerName && (
          <div className="flex items-center justify-center gap-1 mb-4 sm:mb-6 text-gray-700">
            <Camera className="h-4 w-4" />
            <span className="text-sm sm:text-base">{album.photographerName}</span>
          </div>
        )}
        
        {/* Album Carousel View */}
        <div className="mb-6 sm:mb-8">
          <AlbumCarousel 
            images={album.images}
            selectedCoverId={coverImageId}
          />
        </div>
        
        {/* Album Info */}
        <div className="mt-4 sm:mt-8 text-center">
          <p className="text-sm sm:text-base text-gray-600">{album.images.length} photos</p>
          <p className="text-sm sm:text-base text-gray-600">Created on {new Date(album.createdAt).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
};

export default AlbumView;
