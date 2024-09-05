import React from 'react';
import { useNavigate } from 'react-router-dom';
import doc from '../../Assets/Images/doc.png';

const AboutPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="relative w-full h-[80vh] bg-purple-900 flex items-center justify-center">
        <div className="absolute inset-0 bg-opacity-80 bg-gradient-to-b from-purple-900 to-purple-900"></div>
        <div className="relative z-10 text-center">
          <h1 className="text-5xl font-bold text-white mb-6">Welcome to HealthHub</h1>
          <p className="text-xl text-white max-w-2xl mx-auto mb-8">
            Bridging the gap between patients and healthcare providers, HealthHub offers a streamlined and secure platform for all your healthcare needs.
          </p>
          <button
            onClick={() => navigate(`/user/doctor`)}
            className="bg-white text-purple-900 py-2 px-8 rounded-full text-lg font-medium hover:bg-gray-200 transition-colors"
          >
            Find Your Doctor
          </button>
        </div>
      </div>

      <section className="py-4 px-6 bg-gray-100"> 
  <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center">
    <div className="md:w-1/2 mb-10 md:mb-0">
      <img src={doc} alt="HealthHub" className="w-full h-auto rounded-lg " />
    </div>
    <div className="md:w-1/2 md:pl-12 text-center md:text-left">
      <h2 className="text-3xl font-bold text-purple-900 mb-4">Your Health, Our Priority</h2>
      <p className="text-lg text-gray-600 mb-6">
        At HealthHub, we are dedicated to providing you with the best healthcare experience. Our platform connects you with top medical professionals, offering both in-person and virtual consultations. Your health is our top priority, and we ensure that your care is seamless, personalized, and accessible.
      </p>
    </div>
  </div>
</section>

    </>
  );
};

export default AboutPage;
