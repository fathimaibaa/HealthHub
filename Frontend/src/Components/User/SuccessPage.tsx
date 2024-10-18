
import { Link } from "react-router-dom";

const Success = () => {
  return (
    <div className="bg-white h-[75vh] flex items-center justify-center">
      <div className="bg-white p-10 md:mx-auto  rounded-lg">
      <svg
          viewBox="0 0 24 24"
          className="text-purple-600 w-32 h-32 mx-auto my-6"
        >
          <path
            fill="currentColor"
            d="M12,0A12,12,0,1,0,24,12,12.014,12.014,0,0,0,12,0Zm6.927,8.2-6.845,9.289a1.011,1.011,0,0,1-1.43.188L5.764,13.769a1,1,0,1,1,1.25-1.562l4.076,3.261,6.227-8.451A1,1,0,1,1,18.927,8.2Z"
          ></path>
        </svg>
        <div className="text-center">
          <h3 className="md:text-3xl text-lg text-gray-900 font-semibold text-center">
            Payment Done!
          </h3>
          <p className="text-gray-600 my-4 text-lg">
            Thank you for completing your secure online payment.
          </p>
          <p className="text-gray-600 text-lg">Have a great day!</p>
          <div className="py-10 text-center">
            <Link
              to='/'
              className="px-8 bg-purple-800 hover:bg-purple-500 text-white font-semibold py-3 rounded-lg"
            >
              GO BACK
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Success;
