import { Vehicle } from "../types";

export const getAvailableFuelTypes = (vehicle: Vehicle | null) => {
  if (!vehicle) return [];
  
  if (vehicle.fuelType === 'Gas') {
    return ['Regular', 'MidGrade', 'Premium'];
    // return ['Regular', 'MidGrade', 'Premium', 'Diesel'];
  } else if (vehicle.fuelType === 'Diesel') {
    return ['Diesel'];
  }
  
  return [];
};