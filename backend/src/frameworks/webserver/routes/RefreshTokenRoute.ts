
import express from "express";
import tokenController from "../../../Adapters/TokenController";
import { doctorDbRepository } from "../../../App/Interfaces/DoctorDBRepository";
import { userDbRepository } from "../../../App/Interfaces/UserDbRepository";
import { authServiceInterface } from "../../../App/Service-interface/AuthServiceInterface";
import { doctorRepositoryMongodb } from "../../Database/Repositories/DoctorRepositoryMongodb";
import { userRepositoryMongodb } from "../../Database/Repositories/UserRepositoryMongodb";
import { authService } from "../../Services/AuthService";

const refreshTokenRoute = () => {
  const router = express.Router();
  const controller = tokenController(
    authServiceInterface,
    authService,
    userDbRepository,
    userRepositoryMongodb,
    doctorDbRepository,
    doctorRepositoryMongodb
  );

  router.get("/accessToken", controller.returnAccessToClient);
  router.post("/refresh_token", controller.getNewAccessToken);

  return router;
};
export default refreshTokenRoute;