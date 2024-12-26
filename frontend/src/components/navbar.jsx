import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';
import { Menu, X, User, LogOut, Layout as LayoutIcon, Flame, Home } from 'lucide-react';


const Layout = () => {
  const { logout, user } = useAuth();
  const location = useLocation(); 
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isHomePage = location.pathname==='/';


  const navigation = [
    {name: 'Home', path: '/', icon: Home},
    { name: 'Dashboard', path: '/dashboard', icon: Flame },
    { name: 'My List', path: '/list', icon: LayoutIcon },
    { name: 'Search', path: '/search', icon: LayoutIcon },
    { name: 'Profile', path: '/profile', icon: User }
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className={`min-h-screen overflow-hidden ${isHomePage ? 'bg-transparent' : 'bg-gradient-to-br from-gray-900 to-red-900'}`}>
      <nav className={`shadow-lg border-b border-red-800 ${isHomePage ? 'bg-transparent' : 'bg-gray-900'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo and Desktop Navigation */}
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-2xl font-bold bg-gradient-to-r from-red-500 to-red-300 text-transparent bg-clip-text">
                先生 リスト
                </span>
              </div>
              
              {/* Desktop Navigation */}
              <div className="hidden md:ml-8 md:flex md:space-x-8">
                {navigation.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`${
                      location.pathname === item.path
                        ? 'border-red-500 text-red-400'
                        : 'border-transparent text-gray-400 hover:text-red-300 hover:border-red-400'
                    } inline-flex items-center px-3 pt-1 border-b-2 text-sm font-medium transition-colors duration-200`}
                  >
                    <item.icon className="w-4 h-4 mr-2" />
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* User Profile and Logout - Desktop */}
            <div className="hidden md:flex md:items-center md:space-x-4">
              <div className="flex items-center space-x-3 bg-gray-800 rounded-lg px-4 py-2 border border-red-800">
                <div className="w-8 h-8 rounded-lg bg-red-900 flex items-center justify-center">
                  <User className="w-4 h-4 text-red-400" />
                </div>
                <span className="text-sm font-medium text-gray-200">{user?.username}</span>
              </div>
              <button
                onClick={logout}
                className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg text-white bg-red-800 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200 border border-red-600"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={toggleMobileMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-red-400 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-red-500 transition-colors duration-200"
              >
                {isMobileMenuOpen ? (
                  <X className="block h-6 w-6" />
                ) : (
                  <Menu className="block h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
          <div className="pt-2 pb-3 space-y-1 bg-gray-900">
            {navigation.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`${
                  location.pathname === item.path
                    ? 'bg-gray-800 border-red-500 text-red-400'
                    : 'border-transparent text-gray-400 hover:bg-gray-800 hover:border-red-400 hover:text-red-300'
                } block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors duration-200`}
              >
                <div className="flex items-center">
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </div>
              </Link>
            ))}
            
            {/* Mobile User Profile and Logout */}
            <div className="pt-4 pb-3 border-t border-red-800">
              <div className="flex items-center px-4 py-2">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-lg bg-red-900 flex items-center justify-center">
                    <User className="w-6 h-6 text-red-400" />
                  </div>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-200">{user?.username}</div>
                </div>
              </div>
              <button
                onClick={logout}
                className="mt-3 w-full flex items-center justify-center px-4 py-2 text-base font-medium rounded-lg text-white bg-red-800 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200 border border-red-600"
              >
                <LogOut className="w-5 h-5 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;