"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import localStorageService from "@/utils/localStorageService";

const ENDPOINT = process.env.NEXT_PUBLIC_WS_URL || "";
const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const userId = localStorageService.getUserId()
    const storeId = localStorageService.getStoreId()

    if (!userId) return;

    const newSocket = io(ENDPOINT, { transports: ["websocket"] });
    setSocket(newSocket);

    newSocket.emit("registerUser", userId);
    if (storeId) newSocket.emit("joinStoreRoom", storeId);

    console.log("Socket connected");

    newSocket.on("getAllNotifications", (allNotifications) => {
      setNotifications(allNotifications);
    });

    newSocket.on("getStoreNotifications", (newNotification) => {
      setNotifications((prev) => [...prev, newNotification]);
    });

    newSocket.on("newOrderNotification", (newNotification) => {
      setNotifications((prev) => [...prev, newNotification]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, notifications, setNotifications }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
