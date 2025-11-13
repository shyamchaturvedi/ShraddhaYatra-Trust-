import React, { useState } from 'react';
import { Role } from '../types';

interface HeaderProps {
  isAuthenticated: boolean;
  userName: string;
  currentRole: Role;
  logoUrl: string;
  setView: (view: string) => void;
  setSelectedTripId: (id: number | null) => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ isAuthenticated, userName, setView, setSelectedTripId, onLogout, currentRole, logoUrl }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavigation = (view: string) => {
    setSelectedTripId(null);
    setView(view);
    setIsMobileMenuOpen(false); // Close menu on navigation
  };
  
  const handleLogout = () => {
      onLogout();
      setIsMobileMenuOpen(false);
  }

  const navLinks = (
    <>
      <button onClick={() => handleNavigation('home')} className="block w-full text-left py-2 px-3 rounded-md hover:bg-amber-200 transition-colors">Home</button>
      <button onClick={() => handleNavigation('about')} className="block w-full text-left py-2 px-3 rounded-md hover:bg-amber-200 transition-colors">About Us</button>
      <button onClick={() => handleNavigation('ourTeam')} className="block w-full text-left py-2 px-3 rounded-md hover:bg-amber-200 transition-colors">Our Team</button>
      <button onClick={() => handleNavigation('gallery')} className="block w-full text-left py-2 px-3 rounded-md hover:bg-amber-200 transition-colors">Gallery</button>
      <button onClick={() => handleNavigation('contact')} className="block w-full text-left py-2 px-3 rounded-md hover:bg-amber-200 transition-colors">Contact</button>
      {isAuthenticated && (
        <>
          <hr className="my-2 border-amber-200"/>
          <button onClick={() => handleNavigation('bookings')} className="block w-full text-left py-2 px-3 rounded-md hover:bg-amber-200 transition-colors">My Bookings</button>
          <button onClick={() => handleNavigation('profile')} className="block w-full text-left py-2 px-3 rounded-md hover:bg-amber-200 transition-colors">Profile</button>
          {currentRole === Role.ADMIN && (
            <button onClick={() => handleNavigation('admin')} className="block w-full text-left py-2 px-3 rounded-md hover:bg-amber-200 transition-colors">Admin Dashboard</button>
          )}
        </>
      )}
    </>
  );

  return (
    <>
      <header className="bg-gradient-to-r from-amber-600 to-orange-500 text-white shadow-lg p-2 sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center cursor-pointer" onClick={() => handleNavigation('home')}>
             <img src={logoUrl || '/logo.png'} alt="Shraddha Yatra Trust Logo" className="h-28 w-auto" />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4 text-sm font-medium">
            {navLinks}
          </nav>
          <div className="hidden md:flex items-center space-x-2">
            <button onClick={() => handleNavigation('donation')} className="bg-amber-100 text-orange-600 px-3 py-1.5 rounded-md text-xs font-semibold hover:bg-amber-200 transition-colors">Donate</button>
            {isAuthenticated ? (
              <button onClick={handleLogout} className="bg-red-600 px-3 py-1.5 rounded-md text-xs font-semibold hover:bg-red-700 transition-colors">Logout</button>
            ) : (
              <>
                <button onClick={() => handleNavigation('login')} className="bg-white text-orange-600 px-3 py-1.5 rounded-md text-xs font-semibold hover:bg-amber-100 transition-colors">Login</button>
                <button onClick={() => handleNavigation('register')} className="bg-transparent border border-white text-white px-3 py-1.5 rounded-md text-xs font-semibold hover:bg-white hover:text-orange-600 transition-colors">Register</button>
              </>
            )}
          </div>
          
          {/* Mobile Hamburger Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 rounded-md text-amber-200 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Menu */}
      <div className={`fixed inset-0 z-[60] transform ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out md:hidden`}>
        <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsMobileMenuOpen(false)}></div>
        <div className="relative w-4/5 max-w-sm h-full bg-gradient-to-b from-amber-50 to-amber-100 ml-auto p-6 shadow-2xl">
          <div className="flex justify-between items-center mb-6">
             <h2 className="text-xl font-bold text-amber-900">Menu</h2>
             <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 rounded-md text-gray-600 hover:bg-gray-200">
               <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
             </button>
          </div>
          <nav className="flex flex-col space-y-2 text-lg font-medium text-amber-900">
            {navLinks}
          </nav>
          <div className="mt-6 pt-4 border-t border-amber-200 space-y-3">
             <button onClick={() => handleNavigation('donation')} className="w-full text-center bg-orange-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-orange-600 transition-colors">Donate</button>
             {isAuthenticated ? (
                <button onClick={handleLogout} className="w-full text-center bg-red-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-red-700 transition-colors">Logout</button>
             ) : (
                <>
                 <button onClick={() => handleNavigation('login')} className="w-full text-center bg-white text-orange-600 px-4 py-2 rounded-md font-semibold hover:bg-amber-100 transition-colors border border-orange-500">Login</button>
                 <button onClick={() => handleNavigation('register')} className="w-full text-center text-orange-600 px-4 py-2 rounded-md font-semibold hover:bg-amber-100 transition-colors">Register</button>
                </>
             )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;