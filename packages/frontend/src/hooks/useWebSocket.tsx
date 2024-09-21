import { useState, useEffect, useCallback } from 'react';
import io, { Socket } from 'socket.io-client';
import { SimulationState } from '../types';

const SOCKET_SERVER_HOST = process.env.REACT_APP_SOCKET_HOST || 'localhost:3000';

const useWebSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [state, setState] = useState<SimulationState>({
    pumps: [],
    queue: [],
    vehiclesServed: 0,
    carsServed: 0,
    trucksServed: 0,
    averageWaitTime: 0,
    totalRevenue: 0,
    isSimulationRunning: false,
    fuelDispensed: {
      regular: 0,
      midgrade: 0,
      premium: 0,
      diesel: 0,
    },
  });

  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const socket_url = process.env.PROD_BUILD === "true" ? `${protocol}://${SOCKET_SERVER_HOST}` : `${protocol}://localhost:3000`;
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
      // console.log('Received state update:', newState);
      setState(prevState => ({
        ...prevState,
        ...newState,
        isSimulationRunning: newState.isSimulationRunning
      }));
    });

    return () => {
      newSocket.close();
    };
  }, []);

  const sendCommand = useCallback((command: string) => {
    if (socket) {
      console.log(`Sending command: ${command}`);
      socket.emit('command', command);
      if (command === 'START') {
        setState(prevState => ({ ...prevState, isSimulationRunning: true }));
      } else if (command === 'STOP' || command === 'RESET') {
        setState(prevState => ({ ...prevState, isSimulationRunning: false }));
      }
    }
  }, [socket]);

  const selectGasoline = useCallback((pumpId: number, gasolineType: string) => {
    if (socket) {
      socket.emit('selectGasoline', { pumpId, gasolineType });
    }
  }, [socket]);

  return { state, sendCommand, selectGasoline, socket };
};

export default useWebSocket;