
const SOCKET_SERVER_HOST: string = process.env.REACT_APP_SOCKET_HOST || 'localhost:3000';

interface BackendUrls {
    socket_url: string;
    api_url: string;
}

export const getBackendHost = (): BackendUrls => {
    const socket_protocol: string = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const socket_url: string = process.env.PROD_BUILD === "true" 
        ? `${socket_protocol}//${SOCKET_SERVER_HOST}` 
        : `${socket_protocol}//localhost:3000`;

    const api_url: string = process.env.PROD_BUILD === "true" 
        ? `${window.location.protocol}//${window.location.host}` 
        : `${window.location.protocol}//localhost:3000`;

    return {
        socket_url, 
        api_url
    };
};

