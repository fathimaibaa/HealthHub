import createUserEntity, { googleSignInUserEntity, googleSignInUserEntityType, userEntityType } from "../../../../entities/UserEntity";
import { GoogleResponseType } from "../../../../types/GoogleResponseType";
import { HttpStatus } from "../../../../types/HttpStatus";
import { CreateUserInterface, UserInterface } from "../../../../types/UserInterface";
import CustomError from "../../../../utils/CustomError";
import sentMail from "../../../../utils/SendMail";
import {  forgotPasswordEmail,otpEmail } from "../../../../utils/UserEmail";
import { userDbInterface } from "../../../interfaces/UserDbRepository";
import { AuthServiceInterfaceType } from "../../../service-interface/AuthServiceInterface";





export const userRegister = async (
    user:CreateUserInterface,
    userRepository:ReturnType<userDbInterface>,
    authService:ReturnType<AuthServiceInterfaceType>
)=>{
    const {name,email,phoneNumber,password} = user;
 const authenticationMethod = "password";


    const isEmailExist = await userRepository.getUserbyEmail(email);
    if(isEmailExist)
    throw new CustomError("Email already exists",HttpStatus.BAD_REQUEST);

    const hashedPassword: string = await authService.encryptPassword(password);

    const userEntity: userEntityType = createUserEntity(
        name,
        email,
        phoneNumber,
        hashedPassword,
        authenticationMethod,
    );

    const createdUser: UserInterface = await userRepository.addUser(userEntity);

    const wallet = await userRepository.addWallet(createdUser.id);
    
    const OTP = authService.generateOTP();  
    const emailSubject = "Account verification";
    await userRepository.addOTP(OTP, createdUser.id);
    
    sentMail(createdUser.email,emailSubject,otpEmail(OTP, createdUser.name)); 

    return createdUser;

};

export const login = async(
  user:{email: string; password:string},
  userDbRepository:ReturnType<userDbInterface>,
  authService:ReturnType<AuthServiceInterfaceType>
)=>{
  const {email,password} = user;
  const isEmailExist = await userDbRepository.getUserbyEmail(email);

  if(!isEmailExist){
      throw new CustomError("Email does not existing", HttpStatus.UNAUTHORIZED);
  }

  if(isEmailExist?.authenticationMethod === "google"){
    throw new CustomError("Only login with google",HttpStatus.BAD_REQUEST);
  }

  if(isEmailExist?.isBlocked){
      throw new CustomError("Account is Blocked ",HttpStatus.FORBIDDEN);
  }

  if(!isEmailExist?.isVerified){
      throw new CustomError("your account is not verified",HttpStatus.UNAUTHORIZED);
  }

  if(!isEmailExist.password){
      throw new CustomError("Invalid Credentials",HttpStatus.UNAUTHORIZED);
  }
  
  const isPasswordMatched = await authService.comparePassword(password,isEmailExist?.password);

  if(!isPasswordMatched){
      throw new CustomError("Password is Wrong",HttpStatus.UNAUTHORIZED);
  }

  const { accessToken, refreshToken } = authService.createTokens(
      isEmailExist.id,
      isEmailExist.name,
      isEmailExist.role
  );

  return {accessToken,isEmailExist,refreshToken};
}






export const verifyOtpUser = async (
    userOTP: string,
    userId: string,
    userRepository:ReturnType<userDbInterface>
)=>{
    if(!userOTP)
    throw new CustomError("Please provide an OTP",HttpStatus.BAD_REQUEST);

    const otpUser = await userRepository.findOtpUser(userId);
    if (!otpUser)
    throw new CustomError(
      "Invalid otp , try resending the otp",
      HttpStatus.BAD_REQUEST
    );

  if (otpUser.OTP === userOTP) {
    await userRepository.updateProfile(userId, {
      isVerified: true,
    });
    return true;
  } else {
    throw new CustomError("Invalid OTP,try again", HttpStatus.BAD_REQUEST);
  }
};



export const deleteOtp = async (
  userId: string,
  userDbRepository: ReturnType<userDbInterface>,
  authService: ReturnType<AuthServiceInterfaceType>
) => {
  const newOtp: string = authService.generateOTP();
  const deleted = await userDbRepository.deleteOtpUser(userId); 
  if (deleted) {
    await userDbRepository.addOTP(newOtp, userId); 
  }
  const user = await userDbRepository.getUserbyId(userId);
  if (user) {
    const emailSubject = "Account verification , New OTP";
    sentMail(user.email, emailSubject, otpEmail(newOtp, user.name));
  }
 };



 export const sendResetVerificationCode = async (
  email: string,
  userDbRepository: ReturnType<userDbInterface>,
  authService: ReturnType<AuthServiceInterfaceType>
) => {
  const isEmailExist = await userDbRepository.getUserbyEmail(email);

  if (!isEmailExist)
    throw new CustomError(`${email} does not exist`, HttpStatus.BAD_REQUEST);

  if (isEmailExist.authenticationMethod === 'google')
    throw new CustomError(`${email} is sign in using google signin method,So it has no password to reset :-)`, HttpStatus.BAD_REQUEST);

  const verificationCode = authService.getRandomString();

  const isUpdated = await userDbRepository.updateVerificationCode(
    email,
    verificationCode
  );
  sentMail(
    email,
    "Reset password",
    forgotPasswordEmail(isEmailExist.name, verificationCode)
  );
};



export const verifyTokenAndRestPassword = async (
  verificationCode: string,
  password: string,
  userDbRepository: ReturnType<userDbInterface>,
  authService: ReturnType<AuthServiceInterfaceType>
) => {
  if (!verificationCode)
    throw new CustomError(
      "Please provide a verification code",
      HttpStatus.BAD_REQUEST
    );
  const hashedPassword = await authService.encryptPassword(password);
  const isPasswordUpdated = await userDbRepository.verifyAndResetPassword(
    verificationCode,
    hashedPassword
  );

  if (!isPasswordUpdated)
    throw new CustomError(
      "Invalid token or token expired",
      HttpStatus.BAD_REQUEST
    );
};


export const authenticateGoogleSignInUser = async (
  userData: GoogleResponseType,
  userDbRepository: ReturnType<userDbInterface>,
  authService: ReturnType<AuthServiceInterfaceType>
) => {
  const { name, email, picture, email_verified } = userData;
  const authenticationMethod = "google";

  const isEmailExist = await userDbRepository.getUserbyEmail(email);

  if(isEmailExist?.authenticationMethod === "password"){
    throw new CustomError("you have another from this Email",HttpStatus.BAD_REQUEST);
  }
  

  if (isEmailExist?.isBlocked)
    throw new CustomError(
      "Your account is blocked by administrator",
      HttpStatus.FORBIDDEN
    );

  if (isEmailExist) {
    const  { accessToken, refreshToken }  = authService.createTokens(
      isEmailExist.id,
      isEmailExist.name,
      isEmailExist.role
    );

    return { accessToken,isEmailExist ,refreshToken};
  } else {
    const googleSignInUser: googleSignInUserEntityType = googleSignInUserEntity(
      name,
      email,
      picture,
      email_verified,
      authenticationMethod,
      
    );

    const createdUser = await userDbRepository.registerGoogleSignedUser(
      googleSignInUser
    );
    const userId = createdUser._id as unknown as string;
    const wallet = await userDbRepository.addWallet(userId);


    const   { accessToken, refreshToken }   = authService.createTokens(
      userId,
      createdUser.name,
      createdUser.role
    );
    return { accessToken, createdUser,refreshToken };
  }
};
export const getUserById = async (
  id: string,
  userRepository: ReturnType<userDbInterface>
) => await userRepository.getUserbyId(id);