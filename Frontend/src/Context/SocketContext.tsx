import { ReactNode, useContext, createContext } from "react";
import { io, Socket } from "socket.io-client";
import { SERVER_URL } from "../Constants/Index";

const SocketContext = createContext<Socket | null>(null);
SocketContext.displayName = "Socket Context";

export const useSocket = () => useContext(SocketContext);

const SocketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const socket = io(SERVER_URL);
  console.log('sockert in user');
  
  socket.on("connect", () => console.log("connected"));
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export default SocketProvider;