import React, { useEffect, useState } from "react";
import Navbar from "../../Components/User/Navbar/Navbar";
import axiosJWT from "../../Utils/AxiosService";
import { CHAT_API, USER_API } from "../../Constants/Index";
import { useNavigate, useParams } from "react-router-dom";
import showToast from "../../Utils/Toaster";
import { FaFilePdf, FaFileUpload, FaPlus, FaTimes, FaTrash } from "react-icons/fa";
import { FiMessageSquare } from "react-icons/fi";
import axios from "axios";
import { useAppSelector } from "../../Redux/Store/Store";
import { ZIM } from "zego-zim-web";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { uploadDocumentToCloudinary } from "../../Api/UploadImages";
import { AiOutlineFileText } from "react-icons/ai";


const AppointmentDetails: React.FC = () => {
  const user = useAppSelector((state) => state.UserSlice);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const [doctorDetails, setDoctorDetails] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [prescription, setPrescription] = useState<any | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(1);
  const [reviewExists, setReviewExists] = useState(false);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [documents, setDocuments] = useState<{
    name: string;
    documentFile: File | null;
  }[]>([
    {
      name: "",
      documentFile: null,
    },
  ]);

  const userID = user.id;
  const userName = user.name;
  const appID = 1444652730;
  const serverSecret = "6da2f62533cbfbc00a886eea383c39e9";
  //@ts-ignore
  const TOKEN = ZegoUIKitPrebuilt.generateKitTokenForTest(appID,serverSecret,null,userID,userName);
  const zp = ZegoUIKitPrebuilt.create(TOKEN);
  zp.addPlugins({ ZIM });

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const response :any= await axiosJWT.get(`${USER_API}/bookingdetails/${id}`);
        const bookingData = response.data.data.bookingDetails;
        setBookingDetails(bookingData);

        const doctorResponse:any = await axiosJWT.get(
          `${USER_API}/doctor/${bookingData.doctorId}`
        );
        setDoctorDetails(doctorResponse.data.doctor);

        await checkReview();
      } catch (error) {
        console.error("Error fetching booking details:", error);
      }
    };

    const checkReview = async () => {
      try {
        const response:any = await axiosJWT.get(`${USER_API}/reviewexists`, {
          params: {
          appointment:id,
          },
        });
        setReviewExists(response.data.reviewExists);
      } catch (error) {
        console.error("Error checking review existence:", error);
      }
    };
    
    fetchBookingDetails();

 
}, [id,userID]);

  const handleCancelAppointment = async () => {
    try {
      const appointmentTime = new Date(bookingDetails.date);
      const currentTime = new Date();
      const timeDifference = (appointmentTime.getTime() - currentTime.getTime()) / (1000 * 60 * 60); // Time difference in hours
  
      let refundAmount = bookingDetails.fee;
  
      if (timeDifference < 6) {
        refundAmount = bookingDetails.fee * 0.8; // Deduct 20%
      }
  
      await axiosJWT.put(`${USER_API}/bookingdetails/${id}`, {
        appoinmentStatus: "Cancelled",
        cancelReason,
        refundAmount, // Pass the refund amount to the backend
      });
  
      setBookingDetails((prevState: any) => ({
        ...prevState,
        appoinmentStatus: "Cancelled",
      }));
      showToast("Appointment Cancelled", "success");
      setShowModal(false);
    } catch (error) {
      console.error("Error cancelling appointment:", error);
    }
  };

  const isWithinOneHour = (appointmentDate: Date, timeSlot: string) => {
    let [time, modifier] = timeSlot.split(" ");
    let [hours, minutes] = time.split(":").map(Number);
  
    if (modifier === "PM" && hours < 12) {
      hours += 12;
    }
    if (modifier === "AM" && hours === 12) {
      hours = 0;
    }
    const appointmentTime = new Date(appointmentDate);
    appointmentTime.setHours(hours, minutes, 0, 0);
    const oneHourBefore = new Date(appointmentTime.getTime() - 60 * 60 * 1000);
    const currentTime = new Date();
    return currentTime >= oneHourBefore && currentTime <= appointmentTime;
  };
  

  const handleReschedule = () => {
    navigate(`/user/appoinment/${bookingDetails.doctorId}`);
  };

  const renderStatus = () => {
    const appointmentDate = new Date(bookingDetails.date);
    
    const withinOneHour = isWithinOneHour(appointmentDate, bookingDetails.timeSlot);
  
    if (withinOneHour) {
      return (
        <p className="text-purple-700 text-xl font-bold">
          Please stay on this site. The doctor will connect with you on time.
        </p>
      );
    }
    if (bookingDetails.appoinmentStatus === "Booked") {
      return (
        <button
          onClick={() => setShowModal(true)}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded mt-5"
        >
          Cancel Appointment
        </button>
      );
    } else if (bookingDetails.appoinmentStatus === "Cancelled") {
      return (
        <div className="flex justify-between items-center">
          <p className="text-red-700 text-xl text-bold">Appointment Cancelled</p>
          <button
            onClick={handleReschedule}
            className="bg-purple-800 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
          >
            Reschedule Appointment
          </button>
        </div>
      );
    } else if (bookingDetails.appoinmentStatus === "Consulted" || bookingDetails.appoinmentStatus === "unConsulted") {
      return (
        <>
      <p className="text-purple-700 text-xl text-bold">Consultation Completed</p>

      <button
          onClick={() => setShowReviewModal(true)}
          className={`bg-purple-700 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded mt-5 ${
            reviewExists ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={reviewExists}
        >
          {reviewExists ? "Review Added" : "Add Review"}
        </button>
    </>
    );
    }
  };

  const showPrescription = async (appoinmentId: any) => {
    const data = { appoinmentId };

    const response:any = await axiosJWT.post(`${USER_API}/fetchPrescription`, data);

    if (response.data && response.data.response) {
      setPrescription(response.data.response);
      setShowPrescriptionModal(true);
    } else {
      showToast("No prescription added by the doctor", "error");
    }
  };


  const showDocument = async (_id: string | undefined) =>{
    setShowDocumentModal(true);
  }
  const showDocumentPage = async (id: string | undefined) =>{
    navigate(`/user/documents/${id}`);
  }



  function closeModal(): void {
    setShowPrescriptionModal(false);
    setPrescription(null);
  }
  function closeDocumentModal(): void {
    setShowDocumentModal(false);
  }

  const closeReviewModal = (): void => {
    setShowReviewModal(false);
  };

  const handleNameChange = (index: number, value: string) => {
    const updatedDocuments = [...documents];
    updatedDocuments[index].name = value;
    setDocuments(updatedDocuments);
};

const handleFileChange = (index: number, file: any) => {
    const updatedDocuments = [...documents];
    updatedDocuments[index].documentFile = file;
    setDocuments(updatedDocuments);
};


const handleSubmit = async (event: any) => {
  event.preventDefault();
  
  try {
    const documentsData = [];
    
    for (const document of documents) {
      const url = await uploadDocumentToCloudinary(document.documentFile);
      documentsData.push({ name: document.name, url: url });
    }
    
    const response:any = await axiosJWT.post(`${USER_API}/uploadDocuments`, {   id: id, documents: documentsData, });
    if (response.data.sucess) {
      showToast('Documents uploaded successfully', 'success');
      setShowDocumentModal(false);
      setDocuments([]);
    } else {
      showToast('Failed to upload documents', 'error');
    }
  } catch (error) {
    console.error('Error uploading documents:', error);
    showToast('Error uploading documents', 'error');
  }
};


const addDocument = () => {
    setDocuments([...documents, { name: '', documentFile: null }]);
};

const removeDocument = (index:number) => {
    const updatedDocuments = [...documents];
    updatedDocuments.splice(index, 1);
    setDocuments(updatedDocuments);
};



  const handleChat = () => {
    axios
      .post(CHAT_API + `/conversations`, {
        senderId: user.id,
        recieverId: doctorDetails._id,
      })
      .then(({}) => {
        navigate("/user/chat");
      })
      .catch(() => {
        console.log("error in sending chat");
      });
  };

  const submitReview = async () => {
    try {
      const response = await axiosJWT.post(`${USER_API}/createreviews`, {
        review: {
          rating,
          reviewText: review,
          user: userID,
          doctor: bookingDetails.doctorId,
          appoinment:id
        },
      });

      if (response.status === 200) {
        showToast("Review submitted successfully","success");
        setShowReviewModal(false);
        setReview("");
        setRating(1);
        setReviewExists(true);
      } else {
        alert("Failed to submit review");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      showToast("Error submitting review","error");
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Booking Details</h1>

        {bookingDetails && doctorDetails && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md border border-purple-200">
              <div className="flex items-center mb-4">
                <img
                  src={doctorDetails.profileImage}
                  alt={doctorDetails.doctorName}
                  className="w-40 h-40 rounded mr-4"
                />
                <div>
                  <h2 className="text-2xl font-bold">
                    Dr. {doctorDetails.doctorName}
                  </h2>
                  <p>{doctorDetails?.department?.departmnetName}</p>
                  <p className="text-purple-600 font-semibold">Verified</p>
                  <div className="flex">
                    <button
                      onClick={() => handleChat()}
                      className="bg-blue-800 flex hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-3"
                    >
                      <FiMessageSquare className="mr-2 mt-1" />
                      Chat
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md border ">
              <div>
                <h1 className="text-2xl font-bold mb-1 mt-4">Prescription</h1>
               
                
                
                <p className="mb-3 text-blue-900">
                  Click the button to see the prescription
                </p>
                <button
                  onClick={() => showPrescription(id)}
                  className="bg-purple-800 flex hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
                >
                  <FaFilePdf className="mr-2 mt-1" />
                  Check Prescription
                </button>
              </div>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg shadow-md border border-blue-200">
              <h2 className="text-2xl font-bold mb-4">Documents</h2>
              <div>
                <p className="text-blue-900">Click the button to add the lab record documents </p>
                <p
                  onClick={() => showDocument(id)}
                  className="text-orange-800 hover:text-orange-700 cursor-pointer underline mt-3 flex items-center font-bold text-md"
                >
                  <FaFileUpload className="mr-2 mt-1" />
                  Add Documents
                </p>
                <p className="mt-3 text-blue-900">Click the view documents button to see all the lab docuemnts uploaded </p>
                <p
                  onClick={() => showDocumentPage(id)}
                  className="text-purple-900 hover:text-purple-700 cursor-pointer underline mt-3 flex items-center font-bold text-md"
                >
                  <AiOutlineFileText className="mr-2 mt-1" />
                  View Document
                </p>
              </div>
            </div>
            
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-blue-200">
              <h2 className="text-2xl font-bold mb-4"> Appointment Details </h2>
              <div>
                <p className="font-medium">
                  Date: {new Date(bookingDetails.date).toLocaleDateString()}
                </p>
                <p className="font-medium">
                  Time Slot: {bookingDetails.timeSlot}
                </p>
                <p className="font-medium">
                  Patient Name: {bookingDetails.patientName}
                </p>
                <p className="font-medium">
                  Patient Problem: {bookingDetails.patientProblem}
                </p>
                {renderStatus()}
                
              </div>
            </div>

            
          </div>
        )}

        {/* Modal for cancellation reason */}
        {showModal && (
          <div className="fixed top-0 left-0 flex justify-center items-center w-full h-full bg-gray-900 bg-opacity-50 z-50">
            <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all max-w-lg w-full">
              <div className="bg-gray-50 px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900">
                  Reason for Cancellation
                </h3>
                <div className="mt-2">
                  <textarea
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    className="block w-full p-2 sm:text-sm border-gray-300 rounded-md"
                    rows={4}
                    placeholder="Enter reason for cancellation"
                  ></textarea>
                </div>
              </div>
              <div className="bg-gray-100 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={handleCancelAppointment}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-500 text-base font-medium text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

{showPrescriptionModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white p-6 rounded-lg shadow-xl max-w-lg w-full">
      {prescription ? (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2">
            Prescription Details
          </h2>
          <p className="text-gray-700">
            <span className="font-bold">Doctor:</span> {doctorDetails.doctorName}
          </p>
          <p className="text-gray-700">
            <span className="font-bold">Prescription Date:</span> {new Date(prescription.prescriptionDate).toDateString()}
          </p>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Medicines:</h3>
            <ul className="list-disc list-inside pl-4 space-y-2">
              {prescription.medicines?.map((medicine: any, index: any) => (
                <li key={index} className="text-gray-700">
                  <span className="font-semibold">Name:</span> <span className="text-red-700">{medicine.name}</span> - 
                  <span className="font-semibold"> Dosage:</span> <span className="text-red-700">{medicine.dosage}</span> - 
                  <span className="font-semibold"> Instructions:</span> <span className="text-red-700">{medicine.instructions}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex justify-end space-x-4">
            <button
              onClick={closeModal}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition ease-in-out duration-300"
            >
              Close
            </button>
          </div>
        </div>
      ) : (
        <p className="text-gray-700">No Prescription added ...</p>
      )}
    </div>
  </div>
)}



{showReviewModal && (
          <div className="fixed top-0 left-0 flex justify-center items-center w-full h-full bg-gray-900 bg-opacity-50">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Review Appointment</h2>
                <button
                  onClick={closeReviewModal}
                  className="text-gray-500 hover:text-gray-600"
                >
                  <FaTimes />
                </button>
              </div>
              <textarea
                className="w-full h-32 p-2 border border-gray-300 rounded mb-4"
                placeholder="Write your review"
                value={review}
                onChange={(e) => setReview(e.target.value)}
              ></textarea>
              <label className="block mb-2 font-bold">Rating:</label>
              <select
                value={rating}
                onChange={(e) => setRating(parseInt(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded mb-4"
              >
                {/* <option value={0}>Select Rating</option> */}
                <option value={1}>1 - Very Poor</option>
                <option value={2}>2 - Poor</option>
                <option value={3}>3 - Average</option>
                <option value={4}>4 - Good</option>
                <option value={5}>5 - Excellent</option>
              </select>
              <button
                onClick={submitReview}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
               {reviewExists ? "Review Added" : "Submit Review"}
              </button>
            </div>
          </div>
        )}



{showDocumentModal && (
          <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
            <div className="bg-white rounded-lg overflow-hidden shadow-xl max-w-lg w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-gray-800">Add Documents</h2>
                <button
                  onClick={closeDocumentModal}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <FaTimes />
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                {documents.map((document, index) => (
                  <div key={index} className="mb-4">
                    <div className="flex items-center mb-2">
                      <input
                        type="text"
                        value={document.name}
                        onChange={(e) => handleNameChange(index, e.target.value)}
                        className="block w-full p-2 sm:text-sm border-gray-300 rounded-md"
                        placeholder="Document Name"
                      />
                      <button
                        type="button"
                        onClick={() => removeDocument(index)}
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        <FaTrash />
                      </button>
                    </div>
                    <input
                      type="file"
                      onChange={(e) => handleFileChange(index, e.target.files?.[0])}
                      className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100"
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addDocument}
                  className="flex items-center mb-4 text-purple-600 hover:text-purple-800"
                >
                  <FaPlus className="mr-2" />
                  Add Another Document
                </button>
                <button
                  type="submit"
                  className="w-full bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition ease-in-out duration-300"
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        )}
   


      </div>
    </>
  );
};

export default AppointmentDetails;
