import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { doctorDbInterface } from "../App/Interfaces/DoctorDBRepository";
import { userDbInterface } from "../App/Interfaces/UserDbRepository";
import { AuthServiceInterfaceType } from "../App/Service-interface/AuthServiceInterface";
import { getDoctorById } from "../App/Use-cases/Doctor/AuthDoctor";
import { getUserById } from "../App/Use-cases/User/Auth/UserAuth";
import configKeys from "../Config";
import { doctorRepositoryMongodbType } from "../Frameworks/Database/Repositories/DoctorRepositoryMongodb";
import { userRepositoryMongodbType } from "../Frameworks/Database/Repositories/UserRepositoryMongodb";
import { AuthService } from "../Frameworks/Services/AuthService";
import { HttpStatus } from "../Types/HttpStatus";

const tokenContoller = (
  authServiceInterface: AuthServiceInterfaceType,
  authServiceImpl: AuthService,
  userDbRepository: userDbInterface,
  userDbRepositoryImpl: userRepositoryMongodbType,
  doctorDbRepository: doctorDbInterface,
  doctorDbRepositoryImpl: doctorRepositoryMongodbType
) => {
  const authService = authServiceInterface(authServiceImpl());
  const dbRepositoryUser = userDbRepository(userDbRepositoryImpl());
  const dbRepositoryDoctor = doctorDbRepository(
    doctorDbRepositoryImpl()
  );


  
  const getNewAccessToken = (req: Request, res: Response) => {
    const { refresh_token } = req.body;

    if (!refresh_token) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ success: false, error: "Invalid refresh token" });
    }
    jwt.verify(
      refresh_token,
      configKeys.REFRESH_SECRET,
      (err: any, user: any) => {
        if (err) {
          return res
            .status(HttpStatus.UNAUTHORIZED)
            .json({ message: "Refresh token is expired" });
        } else {
          const { id, name, role } = user;
          const  { accessToken }  = authService.createTokens(id, name, role);
          res.status(HttpStatus.OK).json({
            success: true,
            message: "Token refreshed successfully",
            access_token: accessToken,
          });
        }
      }
    );
  };




  

  const returnAccessToClient = async (req: Request, res: Response) => {
    try {

    const { access_token } = req.query as { access_token: string };
    if (!access_token)
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ success: false, message: "Access token is required" });

    const token: JwtPayload = jwt.decode(access_token) as JwtPayload;

      if (token?.role  === "user") {
        const user = await getUserById(token.id, dbRepositoryUser);
        return res
          .status(HttpStatus.OK)
          .json({ success: true, access_token, user });
      }
       else if (token?.role === "doctor") {
        const doc = await getDoctorById(
          token.id,
          dbRepositoryDoctor
        );
        return res
          .status(HttpStatus.OK)
          .json({ success: true, access_token, user: doc });
      }

      return res.status(HttpStatus.OK).json({ success: true, access_token });

    } 
    catch (error) {
    console.error("Error in token controller:", error);
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: "Internal server error" });
    }
  };



  return { returnAccessToClient ,  getNewAccessToken};
};

export default tokenContoller;
