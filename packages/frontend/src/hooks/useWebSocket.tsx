import { useState, useEffect } from 'react';
import io, { Socket } from 'socket.io-client';
import { SimulationState } from '../types';

const SOCKET_SERVER_HOST = process.env.REACT_APP_SOCKET_HOST || 'localhost:3000';

const useWebSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [state, setState] = useState<SimulationState>({
    pumps: [],
    queue: [],
    vehiclesServed: 0,
    averageWaitTime: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const socket_url = process.env.PROD_BUILD === "true" ? `${protocol}://${SOCKET_SERVER_HOST}` : ``;
    const newSocket = io(socket_url, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
    });
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to WebSocket');
    });

    newSocket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
    });

    newSocket.on('stateUpdate', (newState: SimulationState) => {
      console.log('Received state update:', newState);
      setState(newState);
    });

    return () => {
      newSocket.close();
    };
  }, []);


  const sendCommand = (command: string) => {
    if (socket) {
      socket.emit('command', command);
    }
  };

  const selectGasoline = (pumpId: number, gasolineType: string) => {
    if (socket) {
      socket.emit('selectGasoline', { pumpId, gasolineType });
    }
  };

  return { state, sendCommand, selectGasoline, socket };
};

export default useWebSocket;