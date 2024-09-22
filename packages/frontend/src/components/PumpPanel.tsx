import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Socket } from 'socket.io-client';
import thanksImage from '../assets/images/thanks.png';
import { SimulationState } from '../types';
import { AnimatedValue } from './StatisticsPanel';

interface RefuelingCompletePayload {
  pumpId: number;
  income: number;
}

interface PumpPanelProps {
  pumpId: number;
  socket: Socket | null;
  onClose: () => void;
  gasolineTypes: { name: string; icon: string }[];
  initialStatus: string;
  selectedGasoline: string | null;
}

const PumpPanel: React.FC<PumpPanelProps> = ({
  pumpId,
  socket,
  onClose,
  gasolineTypes,
  initialStatus,
  selectedGasoline
}) => {
  const [state, setState] = useState({
    paymentMethod: null as string | null,
    isProcessingPayment: false,
    fuelType: selectedGasoline,
    isRefueling: initialStatus === 'fueling',
    isRefuelingComplete: false,
    transactionStatus: initialStatus === 'fueling' ? 'Refueling in progress...' : null as string | null,
    subtext: null as string | null,
    fuelDispensed: 0,
    currentExpense: 0,
  });

  const paymentMethods = ['Cash', 'Credit Card', 'Debit Card'];

  useEffect(() => {
    if (socket) {
      socket.on('refuelingComplete', (refuelingComplete: RefuelingCompletePayload) => {
        if (refuelingComplete.pumpId === pumpId) {
          setState(prevState => ({
            ...prevState,
            isRefueling: false,
            isRefuelingComplete: true,
            transactionStatus: `Refueling complete. Thank you!`,
            subtext : `Total Amount: ${refuelingComplete.income.toFixed(2)}€`,
          }));

          setTimeout(() => {
            onClose();
          }, 3000);
        }
      });

      socket.on('stateUpdate', (state: SimulationState) => {
        const pump = state.pumps.find(p => p.id === pumpId);
        if (pump && pump.selectedGasoline && pump.currentVehicle) {
          const currentFuelPrice = state.fuelPrices[pump.selectedGasoline.replace('-', '').toLowerCase() as keyof typeof state.fuelPrices];
          const fuelDispensed = pump.currentVehicle.currentFuel;

          setState(prevState => ({
            ...prevState,
            fuelDispensed: fuelDispensed,
            currentExpense: fuelDispensed * currentFuelPrice,
          }));
        } 
      });
    }
    return () => {
      if (socket) {
        socket.off('refuelingComplete');
        socket.off('refuelingUpdate');
      }
    };
  }, [socket, onClose, pumpId]);


  const handlePaymentSelect = (payment: string) => {
    setState(prevState => ({
      ...prevState,
      paymentMethod: payment,
      isProcessingPayment: true,
      transactionStatus: `Processing ${payment.toLowerCase()}...`,
    }));

    setTimeout(() => {
      setState(prevState => ({
        ...prevState,
        isProcessingPayment: false,
        transactionStatus: `${payment} accepted. Please select fuel type.`,
      }));
    }, 2000);
  };

  const handleFuelSelect = (fuelType: string) => {
    const fuel = fuelType.replace('-', '');
    setState(prevState => ({
      ...prevState,
      fuelType: fuel,
    }));
    startRefueling(fuel);
  };

  const startRefueling = (selectedFuelType: string) => {
    if (socket && state.paymentMethod) {
      socket.emit('startRefueling', { pumpId, fuelType: selectedFuelType, paymentMethod: state.paymentMethod });
      setState(prevState => ({
        ...prevState,
        isRefueling: true,
        transactionStatus: 'Refueling in progress...',
      }));
    }
  };

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
      <div className="bg-white p-4 md:p-8 rounded-lg shadow-xl w-full max-w-md md:max-w-4xl md:h-[32rem] flex flex-col">
        <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-gray-200">
          <h2 className="text-2xl font-bold">Pump {pumpId}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex-grow flex flex-col md:flex-row">
          <div className="md:w-1/2 md:pr-4 mb-4 md:mb-0 flex flex-col justify-center">
            {state.isRefuelingComplete ? (
              <div className="flex items-center justify-center">
                <img 
                  src={thanksImage} 
                  alt="Thank you" 
                  className="w-64 h-64 object-contain"
                />
              </div>
            ) : state.isRefueling ? (
              <div className="flex items-center justify-center">
                <img 
                  src={gasolineTypes.find(type => type.name === state.fuelType)?.icon} 
                  alt={state.fuelType || 'Refueling'} 
                  className="w-32 h-32 object-contain"
                />
              </div>
            ) : !state.paymentMethod ? (
              <div>
                <h3 className="text-xl mb-4 md:hidden">Select Payment Method:</h3>
                <div className="grid grid-cols-2 gap-4">
                  {paymentMethods.map((method) => (
                    <button
                      key={method}
                      onClick={() => handlePaymentSelect(method)}
                      className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-3 rounded text-sm transition-colors duration-300"
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>
            ) : !state.fuelType && !state.isProcessingPayment ? (
              <div className="h-full flex flex-col justify-between">
                <h4 className="text-lg mb-2 md:hidden">Select Fuel Type:</h4>
                <div className="grid grid-cols-2 gap-8 justify-items-center content-between h-full py-8">
                  {gasolineTypes.map((fuel) => (
                    <button
                      key={fuel.name}
                      onClick={() => handleFuelSelect(fuel.name)}
                      className="relative w-32 h-32 overflow-hidden rounded-lg hover:shadow-lg transition-shadow duration-300"
                    >
                      <img
                        src={fuel.icon}
                        alt={fuel.name}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin mx-auto"></div>
              </div>
            )}
          </div>
          <div className="md:w-1/2 md:pl-4 border-t-2 md:border-t-0 md:border-l-2 border-gray-200 pt-4 md:pt-0 md:pl-4 flex flex-col justify-center">
            <div className="text-center h-full flex flex-col justify-center">
              {state.isRefueling ? (
                <>
                  <h3 className="text-xl font-semibold mb-4">{state.transactionStatus}</h3>
                  <p className="text-lg mb-2">Fuel Dispensed: <AnimatedValue value={state.fuelDispensed} format={n => `${n.toFixed(2)} L`} /></p>
                  <p className="text-lg mb-2">Current Expense: <AnimatedValue value={state.currentExpense} format={n => `${n.toFixed(2)} €`} /></p>
                </>
              ) :  state.isRefuelingComplete ? (
                <>
                  <h3 className="text-xl font-semibold mb-4">{state.transactionStatus}</h3>
                  <p className="text-lg mb-2">Fuel Dispensed: <AnimatedValue value={state.fuelDispensed} format={n => `${n.toFixed(2)} L`} /></p>
                  <p className="text-lg mb-2">Current Expense: <AnimatedValue value={state.currentExpense} format={n => `${n.toFixed(2)} €`} /></p>
                </>
              ) : state.isProcessingPayment ? (
                <>
                  <h3 className="text-xl font-semibold mb-4">{state.transactionStatus}</h3>
                  <h4 className="text-lg mb-2 hidden md:block">{state.subtext}</h4>
                </>
              ): !state.paymentMethod ? (
                <h3 className="text-xl mb-4 hidden md:block">Select Payment Method</h3>
              ) : !state.fuelType ? (
                <>
                  <h3 className="text-xl font-semibold mb-4">{state.transactionStatus}</h3>
                  <h4 className="text-lg mb-2 hidden md:block">Select Fuel Type</h4>
                </>
              ) : (
                <>
                  <h3 className="text-xl font-semibold mb-4">{state.transactionStatus}</h3>
                  <h4 className="text-lg mb-2 hidden md:block">{state.subtext}</h4>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default PumpPanel;