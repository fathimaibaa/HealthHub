
import { useNavigate, useParams } from "react-router-dom";
import { validateResetPassword } from "../../utils/Validation";
import axios from "axios";
import { USER_API } from "../../Constants/Index";
import showToast from "../../utils/Toaster";
import { useFormik } from "formik";

interface ResetPasswordResponse {
    message: string;
  }
  

const ResetPasswordForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const formik = useFormik({
        initialValues: {
          password: "",
          confirmPassword: "",
        },
        validate: validateResetPassword,
        onSubmit: ({ password }) => {
          axios
            .post<ResetPasswordResponse>(USER_API + `/reset_password/${id}`, { password })
            .then(({ data }) => {
              showToast(data.message, "success");
              navigate("/user/login");
            })
            .catch(({ response }) => showToast(response.data.message, "error"));
        },
      });
      

    return (
        <div 
      className="flex items-center justify-center h-screen bg-cover bg-center" 
    
    >
            <div className="max-w-md w-full bg-gray-100 bg-opacity-80 p-8 rounded-lg shadow-md">
                <h1 className="text-3xl font-bold mb-4 text-center text-black-400">Reset Password</h1>
                <form onSubmit={formik.handleSubmit}>
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-lg font-medium text-black-400">Password :</label>
                        <input type="password" id="password" className=" md:px-10 mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-lg sm:text-lg border-gray-300 rounded-md py-2"
                            {...formik.getFieldProps("password")}
                        />  
                        {!formik.errors.password ||
                            (formik.touched.password && (
                                <p className="text-red-500">{formik.errors.password}</p>
                            ))}
                    </div>
                    <div className="mb-6">
                        <label htmlFor="confirm-password" className="block text-lg font-medium text-black-400">Confirm Password :</label>
                        <input type="password" id="confirm-password" className=" md:px-10 mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-lg sm:text-lg border-gray-300 rounded-md py-2"
                            {...formik.getFieldProps("confirmPassword")}
                        />
                        {!formik.errors.confirmPassword ||
                            (formik.touched.confirmPassword && (
                                <p className="text-red-500">
                                    {formik.errors.confirmPassword}
                                </p>
                            ))}
                    </div>
                    <div className="text-center">
                        <button type="submit" className="w-full bg-purple-700 text-white py-2 px-4 rounded-md hover:bg-purple-600 focus:outline-none focus:ring-2 focus:outline-none focus:shadow-outline">Reset Password</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResetPasswordForm;
