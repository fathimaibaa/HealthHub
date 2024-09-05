import React from 'react'
import Navbar from '../../Components/Doctor/Navbar/Navbar'
import PatientDetailPage from '../../Components/Doctor/SinglePatientDetailsPage'


const SinglePagePatient :React.FC = () => {
  return (
    <>
    <Navbar/> 
    <PatientDetailPage/>
    </>
    
  )
}

export default SinglePagePatient;