import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Menu, X } from 'lucide-react';
import logoImage from '@/assets/aquacreds_logo.png';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('aquacreds_user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleRoleClick = () => {
    if (user) {
      navigate('/profile');
    } else {
      navigate('/signin');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('aquacreds_user');
    setUser(null);
    navigate('/');
  };

  const getDashboardLink = () => {
    if (!user) return '/signin';
    
    switch (user.role) {
      case 'Project Owner':
        return '/dashboard/project-owner';
      case 'Credit Buyer':
        return '/dashboard/buyer';
      case 'Verifier':
        return '/dashboard/verifier';
      case 'Admin':
        return '/dashboard/admin';
      default:
        return '/profile';
    }
  };

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <img src={logoImage} alt="AquaCreds" className="h-8 w-8" />
            <span className="font-sora font-bold text-xl text-foreground">AquaCreds</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-1">
                  <span>Roles</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={handleRoleClick}>
                  {user ? 'View Profile' : 'Sign In'}
                </DropdownMenuItem>
                {user && (
                  <DropdownMenuItem onClick={() => navigate(getDashboardLink())}>
                    Dashboard
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <Link to="/marketplace" className="text-foreground hover:text-primary transition-colors">
              Marketplace
            </Link>
            <Link to="/about" className="text-foreground hover:text-primary transition-colors">
              About Us
            </Link>
            <Link to="/help" className="text-foreground hover:text-primary transition-colors">
              Help
            </Link>

            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-muted-foreground">Welcome, {user.name}</span>
                <Button variant="outline" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/signin">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link to="/login">
                  <Button className="btn-ocean">Login</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-4">
            <div className="space-y-2">
              <Button variant="ghost" onClick={handleRoleClick} className="w-full justify-start">
                {user ? 'View Profile' : 'Sign In'}
              </Button>
              {user && (
                <Button
                  variant="ghost"
                  onClick={() => navigate(getDashboardLink())}
                  className="w-full justify-start"
                >
                  Dashboard
                </Button>
              )}
              <Link to="/marketplace" className="block">
                <Button variant="ghost" className="w-full justify-start">
                  Marketplace
                </Button>
              </Link>
              <Link to="/about" className="block">
                <Button variant="ghost" className="w-full justify-start">
                  About Us
                </Button>
              </Link>
              <Link to="/help" className="block">
                <Button variant="ghost" className="w-full justify-start">
                  Help
                </Button>
              </Link>
            </div>

            {!user && (
              <div className="pt-4 border-t border-border space-y-2">
                <Link to="/signin" className="block">
                  <Button variant="ghost" className="w-full">Sign In</Button>
                </Link>
                <Link to="/login" className="block">
                  <Button className="btn-ocean w-full">Login</Button>
                </Link>
              </div>
            )}

            {user && (
              <div className="pt-4 border-t border-border">
                <Button variant="outline" onClick={handleLogout} className="w-full">
                  Logout
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}