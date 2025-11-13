import React, { useState } from 'react';
import { User, Donation } from '../types';
import Spinner from './Spinner';

interface DonationViewProps {
  upiId: string;
  onAddDonation: (donation: Omit<Donation, 'id' | 'created_at'>) => Promise<void>;
  currentUser: User | null;
}

const DonationView: React.FC<DonationViewProps> = ({ upiId, onAddDonation, currentUser }) => {
    const [amount, setAmount] = useState<number | ''>('');
    const [name, setName] = useState(currentUser?.name || '');
    const [transactionId, setTransactionId] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (typeof amount === 'number' && amount > 0 && name && transactionId) {
            setIsLoading(true);
            await onAddDonation({ 
                donor_name: name,
                amount,
                transaction_id: transactionId,
                user_id: currentUser?.id || null,
            });
            setIsLoading(false);
            setAmount('');
            setTransactionId('');
        } else {
            alert('Please fill in all fields to confirm your donation.');
        }
    };
    
    const upiLink = `upi://pay?pa=${upiId}&pn=Shraddha%20Yatra%20Trust&cu=INR`;

    return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-extrabold text-amber-900">Support Our Cause</h2>
        <p className="mt-2 text-lg text-orange-800">Your contribution helps us continue our mission of guiding spiritual journeys.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-xl text-center">
            <h3 className="text-2xl font-bold text-orange-800 mb-4">Step 1: Make a Donation</h3>
            <p className="text-gray-600 mb-4">Scan the QR code with any UPI app or use the UPI ID below.</p>
            <div className="flex justify-center mb-4">
                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiLink)}`} alt="UPI QR Code" className="border-4 border-amber-400 p-1 rounded-lg" />
            </div>
            <p className="text-gray-700 font-medium">Our UPI ID:</p>
            <div className="bg-amber-100 text-amber-900 font-bold p-2 rounded-md mb-4 break-words">
                {upiId}
            </div>
            <a 
              href={upiLink} 
              className="w-full inline-block md:hidden bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Pay with UPI App
            </a>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-xl">
          <h3 className="text-2xl font-bold text-orange-800 mb-4">Step 2: Confirm Your Donation</h3>
          <p className="text-gray-600 mb-4">After payment, please enter the transaction details below to help us track your contribution.</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" 
                required 
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Donation Amount (₹)</label>
              <input 
                type="number" 
                value={amount}
                onChange={(e) => setAmount(e.target.value === '' ? '' : parseFloat(e.target.value))}
                min="1"
                placeholder="Enter the amount you donated"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" 
                required 
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Transaction ID / Reference No.</label>
              <input 
                type="text" 
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                placeholder="Enter the ID from your payment app"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" 
                required 
                disabled={isLoading}
              />
            </div>
            <button type="submit" className="w-full px-6 py-3 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center disabled:bg-orange-300" disabled={isLoading}>
              {isLoading ? <Spinner /> : 'Submit Donation'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DonationView;