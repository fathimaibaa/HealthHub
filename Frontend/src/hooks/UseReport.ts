import { useEffect, useState } from "react";
import axiosJWT from "../utils/AxiosService";
import { BookingInterface } from "../types/BookingInterface";
import { ADMIN_API } from "../constants/Index";


const useReports = () => {
  const [reports, setReports] = useState<BookingInterface[]>([]);

  useEffect(() => {
    axiosJWT
      .get(ADMIN_API + "/reports")
      .then(({ data }) => {
        console.log(data,'dataa hereeeeeeeeeeeeeeee')
        setReports(data.reports)
      })
      .catch((error: any) => console.log(error));
  }, [setReports]);

  return { reports, setReports };
};

export default useReports;