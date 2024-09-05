import { Route, Routes } from "react-router-dom";
import ProtectedRoute, { AdminProtectedRoute, DoctorProtectedRoute } from "./ProtectedRoute";
import { DoctorPublicRoute, PublicRoute } from "./PublicRoute";


import  Register  from '../Pages/User/Register'
import VerifyOtp  from  "../Pages/User/VerifyOTP"
import Login from '../Pages/User/Login'
import Home from '../Pages/Home'
import ForgotPassword from '../Pages/User/ForgotPassword'
import ResetPassword from '../Pages/User/ResetPassword'
import DoctorDetailsUser from '../Pages/User/SingleDoctorDetails'
 import AppointmentOnlineBookingPage from "../zzzz/User/OnlineBookingPage"
import PaymentCompleted from "../Pages/User/PaymentCompleted";
import OnlineDoctors from "../zzzz/User/Online-consultation"
import ProfileUser from '../Pages/User/Profile'   
import UploadForm from "../Pages/User/LabRecord";  
import DocumentListPageUser from "../Pages/User/DocumentListPage";                          
import Chat from "../Pages/User/Chat";
import WalletPage from "../Pages/User/Wallet";
import Transaction from '../Pages/User/WalletTransaction'
import AboutPage from "../Pages/User/AboutPage";
import ContactPage from '../Pages/User/ContactPage'

import DoctorhomePage from '../Pages/Doctor/DoctorDashbord'
import DoctorSignup from '../Pages/Doctor/DoctorSignup' 
import EmailVerificationPage from '../Pages/Doctor/EmailVerification'          
import DoctorLogin from '../Pages/Doctor/DoctorLogin'
import ProfileDoctor from '../Pages/Doctor/Profile'
import DoctorList from '../Pages/User/DoctorPage'
import DoctorSlotPage from '../Pages/Doctor/SlotPage'
import PatientListPage from '../Pages/Doctor/PatientListPage'
import SinglePagePatient from "../Pages/Doctor/SinglePagePatient";
import DoctorChat from "../Pages/Doctor/Chat"
import DocumentListPage from "../Pages/Doctor/DocumentListPage";



import AdminLogin from '../Pages/Admin/AdminLogin'
import AdminDashboard from '../Pages/Admin/AdminDashboard'
import AdminUserList from '../Pages/Admin/UserList'
import AdminDoctorList from '../Pages/Admin/DoctorList'
import RequestedDoctors from '../Pages/Admin/ReqDoctorList'
import AdminDoctorDetails from '../Pages/Admin/DoctorDetails'
import AdminDepartmentList from '../Pages/Admin/DepartmentList'
import AddDepartmentList from '../Pages/Admin/AddDepartmentPage'
import AppoinmentDetails from "../Pages/User/AppoinmentDetails";

import EditDepartment from "../Pages/Admin/EditDepartment";
import AppoinmentListPage from "../Pages/User/GetAppoinmentsAll";
import AdminReport from "../Pages/Admin/Report"

import NotFoundPage from "../Pages/Error404";

export const MainRouter = () => {
    return (
        <Routes>
             {/* public routes for user */}
            <Route path="/" element={<Home />} />
            <Route path="/user/aboutus" element={<AboutPage />} />
            <Route path="/user/contact" element={<ContactPage />} />
   
            <Route path="" element={<PublicRoute />}>

            <Route path="/user/register" element={<Register />} />
                <Route path ="/user/verify_otp" element={<VerifyOtp/>}/>
                 <Route path="/user/login" element={<Login/>}/>
                <Route path ='/user/forgot_password' element ={<ForgotPassword/>}/>
                <Route path ='/user/reset_password/:id' element ={<ResetPassword/>}/> 
            </Route>
               
      {/* private routes for user */}
      <Route path="/" element={<ProtectedRoute />}>
      <Route path="/" element={<Home />} />
      <Route path="/user/doctor" element={<DoctorList />} />
      <Route path="/user/profile" element={<ProfileUser />} />
      <Route path="/user/doctor/:id" element={<DoctorDetailsUser />} />
      <Route path="/user/appoinmentOnline/:id" element={<AppointmentOnlineBookingPage />} />
      <Route path="/appoinmentDetails/:id" element={<AppoinmentDetails/>} />
      <Route path ="/user/appoinmentlist" element={<AppoinmentListPage/>}/>
      <Route path="/payment_status/:id" element={<PaymentCompleted />} />
      <Route path="/user/online-consultation" element={<OnlineDoctors/>}/>
      <Route path ="/user/labrecord" element={<UploadForm/>}/>
      <Route path ="/user/documents/:id" element={<DocumentListPageUser/>}/>
      <Route path="/user/chat" element={<Chat />} />
      <Route path="/user/wallet" element={<WalletPage/>}/>
      <Route path="/user/walletHistory" element={<Transaction/>}/>
       
       
      </Route>


            
            {/******************* Doctor routes *****************/}
            <Route path="/doctor" element={<DoctorhomePage/>}/>
             {/*Doctor Routes - public*/ }
             <Route path="" element={<DoctorPublicRoute />}>
             <Route path="/doctor" element={<DoctorhomePage/>}/>
             <Route path="/doctor/register" element={<DoctorSignup/>}/>
             <Route path="/doctor/verify-token/:token" element ={<EmailVerificationPage/>}/>
             <Route path="/doctor/login" element={<DoctorLogin/>}/>
             </Route>

            {/*Doctor Routes - private*/ }
            <Route path="" element={<DoctorProtectedRoute />}>

            <Route path="/doctor" element={<DoctorhomePage/>}/>
            <Route path="/doctor/Profile" element ={<ProfileDoctor/>}/>
            <Route path="/doctor/slot" element ={<DoctorSlotPage/>}/>
            <Route path="/doctor/patientList" element={<PatientListPage/>}/>
            <Route path="/patient-details/:id" element={<SinglePagePatient/>} />
            <Route path ="/doctor/documents/:id" element={<DocumentListPage/>}/>
            <Route path="/doctor/chat" element={<DoctorChat/>}/>

            </Route>

           {/******************* Admin routes *****************/}
            <Route path="" element={<PublicRoute />}>
            <Route path="/admin/login" element={<AdminLogin />} />

                                        
            </Route>

 {/* admin protected Route  */}
 <Route path="" element={<AdminProtectedRoute />}>
 <Route path="/admin" element={<AdminDashboard/>}/>
 <Route path="/admin/users" element={<AdminUserList/>}/>
 <Route path="/admin/doctors" element={<AdminDoctorList/>}/>
 <Route path="/admin/requesteddoctors" element={<RequestedDoctors/>}/>
            <Route path="/admin/doctors/:id" element={<AdminDoctorDetails/>}/>
            <Route path="/admin/department" element ={<AdminDepartmentList/>}/>
            <Route path="/admin/addDepartment" element ={<AddDepartmentList/>}/>
            <Route path="/admin/department/:id" element={<EditDepartment/>} />
            <Route path="/admin/reports" element={<AdminReport/>}/>
           
 </Route>


 <Route path="*" element={<NotFoundPage />} />
            


        </Routes>
    );
};
