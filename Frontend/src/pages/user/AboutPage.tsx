import React from 'react';
import Footer from '../../zzzz/User/Footer/Footer';
import Navbar from '../../zzzz/User/Navbar/Navbar';
import AboutUsPage from '../../zzzz/User/Aboutus';



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