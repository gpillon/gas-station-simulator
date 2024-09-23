import React, { useState, useEffect } from 'react';
import { SimulationSettings, Pump } from '../types';
import { getBackendHost } from '../utils/getBackendUrls';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialSettings: SimulationSettings;
}

const SimulationSettingsModal: React.FC<Props> = ({ isOpen, onClose, initialSettings }) => {
  const [settings, setSettings] = useState<SimulationSettings>(initialSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [pumps, setPumps] = useState<Pump[]>([]);

  useEffect(() => {
    fetchPumps();
  }, []);

  const fetchPumps = async () => {
    const api_url = getBackendHost().api_url;
    try {
      const response = await fetch(`${api_url}/api/gas-station/pumps`);
      if (!response.ok) {
        throw new Error('Failed to fetch pumps');
      }
      const data = await response.json();
      setPumps(data);
    } catch (error) {
      console.error('Failed to fetch pumps', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setSettings(prevSettings => ({
      ...prevSettings,
      [name]: checked,
    }));
  };

  const handleNumericChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings(prevSettings => ({
      ...prevSettings,
      [name]: Number(value),
    }));
  };

  const handleSave = async () => {
    const api_url = getBackendHost().api_url;
    setIsSaving(true);
    try {
      const response = await fetch(`${api_url}/api/gas-station-simulation/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });
      if (!response.ok) {
        throw new Error('Failed to save settings');
      }
      onClose();
    } catch (error) {
      console.error('Failed to save settings', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddPump = async () => {
    const api_url = getBackendHost().api_url;
    try {
      const response = await fetch(`${api_url}/api/gas-station/pumps`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });
      if (!response.ok) {
        throw new Error('Failed to add pump');
      }
      fetchPumps();
    } catch (error) {
      console.error('Failed to add pump', error);
    }
  };

  const handleDeleteLatestPump = async () => {
    if (pumps.length === 0) return;
    
    const latestPump = pumps[pumps.length - 1];
    const api_url = getBackendHost().api_url;
    try {
      const response = await fetch(`${api_url}/api/gas-station/pumps/${latestPump.id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete pump');
      }
      fetchPumps();
    } catch (error) {
      console.error('Failed to delete pump', error);
    }
  };

  const booleanSettings: (keyof SimulationSettings)[] = ['vehiclesAutoRefill', 'tanksAutoRefill', 'autoAdjustPrices'];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-4xl">
        <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-gray-200">
          <h2 className="text-3xl font-bold text-gray-800">Simulation Settings</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4 text-gray-700">General Settings</h3>
            <div className="space-y-4">
              {booleanSettings.map((setting) => (
                <label key={setting} className="flex items-center space-x-3 text-gray-700">
                  <input
                    type="checkbox"
                    name={setting}
                    checked={!!settings[setting]}
                    onChange={handleChange}
                    className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-400"
                  />
                  <span className="text-sm font-medium">{setting.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}</span>
                </label>
              ))}
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Chance Per Second of Vehicle Start Refill
                </label>
                <input
                  type="number"
                  name="chanchePerSecondOfVehicleStartRefill"
                  value={settings.chanchePerSecondOfVehicleStartRefill}
                  onChange={handleNumericChange}
                  min={0}
                  max={1}
                  step={0.01}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Queue Size
                </label>
                <input
                  type="number"
                  name="queueSize"
                  value={settings.queueSize}
                  onChange={handleNumericChange}
                  min={0}
                  max={50}
                  step={1}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Vehicles Per Second
                </label>
                <input
                  type="number"
                  name="vehiclesPerSecond"
                  value={settings.vehiclesPerSecond}
                  onChange={handleNumericChange}
                  min={0}
                  max={2}
                  step={0.01}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4 text-gray-700">Pumps Management</h3>
            <div className="bg-gray-100 p-4 rounded-lg">
              <p className="text-lg font-medium text-gray-700 mb-2">Total Pumps: {pumps.length}</p>
              <div className="flex space-x-2">
                <button
                  onClick={handleAddPump}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition-colors flex-1"
                >
                  Add Pump
                </button>
                <button
                  onClick={handleDeleteLatestPump}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition-colors flex-1"
                  disabled={pumps.length === 0}
                >
                  Delete Pump
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-8 pt-4 border-t-2 border-gray-200">
          <button
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors"
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SimulationSettingsModal;