import { useEffect, useState } from "react";
import axiosJWT from "../utils/AxiosService";
import { DoctorInterface } from "../types/DoctorInterface";
import { ADMIN_API } from "../constants/Index";

const useDoctors = () => {
  const [doctors, setDoctors] = useState<DoctorInterface[]>([]);

  useEffect(() => {
    axiosJWT
      .get(ADMIN_API + "/doctors")
      .then(({ data }) => {
        setDoctors(data.doctors)
      })
      .catch((error: any) => console.log(error));
  }, [setDoctors]);

  return { doctors, setDoctors };
};

export default useDoctors;