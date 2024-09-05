import { useEffect, useState } from "react";
import axiosJWT from "../Utils/AxiosService";
import { UserInterface } from "../Types/UserInterface";
import { ADMIN_API } from "../Constants/Index";

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