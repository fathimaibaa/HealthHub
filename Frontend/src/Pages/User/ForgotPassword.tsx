import { Link } from "react-router-dom";
import { USER_API, emailRegex } from "../../Constants/Index";
import { useFormik } from "formik";
import axios from "axios";
import showToast from "../../utils/Toaster";



interface ForgotPasswordResponse {
  message: string;
}


const ForgotPassword = () => {
  const formik = useFormik({
    initialValues: { email: "" },
    validate: ({ email }) => {
      let errors: { email?: string } = {};
  
      if (!email.trim().length) errors.email = "Email is Required*";
      else if (!emailRegex.test(email)) errors.email = "Invalid email address";
      return errors;
    },
    onSubmit: ({ email }) => {
      axios
        .post<ForgotPasswordResponse>(USER_API + "/forgot_password", { email })
        .then(({ data }) => showToast(data.message, "success"))
        .catch(({ response }) => {
          showToast(response.data.message, "error");
        });
    },
  });
  

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-96 p-8 bg-gray-100 bg-opacity-80 rounded-xl shadow-lg">
        <h2 className="font-bold text-black-400 text-3xl mb-5 text-center">Forgot Password</h2>
        <form className="my-5" onSubmit={formik.handleSubmit}>
          <div className="flex flex-col space-y-5">
            <label htmlFor="email">
              <p className="font-medium text-gray-700 pb-2">Email :</p>
              <input
                type="text"
                className="w-full py-2 px-3 border md:px-10 border-slate-200 rounded-lg focus:outline-none focus:border-slate-500 hover:shadow"
                {...formik.getFieldProps("email")}
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-red-500">{formik.errors.email}</p>
              )}
            </label>

            <button
              className="w-full py-2 bg-purple-700 hover:bg-purple-600 text-white font-bold py-2 px-6 mt-4 rounded-lg focus:outline-none focus:shadow-outline inline-flex space-x-2 items-center justify-center"
              type="submit"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z"
                />
              </svg>
              <span>Reset password</span>
            </button>
            <p className="text-center">
              Remember password?
              <Link
                to="/user/login"
                className="text-indigo-600 font-medium inline-flex space-x-1 items-center"
              >
                <span>Login now</span>
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
