import { useState } from 'react';
import { Outlet, Link, useLocation, NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';
import {
  Menu,
  X,
  User,
  LogOut,
  Flame,
  Home,
  Search,
  List,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Layout = () => {
  const { logout, user } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isHomePage = location.pathname === '/';

  const navigation = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Dashboard', path: '/dashboard', icon: Flame },
    {
      name: 'My List ',
      icon: List,
      dropdownItems: [
        { name: 'Anime', path: '/list/anime' },
        { name: 'Movie', path: '/list/movie' }
      ]
    },
    {
      name: 'Search',
      icon: Search,
      dropdownItems: [
        { name: 'Anime', path: '/search/anime' },
        { name: 'Movie', path: '/search/movie' }
      ]
    },
    { name: 'Profile', path: '/profile', icon: User }
  ];

  const isPathActive = (path) => {
    return location.pathname.startsWith(path);
  };

  const isDropdownActive = (item) => {
    return item.dropdownItems?.some(dropdownItem =>
      location.pathname.startsWith(dropdownItem.path)
    );
  };

  const NavDropdown = ({ item, isMobile = false }) => (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger
        className={`${isDropdownActive(item)
            ? 'text-red-400'
            : 'text-gray-400 hover:text-red-300'
          } ${isMobile
            ? 'flex items-center w-full px-3 py-2 text-base'
            : 'inline-flex items-center px-3 pt-1 text-sm'
          } font-medium focus:outline-none`}
      >
        <item.icon className={`${isMobile ? 'w-5 h-5 mr-3' : 'w-4 h-4 mr-2'}`} />
        {item.name}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className={`${isMobile ? 'w-[calc(100vw-2rem)] mx-4' : 'w-40'} bg-gray-900 border border-red-800`}
        align={isMobile ? "start" : "center"}
        sideOffset={isMobile ? 0 : 4}
      >
        {item.dropdownItems.map((dropdownItem) => (
          <DropdownMenuItem
            key={dropdownItem.path}
            className="focus:bg-gray-800 focus:text-red-400 p-0"
          >
            <Link
              to={dropdownItem.path}
              onClick={() => isMobile && setIsMobileMenuOpen(false)}
              className={`${isPathActive(dropdownItem.path)
                  ? 'text-red-400'
                  : 'text-gray-300 hover:text-red-400'
                } w-full px-3 py-2 block`}
            >
              {dropdownItem.name}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const renderNavItem = (item, isMobile = false) => {
    if (item.dropdownItems) {
      return <NavDropdown key={item.name} item={item} isMobile={isMobile} />;
    }

    const baseStyles = isPathActive(item.path)
      ? 'text-red-400'
      : 'text-gray-400 hover:text-red-300';

    return (
      <Link
        key={item.path}
        to={item.path}
        onClick={() => isMobile && setIsMobileMenuOpen(false)}
        className={`
          ${baseStyles}
          ${isMobile
            ? 'flex items-center px-3 py-2 text-base'
            : 'inline-flex items-center px-3 pt-1 text-sm'
          } font-medium
        `}
      >
        <item.icon className={`${isMobile ? 'w-5 h-5 mr-3' : 'w-4 h-4 mr-2'}`} />
        {item.name}
      </Link>
    );
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 to-red-900 overflow-x-hidden">
      <nav className={`relative z-50 shadow-lg border-b border-red-800 ${isHomePage ? 'bg-transparent' : 'bg-gray-900'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo and Desktop Navigation */}
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <NavLink to='/'>
                  <span className="text-2xl font-bold bg-gradient-to-r from-red-500 to-red-300 text-transparent bg-clip-text">
                    sEnpAi リスト
                  </span>
                </NavLink>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:ml-8 md:flex md:items-center md:space-x-4">
                {navigation.map(item => renderNavItem(item))}
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
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
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
            {navigation.map(item => (
              <div key={item.name} className="px-2">
                {renderNavItem(item, true)}
              </div>
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
              <div className="px-2">
                <button
                  onClick={logout}
                  className="w-full flex items-center justify-center px-4 py-2 text-base font-medium rounded-lg text-white bg-red-800 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200 border border-red-600"
                >
                  <LogOut className="w-5 h-5 mr-2" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-0 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;