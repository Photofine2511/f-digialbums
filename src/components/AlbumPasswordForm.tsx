import React, { useState, useEffect, useRef } from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock } from 'lucide-react';
import { verifyAlbumPassword, Album } from '@/services/albumService';
import { toast } from "sonner";

interface AlbumPasswordFormProps {
  albumId: string;
  onPasswordVerified: (album: Album) => void;
}

const AlbumPasswordForm: React.FC<AlbumPasswordFormProps> = ({ albumId, onPasswordVerified }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  
  // Auto focus the password input when component mounts
  useEffect(() => {
    if (passwordInputRef.current) {
      passwordInputRef.current.focus();
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!password) {
      setError('Please enter a password');
      return;
    }

    setLoading(true);

    try {
      const result = await verifyAlbumPassword(albumId, password);
      
      if (result.success && result.album) {
        onPasswordVerified(result.album);
      } else {
        setError(result.message || 'Invalid password');
        toast.error('Invalid password');
        // Clear the password field for retry
        setPassword('');
        // Re-focus the password input
        if (passwordInputRef.current) {
          passwordInputRef.current.focus();
        }
      }
    } catch (error) {
      console.error('Error verifying password:', error);
      setError('Failed to verify password. Please try again.');
      toast.error('Failed to verify password');
      // Clear the password field for retry
      setPassword('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-10 sm:py-12 max-w-sm">
      <Card className="p-6 space-y-4">
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
            <Lock className="w-6 h-6 text-purple-600" />
          </div>
          <h1 className="text-xl font-bold text-center">Password Protected Album</h1>
          <p className="text-sm text-gray-500 text-center">
            This album is protected by a password. Please enter the password to view it.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <Input
              ref={passwordInputRef}
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={error ? "border-red-500" : ""}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !loading) {
                  handleSubmit(e);
                }
              }}
            />
            {error && <p className="text-red-500 text-xs">{error}</p>}
          </div>
          <Button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700"
            disabled={loading}
          >
            {loading ? "Verifying..." : "Unlock Album"}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default AlbumPasswordForm; 