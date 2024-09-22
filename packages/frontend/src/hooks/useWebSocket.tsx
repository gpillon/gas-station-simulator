import { useState, useEffect, useCallback, useRef } from 'react';
import io, { Socket } from 'socket.io-client';
import { SimulationState } from '../types';
import refuelingCompleteSound from '../assets/sounds/refueling-complete.mp3';
import { getBackendHost } from '../utils/getBackendUrls';

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
    fuelCapacity: {
      regular: 0,
      midgrade: 0,
      premium: 0,
      diesel: 0,
    },
    refillingFuels: {
      regular: 0,
      midgrade: 0,
      premium: 0,
      diesel: 0,
    },
    fuelPrices: {
      regular: 0,
      midgrade: 0,
      premium: 0,
      diesel: 0,
    },
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio(refuelingCompleteSound);
    audioRef.current.volume = 0.2;
  }, []);


  useEffect(() => {
    const newSocket = io(getBackendHost().socket_url, {
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

    newSocket.on('stateUpdate', (newState: Partial<SimulationState>) => {

      setState(prevState => {
        const deepMerge = <T extends Record<string, any>>(target: T, source: Partial<T>): T => {
          const result = { ...target };
          for (const key in source) {
            if (source.hasOwnProperty(key)) {
              const targetValue = target[key];
              const sourceValue = source[key];
              if (typeof sourceValue === 'object' && sourceValue !== null && !Array.isArray(sourceValue)) {
                result[key] = deepMerge(
                  targetValue as  T[Extract<keyof T, string>],
                  sourceValue as  T[Extract<keyof T, string>]
                );
              } else if (sourceValue !== undefined) {
                result[key] = sourceValue as T[Extract<keyof T, string>];
              }
            }
          }
          return result;
        };

        return deepMerge(prevState, newState);
      });
    });

    newSocket.on('refuelingComplete', ({income}: {income: number}) => {
      // console.log('Received state update:', newState);
      if (audioRef.current && income > 0) {
        audioRef.current.play().catch(error => console.error('Error playing sound:', error));
      }
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

  const refillFuel = useCallback((amount: number, gasolineType: string) => {
    if (socket) {
      console.log(`Sending refill command: ${amount} ${gasolineType}`);
      socket.emit('refillFuel', { amount, gasolineType });
    }
  }, [socket]);

  return { state, sendCommand, selectGasoline, socket, refillFuel };
};

export default useWebSocket;