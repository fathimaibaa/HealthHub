import React from 'react'
import Navbar from '../../Components/Doctor/Navbar/Navbar'
import Banner from '../../Components/Doctor/Banner'
import Footer from '../../Components/Doctor/Footer/Footer'
import Body from '../../Components/Doctor/Body'

const doctorDashboard:React.FC = () => {
  return (
    <>
    <Navbar/> 
    <Banner/>
    <Body />
    
    <Footer/>
    </>
    
  )
}

export default doctorDashboard