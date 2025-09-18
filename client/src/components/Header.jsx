// src/components/Header.jsx
import React from 'react';

const Header = ({ currentView, onViewChange, student }) => {
  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onViewChange('browse')}>
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-r from-blue-700 to-blue-500 text-white">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path clipRule="evenodd" d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4zm10 3a1 1 0 10-2 0v2a1 1 0 102 0V5zM7 5a1 1 0 00-1 1v2a1 1 0 102 0V6a1 1 0 00-1-1zm5 5a1 1 0 10-2 0v2a1 1 0 102 0v-2zm-5 0a1 1 0 00-1 1v2a1 1 0 102 0v-2a1 1 0 00-1-1z" fillRule="evenodd"></path>
              </svg>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-blue-800">PM Internship Engine</h1>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <button 
              onClick={() => onViewChange('browse')}
              className={`text-sm font-medium ${
                currentView === 'browse' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Internships
            </button>
            <a href="#" className="text-sm font-medium text-gray-500 hover:text-gray-700">Resources</a>
            <a href="#" className="text-sm font-medium text-gray-500 hover:text-gray-700">Community</a>
          </nav>

          <div className="flex items-center space-x-4">
            {!student ? (
              <>
                <button
                  onClick={() => onViewChange('signup')}
                  className="bg-gradient-to-r from-blue-700 to-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  Sign Up
                </button>
                <button className="text-sm font-medium text-gray-700 hover:text-gray-900">
                  Login
                </button>
              </>
            ) : (
              <button
                onClick={() => onViewChange('dashboard')}
                className="text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                Dashboard
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
