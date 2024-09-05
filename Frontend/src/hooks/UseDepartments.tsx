import { useEffect, useState } from "react";
import axiosJWT from "../utils/AxiosService";
import { ADMIN_API } from "../cccc/Index";

interface Department {
  _id: string; 
  createdAt: string; 
  id: string; 
  name: string; 
}

interface DepartmentsResponse {
  departments: Department[];
}

const useDepartments = () => {
  const [departments, setDepartments] = useState<Department[]>([]);

  useEffect(() => {
    axiosJWT
      .get<DepartmentsResponse>(ADMIN_API + "/department")
      .then(({ data }) => {
        setDepartments(data.departments);
      })
      .catch((error: any) => console.log(error));
  }, []);

  return { departments, setDepartments };
};

export default useDepartments;