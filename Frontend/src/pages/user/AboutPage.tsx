import React from 'react';
import Footer from '../../components/user/Footer/Footer';
import Navbar from '../../components/user/Navbar/Navbar';
import AboutUsPage from '../../components/user/Aboutus';



const AboutPage: React.FC = () => {
  return (
    <>
      <Navbar />
      <AboutUsPage/>
      <Footer />
    </>
  );
};

export default AboutPage;