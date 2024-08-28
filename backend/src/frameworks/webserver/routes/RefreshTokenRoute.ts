
import express from "express";
import tokenController from "../../../adapters/TokenController";
import { doctorDbRepository } from "../../../app/interfaces/DoctorDBRepository";
import { userDbRepository } from "../../../app/interfaces/UserDbRepository";
import { authServiceInterface } from "../../../app/service-interface/AuthServiceInterface";
import { doctorRepositoryMongodb } from "../../database/repositories/DoctorRepositoryMongodb";
import { userRepositoryMongodb } from "../../database/repositories/UserRepositoryMongodb";
import { authService } from "../../services/AuthService";

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