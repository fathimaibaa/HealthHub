import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { TOKEN_API } from "../Constants/Index";
import { Payload } from "../ttt/PropsType";
import logout, { doctorlogout } from "./Logout";
import { getItemFromLocalStorage } from "./Setnget";

const axiosJWT = axios.create({});

const getNewAccessToken = async () => {
  try {
    let refresh_token = getItemFromLocalStorage("refresh_token") as string
    const { data } : any = await axios.post(TOKEN_API + "/refresh_token", {
      refresh_token,
    });
    return data?.access_token;
  } catch (err) {
    logout("Session expired ,please Login");
  }
};

const getAccessToken = async () => {
  try {
    let access_token = getItemFromLocalStorage("access_token") as string

     if (!access_token) {
        console.warn("Access token is missing, requesting new access token");
        const newAccessToken = await getNewAccessToken();
        if (!newAccessToken) throw new Error("Failed to obtain new access token");
        access_token = newAccessToken;
      }


    const { data } :any = await axios.get(TOKEN_API + `/accessToken?access_token=${access_token}`);
    
    let token = access_token;
    let user = data?.user || data?.doctor;
    

    const decodedToken: Payload = await jwtDecode(token);
    const { role } = decodedToken;
    if (role === "doctor" || role === "user") {
      if (user.isBlocked)
        logout("Your account has been blocked by administrator", "error");
      else if (user?.doctor?.isBlocked)
        doctorlogout("Your account has been blocked by administrator", "error");
    }  
    return token;
  } catch (error) {
  }
};

axiosJWT.interceptors.request.use(async (config:any) => {
    let currentDate = new Date();
    let decodedToken;
    let accessToken;
    try {
  
      accessToken = await getAccessToken() as string
     
      decodedToken = await jwtDecode(accessToken);
    } catch (error) {
    }
  
    if (decodedToken.exp * 1000 < currentDate.getTime()) {
      for(let i=0;i<100;i++){
      }
      accessToken = await getNewAccessToken();
      decodedToken = jwtDecode<Payload>(accessToken); 
    }
    config.headers["Authorization"] = "Bearer " + accessToken;
  
    return config;
  });

export default axiosJWT;
