import React from "react";
import { BookingInterface } from "../../types/BookingInterface";
import "react-toastify/dist/ReactToastify.css";
import useDoctors from '../../hooks/UseDoctors';


interface BookingDataProps extends BookingInterface {
  serialNo: number;
}

const ReportData: React.FC<BookingDataProps> = ({
  serialNo,
  patientName,
  doctorId,
  date,
  timeSlot,
}) => {
  const {doctors} = useDoctors();
  console.log(doctors,"nn")
  const doctor = doctors.find(doc => doc._id === doctorId);
  const doctorName = doctor ? doctor.doctorName : "Unknown Doctor";
  return (
    <>
      <tr className="bg-white border-b dark:bg-white dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
        <td className="px-6 py-4 text-left font-medium text-gray-900 whitespace-nowrap truncate" style={{ maxWidth: '50px' }}>
          {serialNo}
        </td>
        <td className="px-6 py-4 text-left truncate">{patientName}</td>
        <td className="px-6 py-4 text-left truncate">{doctorName}</td>
        <td className="px-6 py-4 text-left truncate">{date}</td>
        <td className="px-6 py-4 text-left truncate">{timeSlot}</td>
      </tr>
    </>
  );
};

export default ReportData;
