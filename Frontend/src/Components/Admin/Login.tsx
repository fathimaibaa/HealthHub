import { useFormik } from "formik";
import { useState } from "react";
import axios from "axios";
import showToast from "../../utils/Toaster";
import { useNavigate } from "react-router-dom";
import { validateLogin } from "../../utils/Validation";
import { ADMIN_API } from "../../Constants/Index";
import { useAppDispatch } from "../../rrrr/Store/Store";
import { setUser } from "../../rrrr/Slices/UserSlice";
import { setItemToLocalStorage } from "../../utils/Setnget";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";




const Login: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState<Boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  interface LoginResponse {
    admin: {
      name: string;
      role: string;
    };
    message: string;
    access_token: string;
    refresh_token: string;
  }
  
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validate: validateLogin,
    onSubmit: ({ email, password }) => {
      setIsSubmitting(true);
      axios
        .post<LoginResponse>(ADMIN_API + "/login", { email, password })
        .then(({ data }) => {
          console.log(data, "datadatadatadatadatadata");
          const { name, role } = data.admin;
          const { message, access_token, refresh_token } = data;
          showToast(message, "success");
          setItemToLocalStorage("access_token", access_token); 
          setItemToLocalStorage("refresh_token", refresh_token);
          dispatch(setUser({ isAuthenticated: true, name, role }));
          navigate("/admin");
        })
        .catch(({ response }) => {
          const { message } = response.data as LoginResponse;
          setIsSubmitting(false);
          showToast(message, "error");
        });
    },
  });
  

  return (
    <section
    className="flex items-center justify-center min-h-screen"
    style={{
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}
  >
    <div className="flex-1  flex flex-col items-center justify-center px-6 py-8 mx-auto md:mx-0 md:ml-8 lg:ml-16 xl:ml-24">
      <div className="w-full bg-white rounded-2xl shadow-2xl md:max-w-md xl:p-0">
        <div className="p-6 space-y-4 md:p-8">
          <h1 className="text-xl font-bold leading-tight tracking-tight text-headerText md:text-2xl">
            Welcome Back Admin!
          </h1>

          <form className="space-y-4" onSubmit={formik.handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-secondaryColor"
              >
                Email
              </label>
              <input
                type="text"
                id="email"
                placeholder="jhondoe@gmail.com"
                className=" border-b-2 border-b-slate-200 text-gray-900 outline-none sm:text-sm  focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                autoFocus
                {...formik.getFieldProps("email")}
              />
              {formik.errors.email && formik.touched.email && (
                <div className="text-red-500">{formik.errors.email}</div>
              )}
            </div>
            <div className="relative">
  <label
    htmlFor="password"
    className="block mb-2 text-sm font-medium text-secondaryColor"
  >
    Password
  </label>
  <input
    type={showPassword ? "text" : "password"}
    id="password"
    placeholder="••••••••"
    className="border-b-2 border-b-slate-200 text-gray-900 outline-none sm:text-sm focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
    {...formik.getFieldProps("password")}
  />
  <span
    className="absolute top-1/2 right-2 transform -translate-y-1/2 cursor-pointer"
    onClick={() => setShowPassword(!showPassword)}
  >
    <FontAwesomeIcon
      icon={showPassword ? faEyeSlash : faEye}
      className="text-gray-700"
    />
  </span>
  {formik.errors.password && formik.touched.password && (
    <div className="text-red-500">{formik.errors.password}</div>
  )}
</div>

            <button
              type="submit"
              className="w-full px-6 py-2 text-white rounded-lg bg-gradient-to-l from-purple-700 to-purple-600 hover:bg-gradient-to-r  transition-all duration-400 "
              disabled={isSubmitting ? true : false}
            >
              <span className="font-semibold"> SignIn</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  </section>
    
  );
};

export default Login;
