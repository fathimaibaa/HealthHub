import configKeys from '../../../Config'
import {HttpStatus} from '../../../Types/HttpStatus';
import CustomError from '../../../Utils/CustomError';
import { AuthServiceInterfaceType } from '../../Service-interface/AuthServiceInterface';

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