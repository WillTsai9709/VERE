import { useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface GalleryImage {
  id: string;
  url: string;
  caption: string;
  thumbnail?: string;
}

interface GalleryModalProps {
  images: GalleryImage[];
  isOpen: boolean;
  currentIndex: number;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
}

const GalleryModal = ({
  images,
  isOpen,
  currentIndex,
  onClose,
  onPrevious,
  onNext,
}: GalleryModalProps) => {
  const currentImage = images[currentIndex];

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          onPrevious();
          break;
        case 'ArrowRight':
          onNext();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    // Prevent body scroll when modal is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose, onPrevious, onNext]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-zinc-900/95 flex flex-col justify-center items-center">
      {/* Close button */}
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-purple-400 transition-colors duration-300"
        aria-label="Close"
      >
        <X className="h-8 w-8" />
      </button>

      {/* Main image container */}
      <div className="relative h-full w-full flex items-center justify-center p-4">
        <img 
          src={currentImage.url}
          alt={currentImage.caption}
          className="max-w-full max-h-[80vh] object-contain"
        />
      </div>

      {/* Navigation buttons */}
      <button 
        onClick={onPrevious}
        className="absolute top-1/2 transform -translate-y-1/2 left-4 text-white hover:text-purple-400 transition-colors duration-300"
        aria-label="Previous image"
      >
        <ChevronLeft className="h-8 w-8" />
      </button>

      <button 
        onClick={onNext}
        className="absolute top-1/2 transform -translate-y-1/2 right-4 text-white hover:text-purple-400 transition-colors duration-300"
        aria-label="Next image"
      >
        <ChevronRight className="h-8 w-8" />
      </button>

      {/* Caption */}
      <div className="absolute bottom-6 left-0 right-0 text-center text-white">
        <p className="text-lg font-montserrat">{currentImage.caption}</p>
      </div>
    </div>
  );
};

export default GalleryModal;
