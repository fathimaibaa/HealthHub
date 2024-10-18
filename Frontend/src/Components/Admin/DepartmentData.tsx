import React, { useState } from "react";
import { DepartmentInterface } from "../../Types/DepartmentInterface";
import axiosJWT from "../../Utils/AxiosService";
import { ADMIN_API } from "../../Constants/Index";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

interface ApiResponse {
  success: boolean;
  message?: string;
}

interface DepartmentDataProps extends DepartmentInterface {
  serialNo: number;
}

const DepartmentData: React.FC<DepartmentDataProps> = ({
  serialNo,
  _id,
  departmentName,
  isListed,
}) => {
  const [isChecked, setIsChecked] = useState<boolean>(isListed);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [actionType, setActionType] = useState<string>("");

  const handleCheckboxChange = () => {
    setActionType(isChecked ? "block" : "unblock");
    setShowConfirmModal(true);
  };

  const handleConfirm = () => {
    const apiEndpoint = isChecked
      ? `${ADMIN_API}/block_department/${_id}`
      : `${ADMIN_API}/unblock_department/${_id}`;
  
    axiosJWT.patch<ApiResponse>(apiEndpoint)
      .then((response) => {
        if (response.data.success) {
          setIsChecked(!isChecked);
          const message = isChecked
            ? "Department blocked successfully"
            : "Department unblocked successfully";
          toast.success(message, { position: "top-center", autoClose: 3000 });
        } else {
          toast.error("Something went wrong, please try again.", { position: "top-center", autoClose: 3000 });
        }
      })
      .catch(() => {
        console.error("An error occurred, please try again.");
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
              Confirm {actionType === "block" ? "Blocking" : "Unblocking"}
            </h2>
            <p className="mb-4">
              Are you sure you want to {actionType} the department?
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

      <tr className="bg-white border-b dark:bg-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
        <td className="px-6 py-4 text-left font-medium text-gray-900 whitespace-nowrap dark:text-black truncate" style={{ maxWidth: '50px' }}>
          {serialNo}
        </td>
        <td className="px-6 py-4 text-left truncate">{departmentName}</td>
        <td className="px-6 py-4 text-left">
          <div className="flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full ${
                isChecked ? "bg-purple-700" : "bg-red-600"
              }`}
            ></div>
            <p>{isChecked ? "Active" : "Blocked"}</p>
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
              <div
                className={`box block h-6 w-10 rounded-full ${
                  isChecked ? "bg-purple-400" : "bg-red-500"
                }`}
              ></div>
              <div
                className={`absolute left-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-white transition ${
                  isChecked ? "translate-x-full" : ""
                }`}
              ></div>
            </div>
          </label>
        </td>
        <td className="px-6 py-4 text-left">
          <Link to={`/admin/department/${_id}`}>
            <FontAwesomeIcon icon={faEdit} className="text-fuchsia-500 hover:text-fuchsia-700 cursor-pointer" />
          </Link>
        </td>
      </tr>
    </>
  );
};

export default DepartmentData;
