import { Request,Response,NextFunction } from "express";
import CustomError from "../../../Utils/CustomError";

const errorHandlingMiddleware = (
    err: CustomError,
    req: Request,
    res: Response,
    next: NextFunction
)=>{
    console.log(err);
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";
    if(err.statusCode === 404){
        res.status(err.statusCode)
        .json({errors: err.status, errorMessage:err.message});
    }else{
        res.status(err.statusCode).json({
            success:false,
            message:err.message,
        });
    }
};

export default errorHandlingMiddleware;