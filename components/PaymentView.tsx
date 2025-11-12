
import React, { useState } from 'react';
import { Trip, User } from '../types';
import Spinner from './Spinner';

interface PaymentViewProps {
  details: {
    type: 'booking' | 'donation';
    amount: number;
    trip?: Trip;
    donorName?: string;
  };
  user: User | null;
  onPaymentSuccess: () => void;
}

const PaymentView: React.FC<PaymentViewProps> = ({ details, user, onPaymentSuccess }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { type, amount, trip, donorName } = details;
  const isBooking = type === 'booking';

  const handlePayNow = () => {
    setIsProcessing(true);
    // Simulate payment processing delay
    setTimeout(() => {
      setIsProcessing(false);
      onPaymentSuccess();
    }, 2500);
  };

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-8">
      <div className="bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="p-6 md:p-8">
          <h2 className="text-3xl font-bold text-amber-900 mb-2">
            {isBooking ? 'Complete Your Booking' : 'Secure Donation'}
          </h2>
          <p className="text-gray-600 mb-6">
            Please confirm the details below to proceed.
          </p>

          {/* Order Summary */}
          <div className="bg-amber-50 p-4 rounded-lg mb-6 border border-amber-200">
            <h3 className="text-lg font-semibold text-orange-800 mb-3">Order Summary</h3>
            {isBooking && trip && (
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-700">{trip.title} (1 Person)</span>
                <span className="font-semibold text-gray-800">₹{trip.ticket_price}</span>
              </div>
            )}
             {isBooking && trip && trip.food_option && (
               <div className="flex justify-between items-center text-sm text-gray-600">
                <span>Convenience Fee</span>
                <span>₹15</span>
              </div>
            )}
            {!isBooking && (
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-700">Donation to ShraddhaYatra Trust</span>
                <span className="font-semibold text-gray-800">₹{amount}</span>
              </div>
            )}
            <hr className="my-2 border-dashed" />
            <div className="flex justify-between items-center font-bold text-xl text-orange-900">
              <span>Total Amount</span>
              <span>₹{isBooking ? amount + 15 : amount}</span>
            </div>
          </div>

          {/* Mock Payment Form */}
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input type="text" value={isBooking ? user?.name : donorName} readOnly className="mt-1 block w-full bg-gray-100 border-gray-300 rounded-md p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
                <input type="text" value={user?.phone || 'N/A'} readOnly className="mt-1 block w-full bg-gray-100 border-gray-300 rounded-md p-2" />
              </div>
            </div>
            <div className="mt-4">
               <label className="block text-sm font-medium text-gray-700">Card Number</label>
               <input type="text" placeholder="**** **** **** 1234" disabled className="mt-1 block w-full bg-gray-100 border-gray-300 rounded-md p-2" />
            </div>
            {isProcessing ? (
                <div className="w-full mt-6">
                    <Spinner />
                    <p className="text-center text-orange-600">Processing your payment securely...</p>
                </div>
            ) : (
                <button
                    onClick={handlePayNow}
                    className="w-full mt-6 bg-orange-600 text-white font-bold text-lg py-3 rounded-lg hover:bg-orange-700 transition-colors"
                    >
                    Pay Securely
                </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentView;
