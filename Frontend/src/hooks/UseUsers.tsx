import { useEffect, useState } from "react";
import axiosJWT from "../utils/AxiosService";
import { UserInterface } from "../types/UserInterface";
import { ADMIN_API } from "../constants/Index";

interface UsersResponse {
  users: UserInterface[];
}

const useUsers = () => {
  const [users, setUsers] = useState<UserInterface[]>([]);

  useEffect(() => {
    axiosJWT
      .get<UsersResponse>(ADMIN_API + "/users")
      .then(({ data }) => {
        setUsers(data.users);
      })
      .catch((error: any) => console.log(error));
  }, []);

  return { users, setUsers };
};

export default useUsers;