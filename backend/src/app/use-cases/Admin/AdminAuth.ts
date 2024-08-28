import configKeys from '../../../Config'
import {HttpStatus} from '../../../types/HttpStatus';
import CustomError from '../../../utils/CustomError';
import { AuthServiceInterfaceType } from '../../service-interface/AuthServiceInterface';

export const loginAdmin = async(
    email:string,
    password:string,
    authService:ReturnType<AuthServiceInterfaceType>
) => {
    if(email === configKeys.ADMIN_EMAIL && password === configKeys.ADMIN_PASSWORD){
        const { accessToken, refreshToken } = authService.createTokens(
            email,
            "Admin_User",
            "admin"
        )
        return {accessToken,refreshToken} ;
    }
    throw new CustomError('invalid Credentials',HttpStatus.UNAUTHORIZED)
}