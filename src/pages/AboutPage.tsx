import React, { useEffect, useRef } from "react";
import { motion, useInView, useAnimation } from "framer-motion";
import { BookOpen, Users, GraduationCap, Lightbulb } from "lucide-react";

const Counter = ({ value, label }: { value: number; label: string }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const controls = useAnimation();

  useEffect(() => {
    if (inView) {
      controls.start({ count: value });
    }
  }, [inView, value, controls]);

  return (
    <motion.div
      ref={ref}
      className="text-center"
      initial={{ count: 0 }}
      animate={controls}
      transition={{ duration: 2, ease: "easeOut" }}
    >
      <h3 className="text-4xl font-bold text-blue-700 mb-2">
        <motion.span>{Math.floor(value)}+</motion.span>
      </h3>
      <p className="text-gray-600">{label}</p>
    </motion.div>
  );
};

const AboutPage: React.FC = () => {
  const values = [
    {
      title: "Knowledge Sharing",
      description:
        "We believe in freely sharing knowledge and insights to help students succeed.",
      icon: <BookOpen className="w-10 h-10 text-blue-600" />,
    },
    {
      title: "Practical Learning",
      description:
        "Focused on bridging the gap between academic concepts and real-world application.",
      icon: <GraduationCap className="w-10 h-10 text-blue-600" />,
    },
    {
      title: "Community Support",
      description:
        "Creating a collaborative space where learners uplift each other.",
      icon: <Users className="w-10 h-10 text-blue-600" />,
    },
    {
      title: "Holistic Growth",
      description:
        "Encouraging both technical and personal growth for well-rounded development.",
      icon: <Lightbulb className="w-10 h-10 text-blue-600" />,
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section
        className="relative w-full h-screen bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage:
            "url('https://images.pexels.com/photos/3184287/pexels-photo-3184287.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260')",
        }}
      >
        <div className="absolute inset-0 bg-blue-900 bg-opacity-50"></div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            About MentorLoop
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto">
            A passionate community dedicated to empowering engineering students
            through knowledge sharing and professional development.
          </p>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-blue-900">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These values define who we are and how we operate at MentorLoop.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {values.map((value, index) => (
              <motion.div
                key={index}
                className="flex gap-4 items-start bg-blue-50 p-6 rounded-lg shadow"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="bg-white rounded-full p-4 shadow-md flex-shrink-0">
                  {value.icon}
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    {value.title}
                  </h3>
                  <p className="text-gray-700">{value.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-blue-900 mb-2">
              Our Impact
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We're proud of what we've achieved and the community we've built.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
            <Counter value={10} label="Years of Experience" />
            <Counter value={720} label="Students Enrolled" />
            <Counter value={20} label="Courses Offered" />
            <Counter value={100} label="Classes Completed" />
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutPage;
