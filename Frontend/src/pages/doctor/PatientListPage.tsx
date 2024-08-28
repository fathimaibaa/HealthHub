import React from 'react'
import Navbar from '../../components/doctor/Navbar/Navbar'
import PatientListPage from '../../components/doctor/PatientList'


const ListPage:React.FC = () => {
  return (
    <>
    <Navbar/> 
    <PatientListPage/>
    </>
    
  )
}

export default ListPage