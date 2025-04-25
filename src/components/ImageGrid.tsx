import React, { useEffect } from 'react';
import { Card } from "@/components/ui/card";

interface ImageGridProps {
  images: { id: string; url: string }[];
  onCoverSelect?: (id: string) => void;
  selectedCoverId?: string | null;
  onReorder?: (dragIndex: number, hoverIndex: number) => void;
}

const ImageGrid = ({ images, onCoverSelect, selectedCoverId, onReorder }: ImageGridProps) => {
  // Add debugging for the component
  useEffect(() => {
    console.log('ImageGrid received images:', images.length);
    images.forEach((img, i) => {
      console.log(`  Image ${i+1}: id=${img.id}, url=${img.url.substring(0, 30)}...`);
    });
  }, [images]);

  // If no images, show a placeholder
  if (!images || images.length === 0) {
    return (
      <div className="border border-gray-300 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-800 text-center">
        <p className="text-gray-500 dark:text-gray-400">No images to display</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {images.map((image, index) => (
        <Card
          key={image.id}
          className={`relative overflow-hidden aspect-square cursor-pointer hover:ring-2 hover:ring-purple-500 transition-all
            ${selectedCoverId === image.id ? 'ring-2 ring-purple-600' : ''}`}
          onClick={() => {
            console.log(`Clicked on image ${index + 1}, id: ${image.id}`);
            onCoverSelect?.(image.id);
          }}
        >
          <img
            src={image.url}
            alt={`Image ${index + 1}`}
            className="w-full h-full object-cover"
            onError={(e) => {
              console.error(`Error loading image ${index + 1}:`, e);
              e.currentTarget.src = 'https://via.placeholder.com/150?text=Image+Error';
            }}
          />
          <div className="absolute top-0 right-0 bg-black bg-opacity-50 text-white px-2 py-1 text-xs">
            {index + 1}/{images.length}
          </div>
          {selectedCoverId === image.id && (
            <div className="absolute inset-0 bg-purple-600 bg-opacity-20 flex items-center justify-center">
              <span className="bg-white px-2 py-1 rounded text-sm font-medium">Cover</span>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
};

export default ImageGrid;