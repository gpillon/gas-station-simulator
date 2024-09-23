import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBackendHost } from '../utils/getBackendUrls';

const PaymentPage: React.FC = () => {
  const { pumpId, paymentId } = useParams<{ pumpId: string; paymentId: string }>();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [message, setMessage] = useState('');
  const hasProcessedPayment = useRef(false);

  useEffect(() => {
    const processPayment = async () => {
      if (hasProcessedPayment.current) return;
      hasProcessedPayment.current = true;

      const api_url = getBackendHost().api_url;
      try {
        const response = await fetch(`${api_url}/api/gas-station/process-payment`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ pumpId, paymentId }),
        });

        if (!response.ok) {
          throw new Error('Payment processing failed');
        }

        setStatus('success');
        setMessage('Payment successful! This page will close in 3 seconds.');
        setTimeout(() => {
          window.close();
        }, 3000);
      } catch (error) {
        console.error('Error processing payment:', error);
        setStatus('error');
        setMessage('Payment failed. Please try again or contact support.');
      }
    };

    processPayment();
  }, [pumpId, paymentId]);
  
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full">
        <h1 className="text-3xl font-bold mb-4">Payment Processing</h1>
        {status === 'processing' && (
          <>
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Please wait while we process your payment...</p>
          </>
        )}
        {status === 'success' && (
          <>
            <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-green-600 font-semibold">{message}</p>
            <button
              onClick={() => navigate('/')}
              className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors duration-300"
            >
              Return to Gas Station
            </button>
          </>
        )}
        {status === 'error' && (
          <>
            <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <p className="text-red-600 font-semibold">{message}</p>
            <button
              onClick={() => navigate('/')}
              className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors duration-300"
            >
              Return to Gas Station
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentPage;