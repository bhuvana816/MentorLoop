import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/images/logoo.jpg'; // ✅ Import your logo

const Footer: React.FC = () => {
  return (
    <footer className="bg-white text-gray-800 border-t border-gray-200">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Logo + Email */}
          <div className="flex flex-col items-start">
            <img
              src={logo}
              alt="MentorLoop Logo"
              className="w-24 mb-4 rounded"
            />
            <p className="text-sm">info@mentorloop.com</p>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="hover:underline">About Us</Link></li>
              <li><Link to="/blog" className="hover:underline">Blog</Link></li>
              <li><Link to="/instructors" className="hover:underline">Instructors</Link></li>
            </ul>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/courses" className="hover:underline">Courses</Link></li>
              <li><Link to="/services" className="hover:underline">Services</Link></li>
              <li><Link to="/projects" className="hover:underline">Projects</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/privacy-policy" className="hover:underline">Privacy Policy</Link></li>
              <li><Link to="/refund-policy" className="hover:underline">Refund and Returns Policy</Link></li>
              <li><Link to="/contact" className="hover:underline">Contact</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="border-t border-gray-200 mt-10 pt-6 text-center text-sm text-gray-500">
          © 2024 - {new Date().getFullYear()} MentorLoop. All information available on this website is protected by copyright.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
