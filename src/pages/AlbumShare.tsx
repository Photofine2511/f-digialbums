import React, { useRef, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getAlbumById, Album } from '@/services/albumService';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QRCodeSVG } from 'qrcode.react';
import { Link, Download, Lock } from 'lucide-react';
import { toast } from "sonner";

const AlbumShare = () => {
  const { id } = useParams<{ id: string }>();
  const [album, setAlbum] = useState<Album | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const shareUrl = `${window.location.origin}/album/${id}`;
  const qrCodeRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const fetchAlbum = async () => {
      if (!id) {
        setLoading(false);
        return;
      }
      
      try {
        const albumData = await getAlbumById(id);
        setAlbum(albumData);
      } catch (error) {
        console.error("Error fetching album:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlbum();
  }, [id]);

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (!album) {
    return <div className="text-center py-8">Album not found</div>;
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    toast.success("Link copied to clipboard!");
  };

  const handleDownloadQRCode = () => {
    try {
      if (!qrCodeRef.current) return;
      
      // Get the SVG element
      const svgElement = qrCodeRef.current;
      
      // Create a canvas element
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      
      // Create a new image
      const img = new Image();
      
      // Convert SVG to a data URL
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
      const svgUrl = URL.createObjectURL(svgBlob);
      
      img.onload = () => {
        // Set canvas dimensions
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Draw white background
        if (ctx) {
          ctx.fillStyle = "white";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          // Draw the image on the canvas
          ctx.drawImage(img, 0, 0);
          
          // Create a download link
          const downloadLink = document.createElement("a");
          downloadLink.download = `${album.title.replace(/\s+/g, '-')}-QR-Code.png`;
          downloadLink.href = canvas.toDataURL("image/png");
          downloadLink.click();
          
          // Cleanup
          URL.revokeObjectURL(svgUrl);
        }
      };
      
      img.src = svgUrl;
      toast.success("QR Code download started!");
    } catch (error) {
      console.error("Error downloading QR code:", error);
      toast.error("Failed to download QR code");
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8 max-w-sm sm:max-w-md">
      <Card className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        <h1 className="text-xl sm:text-2xl font-bold text-center break-words">{album.title}</h1>
        <p className="text-center text-gray-600 text-sm sm:text-base">
          Share your album by using the QR code below
        </p>
        
        {album.isPasswordProtected && (
          <div className="flex items-center justify-center space-x-2 bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded-md">
            <Lock className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
            <p className="text-sm text-yellow-600 dark:text-yellow-400">
              Password protected album
            </p>
          </div>
        )}
        
        <div className="flex justify-center p-3 sm:p-4 bg-white rounded-lg">
          <QRCodeSVG 
            ref={qrCodeRef}
            value={shareUrl} 
            size={Math.min(window.innerWidth - 100, 240)} 
            bgColor="#FFFFFF"
            fgColor="#000000"
            level="H"
            includeMargin={true}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Button
            onClick={handleCopyLink}
            className="flex gap-2 items-center justify-center"
          >
            <Link className="w-4 h-4" />
            Copy Link
          </Button>
          <Button
            onClick={handleDownloadQRCode}
            variant="outline"
            className="flex gap-2 items-center justify-center border-purple-600 text-purple-600 hover:bg-purple-50"
          >
            <Download className="w-4 h-4" />
            Download QR
          </Button>
        </div>
        <p className="text-xs sm:text-sm text-gray-500 text-center">
          Print this QR code and attach it to your physical album
        </p>
        
        {album.isPasswordProtected && (
          <p className="text-xs text-center text-gray-500">
            Remember: Anyone with this QR code will need the password to view the album
          </p>
        )}
      </Card>
    </div>
  );
};

export default AlbumShare;
