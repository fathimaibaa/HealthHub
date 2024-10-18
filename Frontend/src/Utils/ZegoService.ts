import { useEffect } from "react";
import { ZIM } from "zego-zim-web";
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { useAppSelector } from "../Redux/Store/Store";
import { ReactNode } from "react";

export const ZegoCloud = ({ children }: { children: ReactNode }) => {
  const user = useAppSelector((state) => state.UserSlice);

  useEffect(() => {
    if (user.id && user.name) {
      const userID = user.id;
      const userName = user.name;
      const appID = 1444652730;
      const serverSecret = '6da2f62533cbfbc00a886eea383c39e9';

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
