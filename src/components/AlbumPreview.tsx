import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff } from 'lucide-react';

interface AlbumPreviewProps {
  coverImage: string;
  imageCount: number;
  albumName: string;
  photographerName: string;
  onAlbumNameChange: (name: string) => void;
  onPhotographerNameChange: (name: string) => void;
  onSave: (password?: string) => void;
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
  const [isPasswordProtected, setIsPasswordProtected] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSave = () => {
    onSave(isPasswordProtected ? password : undefined);
  };

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
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="password-protect" 
            checked={isPasswordProtected}
            onCheckedChange={(checked) => setIsPasswordProtected(!!checked)}
          />
          <Label htmlFor="password-protect" className="text-sm font-medium cursor-pointer">
            Password Protect Album
          </Label>
        </div>
        
        {isPasswordProtected && (
          <div>
            <Label htmlFor="album-password" className="text-sm font-medium mb-2 block">
              Album Password
            </Label>
            <div className="flex relative">
              <Input
                id="album-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
        )}
        
        <p className="text-gray-500 text-sm">{imageCount} photos</p>
      </div>
      
      <Button 
        onClick={handleSave} 
        className="bg-purple-600 hover:bg-purple-700 w-full"
        disabled={!albumName.trim() || (isPasswordProtected && !password) || isSaving}
      >
        {isSaving ? 'Saving...' : 'Save Album'}
      </Button>
    </Card>
  );
};

export default AlbumPreview;
