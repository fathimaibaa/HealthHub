import React from 'react';
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { useFormik } from 'formik';
import { validateSignUp } from "../../Utils/Validation";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import showToast from '../../Utils/Toaster';
import { USER_API } from '../../Constants/Index';
import axios from 'axios';
import { setItemToLocalStorage } from '../../Utils/Setnget';
import login from "../../Assets/Images/login.jpg";

const Register: React.FC = () => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);


    interface NewUser {
        _id: string;
        name: string;
        email: string;
        phoneNumber: string;
      }
      
      interface RegisterResponse {
        message: string;
        newUser: NewUser;
      }
      


      const formik = useFormik({
        initialValues: {
          name: "",
          email: "",
          phoneNumber: "",
          password: "",
          confirmPassword: "",
        },
        validate: validateSignUp,
        onSubmit: ({ name, email, phoneNumber, password }) => {
          setIsSubmitting(true);
          axios
            .post<RegisterResponse>(USER_API + "/register", { name, email, phoneNumber, password })
            .then(({ data }) => {
              console.log(data);
              showToast(data.message, "success");
              setTimeout(() => {
                setItemToLocalStorage("userId", data.newUser._id);
                navigate("/user/verify_otp");
              }, 1000);
            })
            .catch(({ response }) => {
              const { message } = response.data;
              setIsSubmitting(false);
              showToast(message, "error");
            });
        },
      });
      

    return (
        <div className="flex items-center justify-center h-screen bg-cover bg-center"
        style={{ backgroundImage: `url(${login})` }}>
            <div className="w-full max-w-md p-8 bg-gray-100 bg-opacity-50 rounded-lg shadow-lg">
                <h2 className="text-3xl font-bold text-center text-purple-900 mb-5">Sign Up</h2>
                <form onSubmit={formik.handleSubmit} className="space-y-4 text-center">
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-gray-700 mb-1">Name:</label>
                        <input
                            type="text"
                            id="name"
                            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-purple-900"
                            {...formik.getFieldProps("name")}
                        />
                        {formik.errors.name && formik.touched.name && (
                            <div className="text-red-500">{formik.errors.name}</div>
                        )}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700 mb-1">Email:</label>
                        <input
                            type="text"
                            id="email"
                            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-purple-900"
                            {...formik.getFieldProps("email")}
                        />
                        {formik.errors.email && formik.touched.email && (
                            <div className="text-red-500">{formik.errors.email}</div>
                        )}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="phoneNumber" className="block text-gray-700 mb-1">Phone Number:</label>
                        <input
                            type="text"
                            id="phoneNumber"
                            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-purple-900"
                            {...formik.getFieldProps("phoneNumber")}
                        />
                        {formik.errors.phoneNumber && formik.touched.phoneNumber && (
                            <div className="text-red-500">{formik.errors.phoneNumber}</div>
                        )}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-gray-700 mb-1">Password:</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-purple-900"
                                {...formik.getFieldProps("password")}
                            />
                            <span
                                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="text-gray-700" />
                            </span>
                        </div>
                        {formik.errors.password && formik.touched.password && (
                            <div className="text-red-500">{formik.errors.password}</div>
                        )}
                    </div>
                    <div className="mb-6">
                        <label htmlFor="confirmPassword" className="block text-gray-700 mb-1">Confirm Password:</label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                id="confirmPassword"
                                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-purple-900"
                                {...formik.getFieldProps("confirmPassword")}
                            />
                            <span
                                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} className="text-gray-700" />
                            </span>
                        </div>
                        {formik.errors.confirmPassword && formik.touched.confirmPassword && (
                            <div className="text-red-500">{formik.errors.confirmPassword}</div>
                        )}
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-purple-900 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-lg focus:outline-none focus:shadow-outline"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Submitting..." : "Register"}
                    </button>
                </form>
                <p className="mt-2 text-sm text-gray-700">
                    Already have an account?{" "}
                    <Link to="/user/login" className="text-blue-500 underline">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
