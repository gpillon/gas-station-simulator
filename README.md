# Gas Station Simulation

This project is a real-time gas station simulation built with React and TypeScript for the frontend, and NestJS for the backend. It provides an interactive interface to manage and monitor a virtual gas station, including fuel pumps, vehicle queues, and fuel prices.

## Features

- Multiple fuel pumps with real-time status updates
- Vehicle queue management
- Dynamic fuel pricing
- Fuel capacity monitoring and refill functionality
- Responsive design for various screen sizes

## Demo

You can see a live demo of the project at [gas.the.magesgate.com](https://gas.the.magesgate.com)

## Technologies Used

### Frontend
- React
- TypeScript
- Tailwind CSS
- Socket.IO Client for real-time updates

### Backend
- NestJS
- TypeScript
- Socket.IO for real-time communication
- MongoDB for data persistence

## Project Structure

The project is organized into two main parts: frontend and backend.

### Frontend

Key components include:

- `GasStation`: The main component that orchestrates the entire simulation
- `Pump`: Represents individual fuel pumps
- `PumpPanel`: Provides detailed information and controls for each pump
- `Queue`: Manages the vehicle queue
- `FuelPrices`: Displays and allows editing of fuel prices

### Backend

The backend is built with [NestJS](https://nestjs.com/) and handles the core simulation logic, data persistence, and real-time updates. 

Key features of the backend include:
- RESTful [API](https://gas.the.magesgate.com/api) endpoints for managing the gas station state
- WebSocket integration for real-time updates
- Simulation logic for vehicle generation, fueling process, and queue management

## Getting Started

1. Clone the repository
2. Install Rush globally:
   ```
   npm install -g @microsoft/rush
   ```


3. Navigate to the root directory of the project
4. Install dependencies for both projects:
   ```
   rush update
   ```
5. Start the frontend and the backend development server:
   ```
   rush start-dev
   ```

For more information on using Rush, refer to the [official Rush documentation](https://rushjs.io/pages/intro/get_started/).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request to either the frontend or backend repository.


## License

This project is licensed under the Apache GNU License.