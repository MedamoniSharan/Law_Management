import React from 'react';

const About: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">About Us</h1>
      <p className="text-lg text-gray-700 mb-6">
        Welcome to <span className="font-semibold text-purple-600">VidyutLaw</span> — your trusted partner in legal services.
        We are a modern, technology-driven platform dedicated to connecting clients with verified, experienced, and reliable lawyers across a wide range of specialties.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">🌐 Our Vision</h2>
          <p className="text-gray-600">
            At VidyutLaw, we envision a world where legal help is accessible, affordable, and trustworthy. Our mission is to empower clients by simplifying how they find, communicate with, and hire lawyers — all within a secure and intuitive digital environment.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">💼 For Lawyers</h2>
          <p className="text-gray-600">
            We provide a powerful platform for lawyers to grow their practice. With verified profiles, consultation tools, appointment booking, and secure messaging, our system helps legal professionals manage their engagements with clients effortlessly.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">🔐 Verified Legal Experts</h2>
          <p className="text-gray-600">
            Every lawyer on our platform undergoes a strict verification process including bar council checks, experience validation, and profile review. We ensure that clients are matched only with trustworthy legal advisors.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">📈 Technology-Backed Solutions</h2>
          <p className="text-gray-600">
            From online consultations to automated appointment tracking and feedback systems — our tools are designed to provide seamless experiences on both sides of the legal relationship.
          </p>
        </div>
      </div>

      <div className="mt-12 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Join Us Today</h2>
        <p className="text-lg text-gray-700 mb-6">
          Whether you're a lawyer looking to expand your practice or a client seeking legal help, <span className="text-purple-600 font-semibold">VidyutLaw</span> is your destination.
        </p>
        <a
          href="/register"
          className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition"
        >
          Get Started
        </a>
      </div>
    </div>
  );
};

export default About;
