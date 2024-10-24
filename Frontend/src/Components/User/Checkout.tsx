import { loadStripe } from "@stripe/stripe-js";
import React, { useEffect , useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { USER_API } from "../../Constants/Index";
import { RootState } from "../../Redux/Store/Store";
import axiosJWT from '../../Utils/AxiosService';
import showToast from "../../Utils/Toaster";


const Checkout: React.FC = () => {
  const appointmentData = useSelector((state: RootState) => state.appointment);
  const userId = useSelector((state: RootState) => state.UserSlice.id); // Assuming user ID is stored in the user state
  // const { doctorId } = useParams<{ doctorId: string }>(); // Extract doctorId from URL params
  const [showPaymentOptions, setShowPaymentOptions] = useState<boolean>(false);
  const [walletBalance, setWalletBalance] = useState<number>(0); 
  const [paymentMethod, setPaymentMethod] = useState("Online");
  const navigate = useNavigate();
  


  useEffect(() => {
    // Fetch wallet balance on component mount
    const fetchWalletBalance = async () => {
      try {
        const response:any = await axiosJWT.get(`${USER_API}/fetchWallet/${userId}`);
        setWalletBalance(response.data.getWallet.balance);
      } catch (error) {
        console.error("Error fetching wallet balance:", error);
      }
    };
    fetchWalletBalance();
  }, [userId]);

  const handleInputChange = (method: "Wallet" | "Online") => {
    if (method === "Wallet") {
      setPaymentMethod("Wallet");
    }
    if (method === "Online") {
      setPaymentMethod("Online");
    }
  };

  const handleSubmit = async () => {
    try {
      const stripePromise = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
      const response:any = await axiosJWT.post(`${USER_API}/appointments`, {
        ...appointmentData,
        userId,
        paymentMethod
      });
      console.log(response,'payment resssssssssssssssssssssssssssssssss')
      if (response.data.id) {
        const stripe = await stripePromise;
        const result = await stripe?.redirectToCheckout({
          sessionId: response.data.id,
        });
        if (result?.error) console.error(result.error);

        // const bookingId = response.data.booking.bookingId;
      } else {
        showToast(response.data.message, "error");
      }
    } catch (error) {
      console.log("Error in creating order", error);
    }
  };

  const handleWalletPayment = async () =>{
    try {
      const response :any= await axiosJWT.post(`${USER_API}/walletPayment`, {
        ...appointmentData,
        userId,
        paymentMethod
      });
      if (response.data.success) {
        const bookingId = response.data.createBooking._id;

        // Update wallet amount before navigating
        
        navigate(`/payment_status/${bookingId}?success=true`);
      } else {
        showToast(response.data.message, "error");
      }
      
    } catch (error) {
      console.log("error in wallet payment")
    }
  }

  const handlePaymentButtonClick = () => {
    setShowPaymentOptions(true);
  };


  return (
    <div className="container mx-auto p-4">
      {appointmentData && (
        <div className="border p-4 rounded shadow-lg grid grid-cols-2 gap-4">
          <div className="text-sm text-gray-700 mb-4">

            <div className="border p-4 rounded mb-4">
              <img src={appointmentData.doctorImage} alt="doctor image" className="w-64 h-64 object-cover rounded-md mb-4" />
              <h1 className="text-2xl font-bold mb-4">Dr. {appointmentData.doctorName}</h1>
              <p className="text-xl"><strong>Amount:</strong> ₹{appointmentData.fee}</p>
              <p className="text-xl"><strong>Date:</strong> {appointmentData.date}</p>
              <p className="text-xl"><strong>Time:</strong> {appointmentData.timeSlot}</p>
            </div>  

            <div className="text-sm text-gray-900 mb-4">
            <div className="border p-4 rounded mb-4">
            <p className="text-xl"><strong>Wallet Balance:</strong> ₹{walletBalance || 0}</p>

            </div>     
          </div>

          </div>
          
          <div className="grid gap-4">
            <div className="border p-4 rounded mb-4">
              <h2 className="text-xl font-bold mb-2">Patients Details</h2>
              <div className="grid gap-4">
                <div className="flex flex-col">
                  <h1>Patient Name &nbsp;:&nbsp; {appointmentData.patientName}</h1> 
                </div>
                <div className="flex flex-col">
                  <h1>Patient Age &nbsp;:&nbsp; {appointmentData.patientAge}</h1> 
                </div>
                <div className="flex flex-col">
                  <h1>Patient Number &nbsp;:&nbsp; {appointmentData.patientNumber}</h1> 
                </div>
                <div className="flex flex-col">
                  <h1>Patient Problem &nbsp;:&nbsp; {appointmentData.patientProblem}</h1> 
                </div>
              </div>
            </div>

            <div className="border p-4 rounded mb-4">
              <h2 className="text-xl font-bold mb-4">Payment</h2>
              <div className="p-2">
                <label className="block mb-2 text-sm font-semibold text-gray-900">
                  Payment Method
                </label>
                <div className="">
                  <div className="mb-2 flex items-center">
                    <input
                      className="mr-2 h-5 w-5"
                      type="radio"
                      name="paymentMethod"
                      id="Online"
                      value="Online"
                      defaultChecked
                      onChange={() => handleInputChange("Online")}
                    />
                    <label className="hover:cursor-pointer" htmlFor="Online">
                      Online
                    </label>
                  </div>
                  <div className="mb-2 flex items-center">
                    <input
                      className="mr-2 h-5 w-5"
                      type="radio"
                      name="paymentMethod"
                      id="Wallet"
                      value="Wallet"
                      onChange={() => handleInputChange("Wallet")}
                    />
                    <label className="hover:cursor-pointer" htmlFor="Wallet">
                      Wallet
                    </label>
                  </div>
                  <div className="text-right">
                    <button
                      className="bg-blue-500 text-white py-2 px-4 rounded"
                      onClick={handlePaymentButtonClick}
                    >
                      Proceed to Payment
                    </button>
                  </div>
                </div>

                {showPaymentOptions && paymentMethod === "Online" && (
                  <div className="mt-4">
                    <button
                      onClick={handleSubmit}
                      className="bg-cyan-950 px-4 py-2 rounded-md shadow-md mt-4 ml-2"
                    >
                      <p className="text-white">Stripe Online Payment</p>
                    </button>
                  </div>
                )}
                
                {showPaymentOptions && paymentMethod === "Wallet" && (
                  <div className="mt-4">
                    <button
                      onClick={handleWalletPayment}
                      className="bg-green-500 px-4 py-2 rounded-md shadow-md mt-4 ml-2"
                    >
                      <p className="text-white">Wallet Payment</p>
                    </button>
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
  