import { HttpStatus } from "../Types/HttpStatus";
class CustomError extends Error {
    statusCode: number;
    status:string;
    isOperational:boolean;
    constructor(message:string, statusCode: HttpStatus){
        super(message);
      
        this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
    }

}
export default CustomError