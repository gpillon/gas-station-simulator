import React, { useState, useRef } from 'react';
import { SimulationState } from '../types';
import StatisticsPanel from './StatisticsPanel';
import { useSpring, animated } from 'react-spring';

interface Props {
  state: SimulationState;
}

const AnimatedValue: React.FC<{ value: number; format: (n: number) => string }> = ({ value, format }) => {
  const prevValue = useRef(value);
  const props = useSpring({ 
    val: value, 
    from: { val: prevValue.current },
    config: { duration: 300 }  // Use duration for a linear animation
  });
  
  React.useEffect(() => {
    prevValue.current = value;
  }, [value]);

  return <animated.span>{props.val.to(val => format(val))}</animated.span>;
};

const Statistics: React.FC<Props> = ({ state }) => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  return (
    <>
      <div className="statistics mt-8 bg-white shadow-md rounded-lg p-4">
        <h2 
          className="text-2xl font-semibold text-blue-600 mb-4 cursor-pointer hover:text-blue-800 transition-colors duration-300"
          onClick={() => setIsPanelOpen(true)}
        >
          Statistics
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="stat-item">
            <p className="text-sm text-gray-600">Vehicles Served</p>
            <p className="text-2xl font-bold text-blue-600">
              <AnimatedValue value={state.vehiclesServed} format={n => Math.floor(n).toString()} />
            </p>
          </div>
          <div className="stat-item">
            <p className="text-sm text-gray-600">Average Wait Time</p>
            <p className="text-2xl font-bold text-blue-600">
              <AnimatedValue value={state.averageWaitTime} format={n => n.toFixed(2)} /> min
            </p>
          </div>
          <div className="stat-item">
            <p className="text-sm text-gray-600">Total Revenue</p>
            <p className="text-2xl font-bold text-blue-600">
              <AnimatedValue value={state.totalRevenue} format={n => n.toFixed(2)} />€
            </p>
          </div>
        </div>
      </div>
      {isPanelOpen && (
        <StatisticsPanel 
          state={state} 
          onClose={() => setIsPanelOpen(false)} 
        />
      )}
    </>
  );
};

export default Statistics;