import React, { useState, useRef, useEffect } from 'react';
import { SimulationState } from '../types';
import StatisticsPanel from './StatisticsPanel';
import { useSpring, animated, config } from 'react-spring';

interface Props {
  state: SimulationState;
}

const AnimatedValue: React.FC<{ 
  value: number; 
  format: (n: number) => string; 
  invertColor?: boolean;
  alwaysRedIfNegative?: boolean;
}> = ({ value, format, invertColor = false, alwaysRedIfNegative = false }) => {
  const prevValue = useRef(value);
  const [hasChanged, setHasChanged] = useState(false);
  const [isIncreasing, setIsIncreasing] = useState(false);

  useEffect(() => {
    if (value !== prevValue.current) {
      setHasChanged(true);
      setIsIncreasing(value > prevValue.current);
      const timer = setTimeout(() => setHasChanged(false), 300);
      return () => clearTimeout(timer);
    }
  }, [value]);

  const props = useSpring({ 
    val: value, 
    from: { val: prevValue.current },
    config: { duration: 300 }
  });

  const getColor = () => {
    if (alwaysRedIfNegative && value < 0) return '#ef4444'; // Always red if negative
    if (!hasChanged) return '#2563eb'; // Default blue
    const increasing = invertColor ? !isIncreasing : isIncreasing;
    return increasing ? '#22c55e' : '#ef4444'; // Green if increasing, red if decreasing
  };

  const colorProps = useSpring({
    color: getColor(),
    transform: hasChanged ? 'scale(1.1)' : 'scale(1)',
    config: config.wobbly
  });
  
  useEffect(() => {
    prevValue.current = value;
  }, [value]);

  return (
    <animated.span style={colorProps}>
      {props.val.to(val => format(val))}
    </animated.span>
  );
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
            <p className="text-2xl font-bold">
              <AnimatedValue value={state.vehiclesServed} format={n => Math.floor(n).toString()} />
            </p>
          </div>
          <div className="stat-item">
            <p className="text-sm text-gray-600">Average Wait Time</p>
            <p className="text-2xl font-bold">
              <AnimatedValue 
                value={state.averageWaitTime} 
                format={n => n.toFixed(2) + " m"} 
                invertColor={true}
              /> 
            </p>
          </div>
          <div className="stat-item">
            <p className="text-sm text-gray-600">Total Revenue</p>
            <p className="text-2xl font-bold">
              <AnimatedValue 
                value={state.totalRevenue} 
                format={n => n.toFixed(2) + "€"} 
                alwaysRedIfNegative={true}
              />
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