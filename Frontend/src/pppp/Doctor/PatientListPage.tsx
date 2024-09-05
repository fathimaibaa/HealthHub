import React from 'react'
import Navbar from '../../Components/Doctor/Navbar/Navbar'
import PatientListPage from '../../Components/Doctor/PatientList'


const ListPage:React.FC = () => {
  return (
    <>
    <Navbar/> 
    <PatientListPage/>
    </>
    
  )
}

export default ListPage