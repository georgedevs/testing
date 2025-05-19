'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useSocketUpdates } from '@/app/hooks/useSocketUpdates';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_SERVER_URI || 'http://localhost:5000';

// Create context with a default value
const SocketContext = createContext<Socket | null>(null);

export const useSocket = () => {
  const context = useContext(SocketContext);
  // Return null instead of throwing if outside provider
  return context;
};

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      return;
    }

    const socketInstance = io(SOCKET_URL, {
      transports: ['websocket'],
      withCredentials: true,
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketInstance.on('connect', () => {
      // console.log('Socket connected:', socketInstance.id);
      // Authenticate socket connection
      socketInstance.emit('authenticate', {
        userId: user._id,
        role: user.role
      });
    });

    socketInstance.on('connect_error', (error) => {
      // console.error('Socket connection error:', error);
    });

    socketInstance.on('disconnect', (reason) => {
      // console.log('Socket disconnected:', reason);
    });

    setSocket(socketInstance);

    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
      }
    };
  }, [isAuthenticated, user]);

  // Use the socket updates hook
  useSocketUpdates(socket);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};