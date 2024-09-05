import React from 'react'
import Navbar from '../../zzzz/Doctor/Navbar/Navbar'
import Banner from '../../zzzz/Doctor/Banner'
import Footer from '../../zzzz/Doctor/Footer/Footer'
import Body from '../../zzzz/Doctor/Body'

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