import React from 'react';
import { Link } from 'react-router-dom';
import { FaGithub, FaLinkedin, FaTwitter, FaMedium, FaDiscord } from 'react-icons/fa';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">PDF Genius</h3>
            <p className="text-gray-300">
              Transform your PDF documents into actionable insights with our AI-powered text extraction and summarization platform.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://github.com/pdfgenius"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
                title="Follow us on GitHub"
              >
                <FaGithub size={24} />
              </a>
              <a
                href="https://linkedin.com/company/pdfgenius"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
                title="Connect on LinkedIn"
              >
                <FaLinkedin size={24} />
              </a>
              <a
                href="https://twitter.com/pdfgenius"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
                title="Follow us on Twitter"
              >
                <FaTwitter size={24} />
              </a>
              <a
                href="https://medium.com/pdfgenius"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
                title="Read our blog"
              >
                <FaMedium size={24} />
              </a>
              <a
                href="https://discord.gg/pdfgenius"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
                title="Join our community"
              >
                <FaDiscord size={24} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/features"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  to="/pricing"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  to="/documentation"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  to="/api"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  API Reference
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Contact Us</h3>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-center">
                <span className="font-semibold mr-2">Email:</span>
                <a href="mailto:support@pdfgenius.com" className="hover:text-white transition-colors">
                  support@pdfgenius.com
                </a>
              </li>
              <li className="flex items-center">
                <span className="font-semibold mr-2">Phone:</span>
                <a href="tel:+18005551234" className="hover:text-white transition-colors">
                  +1 (800) 555-1234
                </a>
              </li>
              <li className="flex items-center">
                <span className="font-semibold mr-2">Address:</span>
                <span>123 Innovation Drive, Suite 456</span>
              </li>
              <li className="flex items-center">
                <span className="font-semibold mr-2">City:</span>
                <span>San Francisco, CA 94107</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
          <p>
            &copy; {currentYear} PDF Genius. All rights reserved.
          </p>
          <div className="mt-2 text-sm space-x-4">
            <Link
              to="/privacy"
              className="hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="hover:text-white transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              to="/cookies"
              className="hover:text-white transition-colors"
            >
              Cookie Policy
            </Link>
            <Link
              to="/gdpr"
              className="hover:text-white transition-colors"
            >
              GDPR Compliance
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 