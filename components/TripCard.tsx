import React from 'react';
import { Trip, TripStatus } from '../types';

interface TripCardProps {
  trip: Trip;
  onViewDetails: (id: number) => void;
}

const statusStyles: { [key in TripStatus]: string } = {
  [TripStatus.UPCOMING]: 'bg-green-100 text-green-800',
  [TripStatus.COMPLETED]: 'bg-gray-100 text-gray-800',
  [TripStatus.CANCELLED]: 'bg-red-100 text-red-800',
};

const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};


const TripCard: React.FC<TripCardProps> = ({ trip, onViewDetails }) => {
  const isActionable = trip.status === TripStatus.UPCOMING;

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 ease-in-out border border-amber-200 flex flex-col">
      <div className="relative">
        <img className="w-full h-48 object-cover" src={trip.image_url || '/images/trips/default.jpg'} alt={trip.title} />
        <span 
            className={`absolute top-2 right-2 text-xs font-semibold px-2.5 py-1 rounded-full ${statusStyles[trip.status]}`}
        >
            {trip.status}
        </span>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-2xl font-bold text-amber-900 mb-2">{trip.title}</h3>
        <p className="text-gray-600 text-sm mb-4 flex-grow">{trip.description}</p>
        
        <div className="flex justify-between items-center text-sm text-gray-700 mb-4">
          <div className="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            <span>{formatDate(trip.date)}</span>
          </div>
          <div className="font-semibold text-xl text-orange-600">
            ₹{trip.ticket_price}
          </div>
        </div>

        <button 
          onClick={() => onViewDetails(trip.id)}
          disabled={!isActionable}
          className="w-full bg-orange-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isActionable ? 'View Details & Join' : 'View Details'}
        </button>
      </div>
    </div>
  );
};

export default TripCard;