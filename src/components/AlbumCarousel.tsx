import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { Button } from './ui/button';
import { ChevronLeft, ChevronRight, Maximize, Minimize, X } from 'lucide-react';

// Add custom CSS for page turning animations and fullscreen mode
const customStyles = `
  .embla__slide {
    position: relative;
    transition: transform 0.5s cubic-bezier(0.25, 1, 0.5, 1);
  }

  .embla__slide--turning {
    transform: perspective(1200px) rotateY(-20deg);
    transform-origin: right center;
    box-shadow: -10px 0px 25px rgba(0, 0, 0, 0.2);
    z-index: 2;
  }

  .embla__slide--next {
    transform: perspective(1200px) rotateY(0deg);
    transform-origin: left center;
    z-index: 1;
  }

  .page-fold {
    position: absolute;
    top: 0;
    right: 0;
    height: 100%;
    width: 40px;
    background: linear-gradient(to left, rgba(0,0,0,0.1), transparent);
    border-left: 1px solid rgba(0,0,0,0.05);
    pointer-events: none;
  }

  .page-shadow {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    box-shadow: inset 0 0 20px rgba(0,0,0,0.15);
    pointer-events: none;
    border-radius: 5px;
  }
  
  .fullscreen-carousel {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.9);
    z-index: 9999;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 1rem;
    overflow: hidden;
  }
  
  .fullscreen-carousel .embla__slide img {
    max-height: 80vh;
    object-fit: contain;
  }
  
  .fullscreen-controls {
    position: absolute;
    top: 1rem;
    right: 1rem;
    display: flex;
    gap: 0.5rem;
    z-index: 10000;
  }
  
  .fullscreen-nav {
    display: flex;
    justify-content: space-between;
    width: 100%;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 10000;
    pointer-events: none;
  }
  
  .fullscreen-nav button {
    pointer-events: auto;
  }

  /* Desktop album container size constraints */
  @media (min-width: 1024px) {
    .album-container {
      max-width: 800px;
      margin-left: auto;
      margin-right: auto;
    }
    
    .album-container .aspect-5-3 {
      max-height: 480px;
    }
  }

  /* Medium screen size constraints */
  @media (min-width: 641px) and (max-width: 1023px) {
    .album-container {
      max-width: 650px;
      margin-left: auto;
      margin-right: auto;
    }
  }

  @media (max-width: 640px) {
    .album-container {
      padding: 0 !important;
    }
    
    .album-container .embla__slide {
      padding: 0 !important;
    }
    
    .album-navigation {
      flex-wrap: wrap;
      justify-content: center;
    }
    
    .album-navigation .nav-buttons {
      order: 1;
      width: 100%;
      display: flex;
      justify-content: space-between;
      margin-top: 0.5rem;
    }
    
    .fullscreen-nav button {
      margin: 0 0.5rem;
    }
    
    .page-info {
      order: 0;
      margin-bottom: 0.5rem;
    }
  }
`;

interface AlbumCarouselProps {
  images: { id: string; url: string }[];
  selectedCoverId?: string | null;
}

const AlbumCarousel = ({ images, selectedCoverId }: AlbumCarouselProps) => {
  // Sort images to ensure cover is first
  const sortedImages = [
    ...images.filter(img => img.id === selectedCoverId),
    ...images.filter(img => img.id !== selectedCoverId)
  ];
  
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: false,
    axis: 'x',
    startIndex: 0,
    dragFree: false,
    duration: 30 // Use duration instead of speed for transition timing
  });
  
  const [fullscreenEmblaRef, fullscreenEmblaApi] = useEmblaCarousel({ 
    loop: false,
    axis: 'x',
    startIndex: 0,
    dragFree: false,
    duration: 30
  });
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const scrollPrev = useCallback(() => {
    const api = isFullscreen ? fullscreenEmblaApi : emblaApi;
    if (api && !isTransitioning) {
      setIsTransitioning(true);
      api.scrollPrev();
      setTimeout(() => setIsTransitioning(false), 500);
    }
  }, [emblaApi, fullscreenEmblaApi, isTransitioning, isFullscreen]);

  const scrollNext = useCallback(() => {
    const api = isFullscreen ? fullscreenEmblaApi : emblaApi;
    if (api && !isTransitioning) {
      setIsTransitioning(true);
      api.scrollNext();
      setTimeout(() => setIsTransitioning(false), 500);
    }
  }, [emblaApi, fullscreenEmblaApi, isTransitioning, isFullscreen]);

  const toggleFullscreen = useCallback(() => {
    const newFullscreenState = !isFullscreen;
    setIsFullscreen(newFullscreenState);
    
    // Sync the regular carousel index with fullscreen carousel
    if (newFullscreenState && fullscreenEmblaApi && emblaApi) {
      setTimeout(() => {
        fullscreenEmblaApi.scrollTo(emblaApi.selectedScrollSnap());
      }, 100);
    } else if (!newFullscreenState && emblaApi && fullscreenEmblaApi) {
      setTimeout(() => {
        emblaApi.scrollTo(fullscreenEmblaApi.selectedScrollSnap());
      }, 100);
    }
  }, [isFullscreen, emblaApi, fullscreenEmblaApi]);

  const onSelect = useCallback(() => {
    const api = isFullscreen ? fullscreenEmblaApi : emblaApi;
    if (!api) return;
    
    setCurrentIndex(api.selectedScrollSnap());
    setCanScrollPrev(api.canScrollPrev());
    setCanScrollNext(api.canScrollNext());
  }, [emblaApi, fullscreenEmblaApi, isFullscreen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      } else if (e.key === 'ArrowLeft') {
        scrollPrev();
      } else if (e.key === 'ArrowRight') {
        scrollNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, scrollPrev, scrollNext]);

  useEffect(() => {
    if (!emblaApi) return;
    
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    if (!fullscreenEmblaApi) return;
    
    fullscreenEmblaApi.on('select', onSelect);
    fullscreenEmblaApi.on('reInit', onSelect);
    
    return () => {
      fullscreenEmblaApi.off('select', onSelect);
      fullscreenEmblaApi.off('reInit', onSelect);
    };
  }, [fullscreenEmblaApi, onSelect]);

  return (
    <>
      <style>{customStyles}</style>
      <div className="relative w-full mx-auto">
        {/* Regular Album Container */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl album-container">
          <div className="relative overflow-hidden rounded-md" ref={emblaRef}>
            <div className="flex bg-white dark:bg-gray-800 rounded-md">
              {sortedImages.map((image, index) => (
                <div 
                  key={image.id} 
                  className={`flex-[0_0_100%] min-w-0 relative embla__slide ${
                    isTransitioning && index === currentIndex ? 'embla__slide--turning' : ''
                  } ${
                    isTransitioning && index === currentIndex + 1 ? 'embla__slide--next' : ''
                  }`}
                >
                  <div className="aspect-[5/3] relative overflow-hidden rounded-md p-2 bg-white dark:bg-gray-800 aspect-5-3">
                    <div className="h-full w-full relative">
                      <img 
                        src={image.url} 
                        alt={`Album page ${index + 1}`} 
                        className="w-full h-full object-cover rounded-sm"
                      />
                      
                      {/* Page fold effect */}
                      <div className="page-fold"></div>
                      <div className="page-shadow"></div>
                      
                      {/* Page number */}
                      <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                        {index + 1} / {sortedImages.length}
                      </div>
                      
                      {index === 0 && (
                        <div className="absolute top-0 left-0 w-full p-4 bg-gradient-to-b from-black to-transparent">
                          <h3 className="text-white text-lg font-semibold">My Album</h3>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Navigation buttons */}
          <div className="flex justify-between items-center mt-4 album-navigation">
            <div className="text-sm text-gray-600 dark:text-gray-300 font-medium flex items-center gap-2 page-info">
              <span>Page {currentIndex + 1} of {sortedImages.length}</span>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-purple-100 dark:hover:bg-purple-900"
                onClick={toggleFullscreen}
              >
                <Maximize className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex gap-2 nav-buttons">
              <Button 
                onClick={scrollPrev} 
                disabled={!canScrollPrev || isTransitioning}
                variant="outline"
                size="icon"
                className="rounded-full hover:bg-purple-100 dark:hover:bg-purple-900 transition-all"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              
              <Button 
                onClick={scrollNext} 
                disabled={!canScrollNext || isTransitioning}
                variant="outline"
                size="icon"
                className="rounded-full hover:bg-purple-100 dark:hover:bg-purple-900 transition-all"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Fullscreen Mode */}
      {isFullscreen && (
        <div className="fullscreen-carousel">
          <div className="fullscreen-controls">
            <Button 
              size="icon" 
              variant="outline" 
              className="rounded-full bg-black/50 text-white border-none hover:bg-black/70"
              onClick={toggleFullscreen}
            >
              <Minimize className="w-5 h-5" />
            </Button>
            <Button 
              size="icon" 
              variant="outline" 
              className="rounded-full bg-black/50 text-white border-none hover:bg-black/70"
              onClick={() => setIsFullscreen(false)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          
          <div className="fullscreen-nav">
            <Button 
              onClick={scrollPrev} 
              disabled={!canScrollPrev || isTransitioning}
              variant="outline"
              size="icon"
              className="rounded-full bg-black/50 text-white border-none hover:bg-black/70 ml-4"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            
            <Button 
              onClick={scrollNext} 
              disabled={!canScrollNext || isTransitioning}
              variant="outline"
              size="icon"
              className="rounded-full bg-black/50 text-white border-none hover:bg-black/70 mr-4"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>
          
          <div className="relative overflow-hidden rounded-md flex-1" ref={fullscreenEmblaRef}>
            <div className="flex h-full">
              {sortedImages.map((image, index) => (
                <div key={image.id} className="flex-[0_0_100%] min-w-0 relative h-full flex items-center justify-center">
                  <img 
                    src={image.url} 
                    alt={`Album page ${index + 1}`} 
                    className="max-h-[80vh] max-w-[90vw] object-contain rounded-sm"
                  />
                  
                  {/* Page number */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded text-sm">
                    {index + 1} / {sortedImages.length}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AlbumCarousel; 