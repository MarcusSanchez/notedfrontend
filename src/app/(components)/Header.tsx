import React from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, Stethoscope } from 'lucide-react';
import Link from 'next/link';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Noted</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-600 hover:text-primary transition-colors">
              Features
            </a>
            <a href="#pricing" className="text-gray-600 hover:text-primary transition-colors">
              Pricing
            </a>
            <a href="#contact" className="text-gray-600 hover:text-primary transition-colors">
              Contact
            </a>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/login">
              <Button variant="ghost">Log in</Button>
            </Link>
            <Button>Get Started</Button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              <a href="#features" className="text-gray-600 hover:text-primary transition-colors">
                Features
              </a>
              <a href="#pricing" className="text-gray-600 hover:text-primary transition-colors">
                Pricing
              </a>
              <a href="#contact" className="text-gray-600 hover:text-primary transition-colors">
                Contact
              </a>
              <div className="flex flex-col space-y-2 pt-4">
                <Button variant="ghost">Log in</Button>
                <Button>Get Started</Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;