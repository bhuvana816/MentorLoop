// ContactPage.tsx
import React, { useState } from 'react';
import contactImage from '../assets/images/contact.jpg';
import { Mail, Clock4, Send, PhoneCall } from 'lucide-react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../config/firebase';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, 'contactMessages'), {
        name: formData.name,
        email: formData.email,
        message: formData.message,
        createdAt: new Date(),
      });
      toast.success('Message sent successfully!');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      {/* Hero Image Section */}
      <section className="relative w-full h-[300px] md:h-[400px]">
        <div className="absolute inset-0 z-10 bg-black bg-opacity-60" />
        <img
          src={contactImage}
          alt="Contact Banner"
          className="w-full h-full object-cover absolute inset-0"
        />
        <div className="relative z-20 flex flex-col justify-center items-start h-full pl-8">
          <h1 className="text-white text-4xl md:text-5xl font-bold mb-2">Contact</h1>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="bg-white py-4 px-6 text-sm text-gray-600">
        <a href="/" className="hover:underline">Home</a> {'>'} <span className="text-blue-600">Contact</span>
      </div>

      {/* Contact Info */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="flex justify-center mb-4">
                <Mail className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Email</h3>
              <p className="text-sm text-gray-600">info@mentorloop.com</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="flex justify-center mb-4">
                <PhoneCall className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Phone</h3>
              <p className="text-sm text-gray-600">+91 86398 67800</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="flex justify-center mb-4">
                <Clock4 className="w-10 h-10 text-yellow-500" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Working Hours</h3>
              <p className="text-sm text-gray-600">Mon - Fri: 09:00 - 18:00</p>
            </div>
          </div>
        </div>
      </section>

      {/* Message Form */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4 max-w-2xl">
          <h2 className="text-2xl font-bold text-center mb-8">Send us a message</h2>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <input
              name="name"
              type="text"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              name="email"
              type="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <textarea
              name="message"
              rows={5}
              placeholder="Your Message"
              value={formData.message}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </section>
    </>
  );
};

export default ContactPage;