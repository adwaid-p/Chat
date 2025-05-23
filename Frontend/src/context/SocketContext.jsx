import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const userId = JSON.parse(localStorage.getItem('user_id'));

  useEffect(() => {
    const newSocket = io('https://chatapp-backend-sd9j.onrender.com', {
      // reconnection: true,
      // reconnectionAttempts: 5,
      // reconnectionDelay: 1000,
      // withCredentials: true,
      // transports: ['websocket', 'polling']
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      transports: ['websocket', 'polling'],
      secure: true,
      rejectUnauthorized: false,

      timeout: 60000,
      auth: {
        userId: userId
      }
    });

    // Initialize socket connection
    newSocket.on('connect', () => {
    //   console.log('Socket connected:', newSocket.id);
      if (userId) {
        newSocket.emit('join', userId);
      }
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    newSocket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    setSocket(newSocket);

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, [userId]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const socket = useContext(SocketContext);
  if (!socket) {
    console.warn('useSocket must be used within a SocketProvider');
  }
  return socket;
};