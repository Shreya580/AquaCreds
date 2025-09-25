import { Link } from 'react-router-dom';
import { Waves, Mail, Phone, Twitter, Linkedin, Instagram } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-ocean-deep text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Waves className="h-8 w-8 text-aqua-mint" />
              <span className="font-sora font-bold text-xl">AquaCreds</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Healing the ocean, cleaning the planet through verified blue carbon credits powered by transparent MRV technology.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Quick Links</h3>
            <div className="space-y-2">
              <Link to="/about" className="block text-gray-300 hover:text-aqua-mint transition-colors text-sm">
                About Us
              </Link>
              <Link to="/marketplace" className="block text-gray-300 hover:text-aqua-mint transition-colors text-sm">
                Marketplace
              </Link>
              <Link to="/help" className="block text-gray-300 hover:text-aqua-mint transition-colors text-sm">
                Help Center
              </Link>
              <Link to="/signin" className="block text-gray-300 hover:text-aqua-mint transition-colors text-sm">
                Get Started
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Contact Us</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-gray-300 text-sm">
                <Phone className="h-4 w-4" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300 text-sm">
                <Mail className="h-4 w-4" />
                <span>contact@aquacreds.in</span>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Follow Us</h3>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-300 hover:text-aqua-mint transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-aqua-mint transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-aqua-mint transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center">
          <p className="text-gray-400 text-sm">
            © 2024 AquaCreds. All rights reserved. Built for Smart India Hackathon.
          </p>
        </div>
      </div>
    </footer>
  );
}