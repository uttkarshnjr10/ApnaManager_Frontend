import { createContext, useEffect, useState, useContext } from 'react';
import io from 'socket.io-client';
import { useAuth } from '../hooks/useAuth';

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // 1. Connect if user is logged in
    if (user && !socket) {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5003/api';
      const socketUrl = apiUrl.replace('/api', '');

      // 2. SIMPLIFIED CONNECTION
      // We do NOT manually send the token. 
      // 'withCredentials: true' will automatically send the HttpOnly cookie.
      const newSocket = io(socketUrl, {
        withCredentials: true, 
        transports: ['websocket'], 
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      newSocket.on('connect', () => {
       // console.log('🟢 Socket Connected:', newSocket.id);
      });

      newSocket.on('connect_error', (err) => {
       // console.error('🔴 Socket Connection Error:', err.message);
      });

      setSocket(newSocket);
    }

    // 3. Disconnect on Logout
    if (!user && socket) {
    //  console.log('🔴 Disconnecting Socket...');
      socket.disconnect();
      setSocket(null);
    }

    return () => {
      if (!user && socket) {
        socket.disconnect();
      }
    };
  }, [user, socket]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};