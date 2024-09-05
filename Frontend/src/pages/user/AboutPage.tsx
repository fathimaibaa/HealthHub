import React from 'react';
import Footer from '../../Components/User/Footer/Footer';
import Navbar from '../../Components/User/Navbar/Navbar';
import AboutUsPage from '../../Components/User/Aboutus';



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