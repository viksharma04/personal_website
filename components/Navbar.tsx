import Link from 'next/link';
import { Home, User, Suitcase, ScriptText } from "@nsmr/pixelart-react";
import "../app/globals.css";

export default function Navbar() {
  return (
    <nav className="w-1/3 mx-auto py-3  font-mono">
    <div className="flex items-center bg-black/85 backdrop-blur-md rounded-3xl shadow-lg border border-gray-800 px-6 py-2 hover:bg-black/95">
        {/* Home Icon */}
        <div className="flex-shrink-0">
          <Link href="/" className="flex items-center space-x-2 text-white hover:text-green-400 hover:bg-green-900/30 rounded-2xl px-4 py-2 transition-all duration-300 ease-in-out transform hover:scale-110 font-medium flex-1 justify-center shake-rotate">
            <Home
            className="w-6 h-6 text-current"
            style={{ imageRendering: 'pixelated' }}
            />
          </Link>
        </div>
        {/* Vertical Line */}
        <div className="mx-4 h-6 w-px bg-gray-600"></div>
        
        {/* Navigation Sections */}
        <div className="flex items-center flex-1 justify-between">
          {/* About Section */}
          <Link 
            href="/about" 
            className="flex items-center space-x-2 text-white hover:text-green-400 hover:bg-green-900/30 rounded-2xl mx-3 px-1 py-2 transition-all duration-300 ease-in-out transform hover:scale-110 font-medium flex-1 justify-center shake-rotate"
          >
            <User
                className='w-6 h-6 text-current'
                style={{ imageRendering: 'pixelated' }}
            />
            <span>About</span>
          </Link>
          
          {/* Work Section */}
          <Link 
            href="/work" 
            className="flex items-center space-x-2 text-white hover:text-green-400 hover:bg-green-900/30 rounded-2xl mx-3 px-3 py-2 transition-all duration-300 ease-in-out transform hover:scale-110 font-medium flex-1 justify-center shake-rotate"
          >
            <Suitcase
                className='w-6 h-6 text-current'
                style={{ imageRendering: 'pixelated' }}
            />
            <span>Work</span>
          </Link>
          
          {/* Blog Section */}
          <Link 
            href="/blog" 
            className="flex items-center space-x-2 text-white hover:text-green-400 hover:bg-green-900/30 rounded-2xl mx-3 px-3 py-2 transition-all duration-300 ease-in-out transform hover:scale-110 font-medium flex-1 justify-center shake-rotate"
          >
            <ScriptText
                className='w-6 h-6 text-current'
                style={{ imageRendering: 'pixelated' }}
            />
            <span>Blog</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
