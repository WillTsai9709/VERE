import { Instagram } from "lucide-react";

// 使用静态示例照片
const examplePhotos = [
  {
    id: '1',
    url: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
    caption: 'Live performance at Summer Festival'
  },
  {
    id: '2',
    url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
    caption: 'In the studio recording new tracks'
  },
  {
    id: '3',
    url: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
    caption: 'Crowd at last night\'s show'
  },
  {
    id: '4',
    url: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
    caption: 'Backstage moments'
  },
  {
    id: '5',
    url: 'https://images.unsplash.com/photo-1515806215421-f251837fe7a9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1648&q=80',
    caption: 'New merch drop coming soon!'
  },
  {
    id: '6',
    url: 'https://images.unsplash.com/photo-1556379118-7034d926d258?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
    caption: 'Writing session for the new album'
  },
  {
    id: '7',
    url: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
    caption: 'Festival performance highlights'
  },
  {
    id: '8',
    url: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
    caption: 'Behind the scenes of our music video'
  }
];

const GallerySection = () => {
  // 直接跳转到Instagram页面的功能
  const openInstagram = () => {
    window.open("https://www.instagram.com/VERE", "_blank");
  };

  return (
    <section id="gallery" className="py-20 bg-gradient-to-b from-zinc-800 to-zinc-900">
      <div className="container mx-auto px-4">
        <h2 className="font-montserrat font-bold text-3xl md:text-4xl text-white mb-2">Gallery</h2>
        <p className="text-gray-400 mb-6 max-w-2xl">A visual journey through performances, studio sessions, and behind-the-scenes moments.</p>
        
        {/* Instagram Follow Banner */}
        <div className="mb-10 p-4 rounded-xl bg-gradient-to-r from-[#833AB4]/20 via-[#FD1D1D]/20 to-[#FCAF45]/20 border border-[#FD1D1D]/20">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <Instagram className="h-8 w-8 text-[#FD1D1D] mr-3" />
              <div>
                <h3 className="font-semibold text-white text-lg">Follow us on Instagram</h3>
                <p className="text-gray-300">For daily updates, behind-the-scenes content and more</p>
              </div>
            </div>
            <a 
              href="https://www.instagram.com/VERE" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] hover:from-[#833AB4]/90 hover:via-[#FD1D1D]/90 hover:to-[#FCAF45]/90 text-white font-medium rounded-full transition-colors duration-300"
            >
              @VERE
            </a>
          </div>
        </div>
        
        {/* Gallery Grid - 显示静态照片 */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {examplePhotos.map((photo) => (
            <div 
              key={photo.id} 
              className="gallery-item group relative cursor-pointer overflow-hidden rounded-lg"
              onClick={openInstagram}
            >
              <img 
                src={photo.url}
                alt={photo.caption} 
                className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-end p-4">
                <Instagram className="text-white h-6 w-6 mb-2" />
                <p className="text-white text-sm text-center">{photo.caption}</p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Instagram Link */}
        <div className="mt-12 text-center">
          <a 
            href="https://www.instagram.com/VERE" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] hover:from-[#833AB4]/90 hover:via-[#FD1D1D]/90 hover:to-[#FCAF45]/90 text-white font-medium rounded-full transition-colors duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
            </svg>
            See more on Instagram
          </a>
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
