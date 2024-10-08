import {
    nameRegex,
    emailRegex,
} from "../Constants/Index";

type SignupValidation = Partial<{
name: string;
email: string;
phoneNumber:string,
password: string;
confirmPassword: string;
}>;

const validateSignUp = (values:{
    name: string;
    email:string;
    phoneNumber:string,
    password:string;
    confirmPassword: string;
})=>{
    const {name,email,phoneNumber,password,confirmPassword} = values;
    const errors: SignupValidation = {};

    if(!name.trim().length){
        errors.name = "Name is Required*";
    }else if (name.length > 20) {
        errors.name = "Must be 20 characters or less.";
    } else if (!nameRegex.test(name)) {
        errors.name =
          "First letter must be capital and no leading or trailing spaces.";
    }

  
    if(!email.trim().length){
        errors.email ="Email is Required*";
    }else if(!emailRegex.test(email)){
        errors.email = "Invalid email format";
    }


      if (!phoneNumber.trim().length) {
        errors.phoneNumber = "phoneNumber is Required*";
      } else if (!/^[6-9]\d{9}$/.test(phoneNumber)) {
        errors.phoneNumber = "Invalid phone number format";
      }


  if (!password.trim().length) {
    errors.password = "Password is Required*";
  } else if (password.length < 8) {
    errors.password = "Password must be at least 8 characters long.";
  } else if (!/[a-z]/.test(password) || !/[A-Z]/.test(password)) {
    errors.password = "Password must contain uppercase and lowercase letters.";
  } else if (!/\d/.test(password)) {
    errors.password = "Password must contain at least one digit.";
  } else if (!/[@$!%*?&]/.test(password)) {
    errors.password = "Password must contain at least one special character.";
  }

  if (!confirmPassword.trim().length) {
    errors.confirmPassword = "Confirm Password is Required*";
  } else if (
    confirmPassword.length !== password.length ||
    confirmPassword !== password
  ) {
    errors.confirmPassword = "Password is not matching";
  }

  return errors;

};

function validateLogin({
    email,
    password,
}:{
    email:string;
    password:string;
}){
    const errors: { email?: string; password?: string } = {};
    if (!email.trim().length) {
      errors.email = "Email is Required*";
    } else if (!emailRegex.test(email)) {
      errors.email = "Invalid email format.";
    }
    if (!password.trim().length) {
      errors.password = "Password is Required*";
    }
    return errors;
};

const validateResetPassword = ({
  password,
  confirmPassword,
}: {
  password: string;
  confirmPassword: string;
}) => {
  let errors: { password?: string; confirmPassword?: string } = {};

  if (!password.trim().length) {
    errors.password = "Password is Required*";
  } else if (password.length < 8) {
    errors.password = "Password must be at least 8 characters long.";
  } else if (!/[a-z]/.test(password) || !/[A-Z]/.test(password)) {
    errors.password = "Password must contain uppercase and lowercase letters.";
  } else if (!/\d/.test(password)) {
    errors.password = "Password must contain at least one digit.";
  } else if (!/[@$!%*?&]/.test(password)) {
    errors.password = "Password must contain at least one special character.";
  }

  if (!confirmPassword.trim().length) {
    errors.confirmPassword = "confirm Password is Required*";
  } else if (
    confirmPassword.length !== password.length ||
    confirmPassword !== password
  ) {
    errors.confirmPassword = "Password is not matching";
  }
  return errors;
};

export{
    validateSignUp,
    validateLogin,
    validateResetPassword
};




