// ProfilePage.tsx (clean, copy-paste ready)
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { Edit2, Bell, Clock, ListTodo, FileText, BookOpen, Users, LogOut, Home } from 'lucide-react';
import { collection, query, where, getDocs, doc, updateDoc, getDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { db, auth } from '../config/firebase';
import { NavLink, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface ProfileData {
  name: string;
  email: string;
  whatsapp: string;
  education: {
    degree: string;
    specialization: string;
    college: string;
    collegeLocation: string;
    currentYear: string;
    graduationYear: string;
  };
}

const StatCard = ({ title, value, icon, color }: { title: string; value: number | string; icon: React.ReactNode; color: string; }) => (
  <div className={`flex items-center space-x-4 p-4 rounded-lg shadow-md ${color}`}>
    <div className="text-2xl">{icon}</div>
    <div>
      <p className="text-gray-500 text-sm font-medium">{title}</p>
      <p className="text-xl font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

const ProfilePage: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [testsAttempted, setTestsAttempted] = useState<number>(0);
  const [quizzesAttempted, setQuizzesAttempted] = useState<number>(0);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [timeSpent, setTimeSpent] = useState<number>(0);

  const handleLogout = async () => {
    toast.success('Logged out successfully!');
    setTimeout(async () => {
      await signOut(auth);
      navigate('/login');
    }, 1500);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUser) return;
      try {
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data() as ProfileData;
          userData.education = userData.education ?? {
            degree: '', specialization: '', college: '', collegeLocation: '', currentYear: '', graduationYear: ''
          };
          setProfileData(userData);
          const isIncomplete = Object.values(userData).some((v: any) => typeof v === 'string' && !v) || Object.values(userData.education).some((v: any) => !v);
          if (isIncomplete) setIsEditing(true);
        }
        const testQuery = query(collection(db, 'tests'), where('userId', '==', currentUser.uid));
        const testSnapshot = await getDocs(testQuery);
        setTestsAttempted(testSnapshot.size);

        const quizQuery = query(collection(db, 'quizzes'), where('userId', '==', currentUser.uid));
        const quizSnapshot = await getDocs(quizQuery);
        setQuizzesAttempted(quizSnapshot.size);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [currentUser]);

  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      const minutes = Math.floor((Date.now() - start) / 60000);
      setTimeSpent(minutes);
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('education.')) {
      const key = name.split('.')[1];
      setProfileData((prev: any) => ({ ...prev, education: { ...prev.education, [key]: value } }));
    } else {
      setProfileData((prev: any) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    if (!profileData || !currentUser) return;
    try {
      await updateDoc(doc(db, 'users', currentUser.uid), {
        name: profileData.name,
        email: profileData.email,
        whatsapp: profileData.whatsapp,
        'education.degree': profileData.education.degree,
        'education.specialization': profileData.education.specialization,
        'education.college': profileData.education.college,
        'education.collegeLocation': profileData.education.collegeLocation,
        'education.currentYear': profileData.education.currentYear,
        'education.graduationYear': profileData.education.graduationYear,
      });
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      toast.error('Failed to update profile.');
    }
  };

  if (loading || !profileData) {
    return <div className="p-10 text-center text-gray-600">Loading your dashboard...</div>;
  }

  return (
    <div className="flex">
      <ToastContainer position="top-right" autoClose={2000} />
      <div className="w-64 h-screen bg-white shadow-lg fixed">
        <nav className="mt-6 flex flex-col gap-1 px-4">
          <NavLink to="/dashboard" className="flex items-center gap-3 p-2 rounded-md text-sm font-medium text-gray-700 hover:bg-indigo-100 transition"><Home size={18} /> Dashboard</NavLink>
          <NavLink to="/report" className="flex items-center gap-3 p-2 rounded-md text-sm font-medium text-gray-700 hover:bg-indigo-100 transition"><FileText size={18} /> Overall Report</NavLink>
          <NavLink to="/courses" className="flex items-center gap-3 p-2 rounded-md text-sm font-medium text-gray-700 hover:bg-indigo-100 transition"><BookOpen size={18} /> Courses</NavLink>
          <NavLink to="/community" className="flex items-center gap-3 p-2 rounded-md text-sm font-medium text-gray-700 hover:bg-indigo-100 transition"><Users size={18} /> Communities</NavLink>
          <button onClick={handleLogout} className="flex items-center gap-3 p-2 rounded-md text-sm font-medium text-red-600 hover:text-red-800 transition mt-4"><LogOut size={18} /> Log Out</button>
        </nav>
      </div>

      <main className="ml-64 w-full bg-gray-50 min-h-screen p-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="p-6 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-lg shadow mb-6">
          <h1 className="text-3xl font-extrabold text-indigo-800">Welcome Back, <span className="text-purple-700">{profileData.name}</span> ✨</h1>
          <p className="text-gray-700 mt-2">Ready to continue your learning journey? You're making great progress!</p>
          <button onClick={() => setIsEditing(!isEditing)} className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded shadow hover:bg-purple-700 transition"><Edit2 size={16} /> {isEditing ? 'Cancel' : 'Edit Profile'}</button>
        </motion.div>

        {isEditing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 bg-white p-6 rounded-lg shadow">
            {['name', 'email', 'whatsapp'].map(field => (
              <div key={field}>
                <label className="text-sm text-gray-600 capitalize font-medium">{field}</label>
                <input className="mt-1 w-full px-3 py-2 border rounded-lg border-gray-300 focus:outline-none focus:ring focus:ring-purple-300" name={field} value={(profileData as any)[field]} onChange={handleInputChange} />
              </div>
            ))}
            {Object.entries(profileData.education ?? {}).map(([key, val]) => (
              <div key={key}>
                <label className="text-sm text-gray-600 capitalize font-medium">{key.replace(/([A-Z])/g, ' $1')}</label>
                <input className="mt-1 w-full px-3 py-2 border rounded-lg border-gray-300 focus:outline-none focus:ring focus:ring-purple-300" name={`education.${key}`} value={val} onChange={handleInputChange} />
              </div>
            ))}
            <div className="md:col-span-2 mt-4 text-right">
              <button onClick={handleSave} className="px-6 py-2 bg-green-600 text-white font-medium rounded hover:bg-green-700 transition">Save Changes</button>
            </div>
          </motion.div>
        )}

        <div className="mt-10 px-6 pb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Your Activity Summary</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard title="Tests Attempted" value={testsAttempted} icon={<FileText className="text-indigo-500" />} color="bg-indigo-50" />
            <StatCard title="Quizzes Attempted" value={quizzesAttempted} icon={<ListTodo className="text-purple-500" />} color="bg-purple-50" />
            <StatCard title="Total Time Spent" value={`${timeSpent} mins`} icon={<Clock className="text-yellow-500" />} color="bg-yellow-50" />
          </div>
        </div>

        <div className="px-6 mt-8">
          <div className="border rounded-lg p-6 bg-white shadow-md">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">Announcements</h2>
              <Bell className="text-purple-600" />
            </div>
            <div className="text-center mt-6">
              <div className="flex justify-center text-gray-400 text-4xl">💬</div>
              <p className="mt-2 text-gray-600 font-medium">No Announcements</p>
              <p className="text-sm text-gray-500">Check back later for important updates and news!</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;