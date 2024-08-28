import { useEffect, useState } from "react";
import axiosJWT from "../utils/AxiosService";
import { UserInterface } from "../types/UserInterface";
import { ADMIN_API } from "../constants/Index";
import axios from "axios";

const useUsers = () => {
  const [users, setUsers] = useState<UserInterface[]>([]);

  useEffect(() => {
    axiosJWT
      .get(ADMIN_API + "/users")
      .then(({ data }) => {
        setUsers(data.users)
      })
      .catch((error: any) => console.log(error));
  }, [setUsers]);

  return { users, setUsers };
};

export default useUsers;