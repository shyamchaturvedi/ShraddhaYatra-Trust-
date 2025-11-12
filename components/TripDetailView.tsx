import React, { useState, useEffect } from 'react';
import { Trip, TripStatus } from '../types';
import { getTripBlessing } from '../services/geminiService';
import Spinner from './Spinner';

interface TripDetailViewProps {
  trip: Trip;
  onBookNow: (tripId: number) => void;
}

// Moved outside component for better performance and readability
const DetailItem: React.FC<{label: string; value: string; icon: React.ReactNode}> = ({label, value, icon}) => (
    <div className="flex items-start">
        <div className="w-5 h-5 mr-2 text-orange-500">{icon}</div>
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="font-semibold">{value}</p>
        </div>
    </div>
);

const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};


// Moved outside component for better performance and readability
const icons: {[key:string]: React.ReactNode} = {
    calendar: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>,
    clock: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" /></svg>,
    train: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" /><path d="M10.894 8.243a1 1 0 011.212 0l2.67 2.191A1 1 0 0114 11.535V14a1 1 0 01-1 1H7a1 1 0 01-1-1v-2.465a1 1 0 01.218-.6l2.67-2.192a1 1 0 011.006-.001z" /><path fillRule="evenodd" d="M4 11a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM4 15a2 2 0 100 4 2 2 0 000-4zm12 0a2 2 0 100 4 2 2 0 000-4z" clipRule="evenodd" /></svg>,
    pin: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>,
    platform: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 2a1.5 1.5 0 00-1.5 1.5v13A1.5 1.5 0 0010 18h5a1.5 1.5 0 001.5-1.5v-2A1.5 1.5 0 0015 13h-5a.5.5 0 010-1h5a1.5 1.5 0 001.5-1.5v-2A1.5 1.5 0 0015 7h-5a.5.5 0 010-1h5a1.5 1.5 0 001.5-1.5v-2A1.5 1.5 0 0015 2h-5zM5 2a1.5 1.5 0 00-1.5 1.5v13A1.5 1.5 0 005 18h2a.5.5 0 000-1H5V3h2a.5.5 0 000-1H5z" clipRule="evenodd" /></svg>,
};

const TripDetailView: React.FC<TripDetailViewProps> = ({ trip, onBookNow }) => {
    const [blessing, setBlessing] = useState<string | null>(null);
    const [isBlessingLoading, setIsBlessingLoading] = useState(false);
    const isActionable = trip.status === TripStatus.UPCOMING;

    useEffect(() => {
        const fetchBlessing = async () => {
            setIsBlessingLoading(true);
            setBlessing(null); // Clear previous blessing
            const blessingText = await getTripBlessing(trip);
            setBlessing(blessingText);
            setIsBlessingLoading(false);
        }
        fetchBlessing();
    }, [trip]);


    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8">
            <div className="bg-white rounded-lg shadow-xl overflow-hidden">
                <img className="w-full h-64 object-cover" src={trip.image_url} alt={trip.title} />
                <div className="p-6">
                    <h2 className="text-4xl font-bold text-amber-900 mb-4">{trip.title}</h2>
                    <p className="text-gray-700 mb-6">{trip.description}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-6 text-gray-800">
                        <DetailItem icon={icons.calendar} label="Date" value={formatDate(trip.date)} />
                        <DetailItem icon={icons.clock} label="Time" value={trip.time} />
                        <DetailItem icon={icons.train} label="Train No." value={trip.train_no} />
                        <DetailItem icon={icons.pin} label="From" value={trip.from_station} />
                        <DetailItem icon={icons.pin} label="To" value={trip.to_station} />
                        <DetailItem icon={icons.platform} label="Platform" value={trip.platform} />
                    </div>
                    
                    <div className="bg-amber-100 border-l-4 border-amber-500 text-amber-800 p-4 rounded-md mb-6">
                        <p className="font-semibold">Notes: {trip.notes}</p>
                    </div>

                    {isBlessingLoading && <Spinner />}
                    {blessing && (
                        <div className="my-6 p-4 bg-gradient-to-r from-amber-100 to-orange-100 border-l-4 border-orange-500 rounded-md shadow">
                            <p className="text-lg font-semibold text-orange-800 mb-2">A Divine Blessing for Your Journey:</p>
                            <p className="text-orange-900 italic">"{blessing}"</p>
                        </div>
                    )}

                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between mt-8">
                        <span className="text-3xl font-bold text-orange-600">
                            ₹{trip.ticket_price} <span className="text-lg font-normal text-gray-600">per person</span>
                        </span>
                        {isActionable && (
                            <button onClick={() => onBookNow(trip.id)} className="w-full md:w-auto px-8 py-3 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700 transition-colors">
                                Join This Trip
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TripDetailView;