import { useEffect, useState } from "react";
import axiosJWT from "../utils/AxiosService";
import { DoctorInterface } from "../Types/DoctorInterface";
import { ADMIN_API } from "../Constants/Index";

interface DoctorsResponse {
  doctors: DoctorInterface[];
}

const useDoctors = () => {
  const [doctors, setDoctors] = useState<DoctorInterface[]>([]);

  useEffect(() => {
    axiosJWT
      .get<DoctorsResponse>(ADMIN_API + "/doctors")
      .then(({ data }) => {
        setDoctors(data.doctors);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [setDoctors]);

  return { doctors, setDoctors };
};

export default useDoctors;