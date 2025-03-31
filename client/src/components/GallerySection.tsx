import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Maximize } from "lucide-react";
import GalleryModal from "./ui/gallery-modal";

interface GalleryImage {
  id: string;
  url: string;
  caption: string;
  thumbnail: string;
}

const GallerySection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const { data: galleryImages } = useQuery<GalleryImage[]>({
    queryKey: ['/api/instagram/gallery'],
  });
  
  const openModal = (index: number) => {
    setCurrentImageIndex(index);
    setIsModalOpen(true);
  };

  return (
    <section id="gallery" className="py-20 bg-gradient-to-b from-zinc-800 to-zinc-900">
      <div className="container mx-auto px-4">
        <h2 className="font-montserrat font-bold text-3xl md:text-4xl text-white mb-2">Gallery</h2>
        <p className="text-gray-400 mb-12 max-w-2xl">A visual journey through performances, studio sessions, and behind-the-scenes moments.</p>
        
        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {galleryImages ? (
            galleryImages.map((image, index) => (
              <div 
                key={image.id} 
                className="gallery-item group relative cursor-pointer overflow-hidden rounded-lg"
                onClick={() => openModal(index)}
              >
                <img 
                  src={image.thumbnail}
                  alt={image.caption} 
                  className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-purple-800/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Maximize className="text-white h-6 w-6" />
                </div>
              </div>
            ))
          ) : (
            // Fallback for loading state
            Array(8).fill(0).map((_, index) => (
              <div key={index} className="gallery-item relative overflow-hidden rounded-lg bg-zinc-800 h-64"></div>
            ))
          )}
        </div>
        
        {/* Instagram Link */}
        <div className="mt-12 text-center">
          <a 
            href="https://instagram.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] hover:from-[#833AB4]/90 hover:via-[#FD1D1D]/90 hover:to-[#FCAF45]/90 text-white font-medium rounded-full transition-colors duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
            </svg>
            Follow on Instagram
          </a>
        </div>
      </div>
      
      {/* Lightbox Modal */}
      {galleryImages && galleryImages.length > 0 && (
        <GalleryModal
          images={galleryImages}
          isOpen={isModalOpen}
          currentIndex={currentImageIndex}
          onClose={() => setIsModalOpen(false)}
          onPrevious={() => setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length)}
          onNext={() => setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length)}
        />
      )}
    </section>
  );
};

export default GallerySection;
