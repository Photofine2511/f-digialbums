import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { Home, Plus, BookOpen, Menu, X } from 'lucide-react';

const Header = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Determine which link is active
  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path === '/albums' && location.pathname === '/albums') return true;
    if (path === '/create' && location.pathname === '/create') return true;
    return false;
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <BookOpen className="h-6 w-6 text-purple-600 dark:text-purple-400 mr-2" />
            <span className="font-bold text-xl text-gray-900 dark:text-white">AlbumSpark</span>
          </Link>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden flex items-center justify-center p-2 rounded-md focus:outline-none"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-gray-500 dark:text-gray-400" />
            ) : (
              <Menu className="h-6 w-6 text-gray-500 dark:text-gray-400" />
            )}
          </button>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link to="/">
              <Button 
                variant={isActive('/') ? "default" : "ghost"}
                size="sm"
                className="flex items-center gap-1"
              >
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Button>
            </Link>
            
            <Link to="/albums">
              <Button 
                variant={isActive('/albums') ? "default" : "ghost"}
                size="sm"
                className="flex items-center gap-1"
              >
                <BookOpen className="h-4 w-4" />
                <span>Albums</span>
              </Button>
            </Link>
            
            <Link to="/create">
              <Button 
                variant={isActive('/create') ? "default" : "ghost"}
                size="sm"
                className="flex items-center gap-1"
              >
                <Plus className="h-4 w-4" />
                <span>Create</span>
              </Button>
            </Link>
          </nav>
        </div>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 border-t border-gray-200 dark:border-gray-800">
              <Link 
                to="/" 
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive('/') 
                    ? 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="flex items-center gap-2">
                  <Home className="h-5 w-5" />
                  Home
                </div>
              </Link>
              
              <Link 
                to="/albums" 
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive('/albums') 
                    ? 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Albums
                </div>
              </Link>
              
              <Link 
                to="/create" 
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive('/create') 
                    ? 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Create Album
                </div>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header; 