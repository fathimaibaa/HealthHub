import axios from "axios";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DOCTOR_API } from "../../constants/Index";
import showToast from "../../utils/Toaster";

const EmailVerificationPage = () => {
  const [isVerified, setIsVerified] = useState<Boolean>(false);
  const { token } = useParams();
  const navigate = useNavigate();
  const verifyEmail = () => {
    axios
      .post(DOCTOR_API + `/verify-token/${token}`)
      .then(({ data }) => {
        showToast(data.message, "success");
        setIsVerified(true);
      })
      .catch(({ response }) => {
        const { message } = response.data;
        showToast(message, "error");
      });
  };
  return (
    <>
      {isVerified ? (
        <div className=" bg-emerald-200 flex justify-center items-center min-h-screen ">
          <div className="bg-white shadow-lg rounded-lg p-8 max-w-md border">
            <h1 className="text-4xl font-extrabold mb-4 text-center text-gray-900">
              Email Verified!
            </h1>
            <p className="text-lg mb-6 text-center text-gray-700">
              Your email has been successfully verified. You can now start using
              HealthHub .
            </p>
            <button
              className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded-full w-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
              onClick={() => navigate("/doctor/login")}
            >
              Continue
            </button>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center min-h-screen bg-emerald-100">
          <div className="bg-white shadow-lg rounded-lg p-8 max-w-md border">
            <h1 className="text-5xl font-bold mb-4 text-center text-gray-900">
              Welcome to HealthHub!
            </h1>
            <p className="text-lg mb-6 text-center text-gray-700">
              Please verify your email by clicking the button below to complete
              the registration process.
            </p>
            <button
              className="bg-purple-700 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded-full w-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
              onClick={verifyEmail}
            >
              Verify
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default EmailVerificationPage;