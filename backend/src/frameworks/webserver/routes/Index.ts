import { Application } from "express";
import userRoutes from "./UserRoute";
import doctorRoutes from "./DoctorRoute"
import adminRoutes from './AdminRoute'
import refreshTokenRoute from './RefreshTokenRoute'
import chatRoute from "./ChatRoutes";


const routes = (app: Application) => {
    app.use("/api/user", userRoutes());
    app.use("/api/doctor",doctorRoutes());
    app.use('/api/admin',adminRoutes());
    app.use("/api/token", refreshTokenRoute());
    app.use("/api/chat", chatRoute());   
    
    
   

};

export default routes;