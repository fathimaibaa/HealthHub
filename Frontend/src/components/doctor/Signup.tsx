import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from "formik";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { DOCTOR_API } from '../../Constants/Index';
import showToast from "../../Utils/Toaster";
import { validateSignUp } from "../../Utils/Validation";
interface SignUpResponse {
  message: string;
}
const Signup: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
    },
    validate: validateSignUp,
    onSubmit: ({ name: doctorName, phoneNumber, email, password }) => {
      setIsSubmitting(true);
      axios
        .post<SignUpResponse>(DOCTOR_API + "/register", { doctorName, phoneNumber, email, password })
        .then(({ data }) => {
          showToast(data.message, "success");
          setTimeout(() => {
            navigate("/doctor/login");
          }, 1000);
        })
        .catch(({ response }) => {
          const { message } = response.data as { message: string };
          setIsSubmitting(false);
          showToast(message, "error");
        });
    },
  });

  return (
    <section className="flex flex-col md:flex-row h-screen items-center justify-center">
      <div className="bg-white mb-20 w-full md:max-w-md lg:max-w-full md:mx-auto md:w-1/2 xl:w-1/3 h-screen px-6 lg:px-16 xl:px-12 flex items-center justify-center">
        <div className="w-full h-100">
          <h1 className="text-xl md:text-2xl font-bold leading-tight mt-12">
            Sign Up
          </h1>
          <form className="mt-6" onSubmit={formik.handleSubmit}>
            <div>
              <label className="block text-gray-700">Name</label>
              <input
                type="text"
                placeholder="Enter Doctor name"
                className="w-full px-3 py-2 rounded-lg bg-gray-100 mt-2 border focus:border-purple-900 focus:bg-white focus:outline-none"
                autoFocus
                {...formik.getFieldProps("name")}
              />
              {formik.errors.name && formik.touched.name && (
                <div className="text-red-500">{formik.errors.name}</div>
              )}
            </div>

            <div>
              <label className="block text-gray-700">Email Address</label>
              <input
                type="text"
                placeholder="Enter Email Address"
                className="w-full px-3 py-2 rounded-lg bg-gray-100 mt-2 border focus:border-purple-900 focus:bg-white focus:outline-none"
                {...formik.getFieldProps("email")}
              />
              {formik.errors.email && formik.touched.email && (
                <div className="text-red-500">{formik.errors.email}</div>
              )}
            </div>

            <div>
              <label className="block text-gray-700">PhoneNumber</label>
              <input
                type="text"
                placeholder="Enter Phone number"
                className="w-full px-3 py-2 rounded-lg bg-gray-100 mt-2 border focus:border-purple-900 focus:bg-white focus:outline-none"
                {...formik.getFieldProps("phoneNumber")}
              />
              {formik.errors.phoneNumber && formik.touched.phoneNumber && (
                <div className="text-red-500">{formik.errors.phoneNumber}</div>
              )}
            </div>

            <div>
              <label className="block text-gray-700">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter Password"
                  className="w-full px-3 py-2 rounded-lg bg-gray-100 mt-2 border focus:border-purple-900 focus:bg-white focus:outline-none"
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

            <div className="mt-4">
              <label className="block text-gray-700">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  className="w-full px-3 py-2 rounded-lg bg-gray-100 mt-2 border focus:border-purple-900 focus:bg-white focus:outline-none"
                  {...formik.getFieldProps("confirmPassword")}
                />
                <span
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} className="text-gray-700" />
                </span>
              </div>
              {formik.errors.confirmPassword &&
                formik.touched.confirmPassword && (
                  <div className="text-red-500">
                    {formik.errors.confirmPassword}
                  </div>
                )}
            </div>

            <button
              type="submit"
              className="w-full block bg-purple-600 hover:bg-purple-900 transition duration-300 focus:bg-purple-900 text-white font-semibold rounded-lg px-4 py-3 mt-6"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing Up..." : "Sign Up"}
            </button>
          </form>
          <p className="mt-8">
            Have an account?
            <Link
              to={"/doctor/login"}
              className="text-blue-500 "
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Signup;
