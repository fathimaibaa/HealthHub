import { useEffect } from "react";
import { ZIM } from "zego-zim-web";
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { useAppSelector } from "../redux/store/Store";
import { ReactNode } from "react";

export const ZegoCloud = ({ children }: { children: ReactNode }) => {
  const user = useAppSelector((state) => state.UserSlice);

  useEffect(() => {
    if (user.id && user.name) {
      const userID = user.id;
      const userName = user.name;
      const appID = 2032275435;
      const serverSecret = '77364187d39f3d32201e089b3ba0a5d0';

      const TOKEN = ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret, "", userID, userName);

      const zp = ZegoUIKitPrebuilt.create(TOKEN);
      zp.addPlugins({ ZIM });
    } else {
      console.error("User ID or name is not defined");
    }
  }, [user]);

  return children;
};

export default ZegoCloud;
