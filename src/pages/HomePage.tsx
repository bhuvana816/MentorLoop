import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Users,
  GraduationCap,
  Award,
  Lightbulb,
  Play,
  Code
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const HomePage: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const domains = [
    { title: 'Web Development', icon: <BookOpen className="w-12 h-12 text-blue-600" /> },
    { title: 'Aptitude', icon: <GraduationCap className="w-12 h-12 text-teal-600" /> },
    { title: 'VLSI', icon: <Award className="w-12 h-12 text-orange-600" /> },
    { title: 'AI & ML', icon: <Lightbulb className="w-12 h-12 text-purple-600" /> },
    { title: 'IoT & Embedded', icon: <Play className="w-12 h-12 text-pink-600" /> },
    { title: 'Java Course', icon: <Code className="w-12 h-12 text-green-600" /> },
    { title: 'DBMS', icon: <Users className="w-12 h-12 text-yellow-600" /> }
  ];

  return (
    <main>
      {/* Hero Section */}
      <section
        className="relative w-full h-screen bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1559027615-5c41f375ccd2?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260')"
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 via-blue-800/60 to-blue-700/50"></div>
        <div className="relative z-10 flex flex-col justify-center items-start h-full px-6 md:px-20 max-w-4xl">
          <motion.h1
            className="text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            Build Your Future
          </motion.h1>
          <motion.p
            className="text-2xl md:text-3xl text-white/90 mb-8 max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Learn, practice, and grow with expert-led mentorship & resources.
          </motion.p>
          <motion.div
            className="flex gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <Link
              to="/about"
              className="bg-white text-blue-900 font-semibold px-6 py-3 rounded-md shadow hover:bg-gray-100 transition"
            >
              Learn More
            </Link>
            <button
              onClick={() => {
                if (currentUser) {
                  navigate('/mentorship');
                } else {
                  navigate('/login', { state: { from: '/mentorship' } });
                }
              }}
              className="border border-white text-white px-6 py-3 rounded-md hover:bg-white hover:text-blue-900 transition"
            >
              Talk to a Pro
            </button>
          </motion.div>
        </div>
      </section>

      {/* Domains Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-blue-900">
              Explore Our Domains
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Master in-demand skills through our curated courses & sessions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {domains.map((domain, index) => (
              <motion.div
                key={index}
                className="bg-white border border-gray-200 p-6 rounded-lg text-center shadow-sm hover:shadow-lg transition"
                whileHover={{ scale: 1.05 }}
              >
                <div className="flex justify-center mb-4">
                  {domain.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {domain.title}
                </h3>
                <button
                  onClick={() => {
                    if (currentUser) {
                      navigate('/sessions');
                    } else {
                      navigate('/login', { state: { from: '/sessions' } });
                    }
                  }}
                  className="text-blue-600 hover:underline text-sm"
                >
                  View Sessions →
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
