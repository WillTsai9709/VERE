import { useState } from "react";
import { Link } from "wouter";
import { MenuIcon, XIcon } from "lucide-react";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-zinc-900/90 backdrop-blur-md border-b border-zinc-800">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Artist Logo/Name */}
        <Link href="/" className="font-montserrat font-bold text-2xl text-white flex items-center space-x-2">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
            <span className="text-white">AV</span>
          </div>
          <span>AURA VOX</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:block">
          <ul className="flex space-x-8 font-montserrat text-sm font-medium">
            <li><a href="#about" className="text-white hover:text-purple-400 transition-colors duration-300">ABOUT</a></li>
            <li><a href="#music" className="text-white hover:text-purple-400 transition-colors duration-300">MUSIC</a></li>
            <li><a href="#videos" className="text-white hover:text-purple-400 transition-colors duration-300">VIDEOS</a></li>
            <li><a href="#gallery" className="text-white hover:text-purple-400 transition-colors duration-300">GALLERY</a></li>
            <li><a href="#connect" className="text-white hover:text-purple-400 transition-colors duration-300">CONNECT</a></li>
          </ul>
        </nav>
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-white" 
          onClick={toggleMenu}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {mobileMenuOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
        </button>
      </div>
      
      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-zinc-800">
          <ul className="container mx-auto px-4 py-6 space-y-4 font-montserrat text-sm font-medium">
            <li><a href="#about" className="block text-white hover:text-purple-400 p-2 transition-colors duration-300" onClick={closeMenu}>ABOUT</a></li>
            <li><a href="#music" className="block text-white hover:text-purple-400 p-2 transition-colors duration-300" onClick={closeMenu}>MUSIC</a></li>
            <li><a href="#videos" className="block text-white hover:text-purple-400 p-2 transition-colors duration-300" onClick={closeMenu}>VIDEOS</a></li>
            <li><a href="#gallery" className="block text-white hover:text-purple-400 p-2 transition-colors duration-300" onClick={closeMenu}>GALLERY</a></li>
            <li><a href="#connect" className="block text-white hover:text-purple-400 p-2 transition-colors duration-300" onClick={closeMenu}>CONNECT</a></li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;
