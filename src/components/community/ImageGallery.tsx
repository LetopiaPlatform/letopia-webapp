import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface ImageGalleryProps {
  images: string[];
  isOpen: boolean;
  onClose: () => void;
  initialIndex?: number;
}

export function ImageGallery({ images, isOpen, onClose, initialIndex = 0 }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') goToPrevious();
    if (e.key === 'ArrowRight') goToNext();
    if (e.key === 'Escape') onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-8"
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-label="Image gallery"
      tabIndex={0}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/5 hover:bg-white/20 transition-colors"
        aria-label="Close gallery"
      >
        <X className="size-6 text-white" />
      </button>

      {/* Image container */}
      <div className="relative w-full max-w-3xl aspect-square">
        <img
          src={images[currentIndex]}
          alt={`Image ${currentIndex + 1} of ${images.length}`}
          className="w-full h-full object-contain"
        />

        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft className="size-6 text-white stroke-3" />
            </button>

            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              aria-label="Next image"
            >
              <ChevronRight className="size-6 text-white stroke-3" />
            </button>
          </>
        )}
      </div>

      {/* Image counter */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-black/50 text-white text-sm font-medium">
          {currentIndex + 1} / {images.length}
        </div>
      )}

      {/* Thumbnail navigation */}
      {images.length > 1 && (
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-2 overflow-x-auto px-4 py-2 max-w-2xl">
          {images.map((img, idx) => (
            <button
              key={img}
              onClick={() => setCurrentIndex(idx)}
              className={cn(
                'shrink-0 w-12 h-12 rounded-lg overflow-hidden border-2 transition-all',
                idx === currentIndex ? 'border-primary' : 'border-white/30 hover:border-white/50'
              )}
              aria-label={`Go to image ${idx + 1}`}
              aria-current={idx === currentIndex}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
