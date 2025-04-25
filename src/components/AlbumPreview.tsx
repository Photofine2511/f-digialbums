import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AlbumPreviewProps {
  coverImage: string;
  imageCount: number;
  albumName: string;
  photographerName: string;
  onAlbumNameChange: (name: string) => void;
  onPhotographerNameChange: (name: string) => void;
  onSave: () => void;
  isSaving?: boolean;
}

const AlbumPreview = ({ 
  coverImage, 
  imageCount, 
  albumName,
  photographerName,
  onAlbumNameChange,
  onPhotographerNameChange,
  onSave,
  isSaving = false
}: AlbumPreviewProps) => {
  return (
    <Card className="p-6">
      <div className="aspect-[4/3] overflow-hidden rounded-lg mb-4">
        <img src={coverImage} alt="Album Cover" className="w-full h-full object-cover" />
      </div>
      
      <div className="space-y-4 mb-4">
        <div>
          <Label htmlFor="album-name" className="text-sm font-medium mb-2 block">
            Album Name
          </Label>
          <Input
            id="album-name"
            value={albumName}
            onChange={(e) => onAlbumNameChange(e.target.value)}
            placeholder="Enter album name"
          />
        </div>
        
        <div>
          <Label htmlFor="photographer-name" className="text-sm font-medium mb-2 block">
            Photographer Name
          </Label>
          <Input
            id="photographer-name"
            value={photographerName}
            onChange={(e) => onPhotographerNameChange(e.target.value)}
            placeholder="Enter photographer name"
          />
        </div>
        
        <p className="text-gray-500 text-sm">{imageCount} photos</p>
      </div>
      
      <Button 
        onClick={onSave} 
        className="bg-purple-600 hover:bg-purple-700 w-full"
        disabled={!albumName.trim() || isSaving}
      >
        {isSaving ? 'Saving...' : 'Save Album'}
      </Button>
    </Card>
  );
};

export default AlbumPreview;
