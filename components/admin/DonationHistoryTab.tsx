import React from 'react';
import { Donation } from '../../types';

interface DonationHistoryTabProps {
    donations: Donation[];
}

const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};


const DonationHistoryTab: React.FC<DonationHistoryTabProps> = ({ donations }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold text-orange-700 mb-4">Donation History</h3>
            {donations.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-amber-100">
                            <tr>
                                <th className="p-3 font-semibold text-orange-900">Date</th>
                                <th className="p-3 font-semibold text-orange-900">Donor Name</th>
                                <th className="p-3 font-semibold text-orange-900">Amount</th>
                                <th className="p-3 font-semibold text-orange-900">Transaction ID</th>
                            </tr>
                        </thead>
                        <tbody>
                            {donations.map(donation => (
                                <tr key={donation.id} className="border-b border-gray-200">
                                    <td className="p-3">{formatDate(donation.created_at)}</td>
                                    <td className="p-3">{donation.donor_name}</td>
                                    <td className="p-3">₹{donation.amount}</td>
                                    <td className="p-3">{donation.transaction_id}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : <p className="text-center p-4 text-gray-500">No donations have been recorded yet.</p>}
        </div>
    );
};

export default DonationHistoryTab;