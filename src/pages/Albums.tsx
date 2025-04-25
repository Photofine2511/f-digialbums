import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { getAllAlbums, Album } from '@/services/albumService';
import { QrCode, Link, Camera, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Albums = () => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const albumsData = await getAllAlbums();
        setAlbums(albumsData);
      } catch (error) {
        console.error("Error fetching albums:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlbums();
  }, []);

  const handleViewAlbum = (albumId: string) => {
    navigate(`/album/${albumId}`);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center">My Albums</h1>
        <div className="text-center py-8">Loading albums...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center">My Albums</h1>
      
      {albums.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <div className="bg-purple-100 rounded-full p-4 mb-4">
            <Plus className="h-8 w-8 text-purple-600" />
          </div>
          <h2 className="text-xl font-semibold mb-2">No Albums Yet</h2>
          <p className="text-gray-600 mb-4 max-w-md">
            Create your first digital album to showcase your memories
          </p>
          <Button onClick={() => navigate('/create')} className="bg-purple-600 hover:bg-purple-700">
            Create Album
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {albums.map((album) => (
            <Card key={album.id} className="overflow-hidden h-full flex flex-col">
              <div className="aspect-[4/3] relative">
                <img
                  src={album.coverImage}
                  alt={album.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3 sm:p-4 flex-1 flex flex-col">
                <h3 className="text-lg font-semibold mb-1 line-clamp-1">{album.title}</h3>
                
                {album.photographerName && (
                  <p className="text-xs sm:text-sm text-gray-700 mb-2 flex items-center gap-1">
                    <Camera className="h-3 w-3 flex-shrink-0" />
                    <span className="truncate">{album.photographerName}</span>
                  </p>
                )}
                
                <p className="text-xs sm:text-sm text-gray-500 mb-4">
                  {album.images.length} photos • {new Date(album.createdAt).toLocaleDateString()}
                </p>
                
                <div className="flex gap-2 mt-auto">
                  <Button
                    onClick={() => handleViewAlbum(album.id)}
                    className="flex-1 text-xs sm:text-sm py-1.5 px-3 h-auto"
                  >
                    View Album
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => navigate(`/album/${album.id}/share`)}
                    className="flex items-center gap-1 text-xs sm:text-sm py-1.5 px-2 h-auto"
                  >
                    <QrCode className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Share</span>
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Albums;
