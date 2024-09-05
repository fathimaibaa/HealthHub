import { Route, Routes } from "react-router-dom";
import ProtectedRoute, { AdminProtectedRoute, DoctorProtectedRoute } from "./ProtectedRoute";
import { DoctorPublicRoute, PublicRoute } from "./PublicRoute";


import  Register  from '../pages/user/Register'
import VerifyOtp  from  "../pages/user/VerifyOTP"
import Login from '../pages/user/Login'
import Home from '../pages/Home'
import ForgotPassword from '../pages/user/ForgotPassword'
import ResetPassword from '../pages/user/ResetPassword'
import DoctorDetailsUser from '../pages/user/SingleDoctorDetails'
 import AppointmentOnlineBookingPage from "../Components/User/OnlineBookingPage"
import PaymentCompleted from "../pages/user/PaymentCompleted";
import OnlineDoctors from "../Components/User/Online-consultation"
import ProfileUser from '../pages/user/Profile'   
import UploadForm from "../pages/user/LabRecord";  
import DocumentListPageUser from "../pages/user/DocumentListPage";                          
import Chat from "../pages/user/Chat";
import WalletPage from "../pages/user/Wallet";
import Transaction from '../pages/user/WalletTransaction'
import AboutPage from "../pages/user/AboutPage";
import ContactPage from '../pages/user/ContactPage'

import DoctorhomePage from '../pages/doctor/DoctorDashbord'
import DoctorSignup from '../pages/doctor/DoctorSignup' 
import EmailVerificationPage from '../pages/doctor/EmailVerification'          
import DoctorLogin from '../pages/doctor/DoctorLogin'
import ProfileDoctor from '../pages/doctor/Profile'
import DoctorList from '../pages/user/DoctorPage'
import DoctorSlotPage from '../pages/doctor/SlotPage'
import PatientListPage from '../pages/doctor/PatientListPage'
import SinglePagePatient from "../pages/doctor/SinglePagePatient";
import DoctorChat from "../pages/doctor/Chat"
import DocumentListPage from "../pages/doctor/DocumentListPage";



import AdminLogin from '../pages/admin/AdminLogin'
import AdminDashboard from '../pages/admin/AdminDashboard'
import AdminUserList from '../pages/admin/UserList'
import AdminDoctorList from '../pages/admin/DoctorList'
import RequestedDoctors from '../pages/admin/ReqDoctorList'
import AdminDoctorDetails from '../pages/admin/DoctorDetails'
import AdminDepartmentList from '../pages/admin/DepartmentList'
import AddDepartmentList from '../pages/admin/AddDepartmentPage'
import AppoinmentDetails from "../pages/user/AppoinmentDetails";

import EditDepartment from "../pages/admin/EditDepartment";
import AppoinmentListPage from "../pages/user/GetAppoinmentsAll";
import AdminReport from "../pages/admin/Report"

import NotFoundPage from "../pages/Error404";

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
