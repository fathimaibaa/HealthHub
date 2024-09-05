import React, { useState } from "react";
import { UserInterface } from "../../types/UserInterface";
import axiosJWT from "../../Utils/AxiosService";
import { ADMIN_API } from "../../Constants/Index";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface UserDataProps extends UserInterface {
  serialNo: number;
}

const UserData: React.FC<UserDataProps> = ({
  serialNo,
  _id,
  name,
  email,
  isBlocked,
}) => {
  const [isChecked, setIsChecked] = useState<boolean>(isBlocked);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);

  const handleCheckboxChange = () => {
    setShowConfirmModal(true);
  };

  interface BlockUserResponse {
    success: boolean;
  }
  
  const handleConfirm = () => {
    axiosJWT.patch<BlockUserResponse>(ADMIN_API + `/block_user/${_id}`)
      .then(response => {
        if (response.data && response.data.success) {
          setIsChecked(!isChecked);
          const message = !isChecked
            ? "User blocked successfully"
            : "User unblocked successfully";
          toast.success(message, { position: "top-center", autoClose: 3000 });
        } else {
          toast.error("Something went wrong, please try again.", { position: "top-center", autoClose: 3000 });
        }
      })
      .catch((err) => {
        console.error("An error occurred:", err);
        toast.error("An error occurred, please try again.", { position: "top-center", autoClose: 3000 });
      })
      .then(() => {
        setShowConfirmModal(false);
      }); 
  };
  

  return (
    <>
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-xl font-semibold mb-4">
              Confirm {isChecked ? "Unblocking" : "Blocking"}
            </h2>
            <p className="mb-4">
              Are you sure you want to {isChecked ? "unblock" : "block"} this User?
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="mr-2 px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 bg-purple-500 text-white rounded"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
      <tr className="bg-white border-b dark:bg-white dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
        <td className="px-6 py-4 text-left font-medium text-gray-900 whitespace-nowrap truncate" style={{ maxWidth: '50px' }}>
          {serialNo}
        </td>
        <td className="px-6 py-4 text-left truncate">{name}</td>
        <td className="px-6 py-4 text-left truncate">{email}</td>
        <td className="px-6 py-4 text-left">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isChecked ? "bg-red-600" : "bg-green-700"}`}></div>
            <p>{isChecked ? "Blocked" : "Active"}</p>
          </div>
        </td>
        <td className="px-6 py-4 text-left">
          <label className="flex cursor-pointer select-none items-center">
            <div className="relative">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={handleCheckboxChange}
                className="sr-only"
              />
              <div className={`block h-6 w-10 rounded-full ${isChecked ? "bg-red-500" : "bg-green-500"}`}></div>
              <div
                className={`absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition transform ${
                  isChecked ? "translate-x-full" : ""
                }`}
              ></div>
            </div>
          </label>
        </td>
      </tr>
    </>
  );
};

export default UserData;
