import { googleSignInUserEntityType, userEntityType } from "../../../Entities/UserEntity";
import { UserInterface } from "../../../Types/UserInterface";
import OTPModel from "../Models/Otp";
import User from "../Models/User";
import wallet from "../Models/Wallet";
import transations from "../Models/Transaction";

export const userRepositoryMongodb = () =>{
    const getUserbyEmail = async (email: string)=>{
        const user: UserInterface | null = await User.findOne({email});
        return user;
    }
    const getUserbyId = async (id: string) => {
        const res = await User.findById(id);
        return res
    }

    const addUser = async (user:userEntityType)=>{
        const newUser:any = new User({
            name:user.name(),
            email:user.getEmail(),
            password:user.getPassword(),
            phoneNumber:user.getphoneNumber(),
            authenticationMethod:user.getAuthenticationMethod(),
        });
        await newUser.save();
        return newUser;
    };
    const findOtpUser = async (userId:string)=>await OTPModel.findOne({userId: userId});
    const updateUserInfo = async (id: string, updateData:Record<string,any>)=>await User.findByIdAndUpdate(id,updateData,{new:true});
    const deleteOtpUser = async (userId: string) =>await OTPModel.deleteOne({ userId });

    const AddOTP = async (OTP: string, userId: string)=>{
        await OTPModel.create({OTP, userId});
    };
    const updateVerificationCode = async (email: string, code: string) => await User.findOneAndUpdate({ email }, { verificationCode: code });
    const findVerificationCodeAndUpdate = async (
        code: string,
        newPassword: string
      ) =>
        await User.findOneAndUpdate(
          { verificationCode: code },
          { password: newPassword, verificationCode: null },
          { upsert: true }
     );
     const getAllUsers = async () => await User.find({ isVerified: true });
     const updateUserBlock = async(id:string,status:boolean) => await User.findByIdAndUpdate(id,{isBlocked:status});
     const registerGoogleSignedUser = async (user: googleSignInUserEntityType) =>
        await User.create({
          name: user.name(),
          email: user.email(),
          profilePicture: user.picture(),
          isVerified: user.email_verified(),
          authenticationMethod:user.authenticationMethod(),
        });
        const addWallet = async (userId: string) => await wallet.create({ userId });

        const getWalletUser = async (userId:string) => {
            const response = await wallet.findOne({userId:userId}); 
             return response;
     
         }

         const getAllTransaction = async (userId:any) =>{
            const transactions = await transations.find({userId:userId});
            return transactions;
        }   


    
    return{
        getUserbyEmail,
        addUser,
        findOtpUser,
        updateUserInfo,
        deleteOtpUser,
        AddOTP,
        getUserbyId,
        updateVerificationCode,
        findVerificationCodeAndUpdate,
        getAllUsers,
        updateUserBlock,
        registerGoogleSignedUser,
        addWallet,
        getWalletUser,
        getAllTransaction

       
    }

}
   
export type userRepositoryMongodbType = typeof userRepositoryMongodb;
