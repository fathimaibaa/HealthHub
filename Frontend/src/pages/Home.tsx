import React from 'react'
import Banner from '../Components/User/Banner'
import Footer from '../Components/User/Footer/Footer'
import Navbar from '../Components/User/Navbar/Navbar'
import Body from '../Components/User/Body'
 
const Home:React.FC = () => {
  return ( 
    <>

    <Navbar/> 
    <Banner/>
    
    <Body/>
    
    <Footer/>
    
    </>
    
  )
}

export default Home