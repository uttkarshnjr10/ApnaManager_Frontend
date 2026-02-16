// src/context/SocketContext.jsx
import { createContext, useEffect, useState, useContext, useRef } from 'react';
import io from 'socket.io-client';
import { useAuth } from '../hooks/useAuth';

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {
    // CONNECT: User logged in and no socket exists
    if (user && !socketRef.current) {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5003/api';
      const socketUrl = apiUrl.replace('/api', '');

      const newSocket = io(socketUrl, {
        withCredentials: true, 
        transports: ['websocket'], 
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      newSocket.on('connect', () => {
        console.log('🟢 Socket Connected:', newSocket.id);
      });

      newSocket.on('connect_error', (err) => {
        console.error('🔴 Socket Connection Error:', err.message);
      });

      newSocket.on('disconnect', (reason) => {
        console.log('🔴 Socket Disconnected:', reason);
      });

      socketRef.current = newSocket;
      setSocket(newSocket);
    }

    // DISCONNECT: User logged out
    if (!user && socketRef.current) {
      console.log('🔴 Disconnecting Socket (logout)...');
      socketRef.current.disconnect();
      socketRef.current = null;
      setSocket(null);
    }

    // CLEANUP: Component unmount
    return () => {
      if (!user && socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [user]); // FIXED: Only depend on 'user', not 'socket'

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};