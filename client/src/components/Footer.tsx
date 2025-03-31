import { Link } from "wouter";

const Footer = () => {
  return (
    <footer className="py-10 bg-zinc-800 border-t border-zinc-700">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            {/* Artist Logo/Name */}
            <Link href="/" className="font-montserrat font-bold text-xl text-white flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-purple-800 flex items-center justify-center">
                <span className="text-white text-sm">AV</span>
              </div>
              <span>AURA VOX</span>
            </Link>
          </div>
          
          <div className="mb-6 md:mb-0">
            <ul className="flex space-x-6">
              <li><a href="#about" className="text-gray-400 hover:text-white transition-colors duration-300">About</a></li>
              <li><a href="#music" className="text-gray-400 hover:text-white transition-colors duration-300">Music</a></li>
              <li><a href="#videos" className="text-gray-400 hover:text-white transition-colors duration-300">Videos</a></li>
              <li><a href="#gallery" className="text-gray-400 hover:text-white transition-colors duration-300">Gallery</a></li>
              <li><a href="#connect" className="text-gray-400 hover:text-white transition-colors duration-300">Connect</a></li>
            </ul>
          </div>
          
          <div>
            <p className="text-gray-400 text-sm">© {new Date().getFullYear()} AURA VOX. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
