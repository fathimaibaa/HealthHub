import { Route, Routes } from "react-router-dom";
import ProtectedRoute, { AdminProtectedRoute, DoctorProtectedRoute } from "./ProtectedRoute";
import { DoctorPublicRoute, PublicRoute } from "./PublicRoute";


import  Register  from '../pppp/User/Register'
import VerifyOtp  from  "../pppp/User/VerifyOTP"
import Login from '../pppp/User/Login'
import Home from '../pppp/Home'
import ForgotPassword from '../pppp/User/ForgotPassword'
import ResetPassword from '../pppp/User/ResetPassword'
import DoctorDetailsUser from '../pppp/User/SingleDoctorDetails'
 import AppointmentOnlineBookingPage from "../Components/User/OnlineBookingPage"
import PaymentCompleted from "../pppp/User/PaymentCompleted";
import OnlineDoctors from "../Components/User/Online-consultation"
import ProfileUser from '../pppp/User/Profile'   
import UploadForm from "../pppp/User/LabRecord";  
import DocumentListPageUser from "../pppp/User/DocumentListPage";                          
import Chat from "../pppp/User/Chat";
import WalletPage from "../pppp/User/Wallet";
import Transaction from '../pppp/User/WalletTransaction'
import AboutPage from "../pppp/User/AboutPage";
import ContactPage from '../pppp/User/ContactPage'

import DoctorhomePage from '../pppp/Doctor/DoctorDashbord'
import DoctorSignup from '../pppp/Doctor/DoctorSignup' 
import EmailVerificationPage from '../pppp/Doctor/EmailVerification'          
import DoctorLogin from '../pppp/Doctor/DoctorLogin'
import ProfileDoctor from '../pppp/Doctor/Profile'
import DoctorList from '../pppp/User/DoctorPage'
import DoctorSlotPage from '../pppp/Doctor/SlotPage'
import PatientListPage from '../pppp/Doctor/PatientListPage'
import SinglePagePatient from "../pppp/Doctor/SinglePagePatient";
import DoctorChat from "../pppp/Doctor/Chat"
import DocumentListPage from "../pppp/Doctor/DocumentListPage";



import AdminLogin from '../pppp/Admin/AdminLogin'
import AdminDashboard from '../pppp/Admin/AdminDashboard'
import AdminUserList from '../pppp/Admin/UserList'
import AdminDoctorList from '../pppp/Admin/DoctorList'
import RequestedDoctors from '../pppp/Admin/ReqDoctorList'
import AdminDoctorDetails from '../pppp/Admin/DoctorDetails'
import AdminDepartmentList from '../pppp/Admin/DepartmentList'
import AddDepartmentList from '../pppp/Admin/AddDepartmentPage'
import AppoinmentDetails from "../pppp/User/AppoinmentDetails";

import EditDepartment from "../pppp/Admin/EditDepartment";
import AppoinmentListPage from "../pppp/User/GetAppoinmentsAll";
import AdminReport from "../pppp/Admin/Report"

import NotFoundPage from "../pppp/Error404";

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
