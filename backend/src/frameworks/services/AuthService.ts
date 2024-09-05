import bcrypt from "bcrypt";
import configKeys from "../../Config";
import jwt from "jsonwebtoken";
import crypto from 'crypto';

export const authService = () =>{
    const encryptPassword = async (password:string)=>{
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password,salt);
    };

    const comparePassword = async(inputPassword: string, password: string)=>{
        return await bcrypt.compare(inputPassword,password);
    }

    const getRandomString = () => crypto.randomUUID();

    const generateOTP = () =>{
        const otp = Math.floor(100000 + Math.random() * 900000)
        return `${otp}`;
    }

    const createTokens = (id: string, name: string, role:string)=>{
        const payload = {
            id,
            name,
            role,
        };

        const accessToken = jwt.sign(payload, configKeys.ACCESS_SECRET, {
            expiresIn: "20s",
          });
          const refreshToken = jwt.sign(payload, configKeys.REFRESH_SECRET, {
            expiresIn: "2d",
          });
        
          
        return {accessToken,refreshToken};
    }

//create doctor tokens
    const doctorCreateTokens = (id:string,name:string, role:string)=>{
        const payload = {
            id,
            name,
            role,
        };
        const accessToken = jwt.sign(payload, configKeys.ACCESS_SECRET, {
            expiresIn: "20s",
          });
          const refreshToken = jwt.sign(payload, configKeys.REFRESH_SECRET, {
            expiresIn: "2d",
          });
        
        return {accessToken,refreshToken};
    }

    return{encryptPassword,generateOTP,comparePassword,createTokens,getRandomString,doctorCreateTokens};
}

export type AuthService = typeof authService;
export type AuthserviceReturn = ReturnType<AuthService>;