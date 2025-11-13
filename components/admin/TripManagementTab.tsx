import React, { useState } from 'react';
import { Trip, TripStatus, User } from '../../types';
import AddEditTripForm from '../AddEditTripForm';
import ConfirmationModal from '../ConfirmationModal';
import NotificationModal from '../NotificationModal';
import { supabase } from '../../services/supabaseClient';

interface TripManagementTabProps {
    trips: Trip[];
    currentUser: User;
    // Fix: Changed `Promise<any>` to `PromiseLike<any>` to correctly type Supabase's "thenable" query builders.
    onAdminAction: (action: PromiseLike<any>, successMsg: string, errorMsg: string) => void;
    onSendNotification: (trip: Trip, message: string, newDate?: string) => void;
}

const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};


const TripManagementTab: React.FC<TripManagementTabProps> = ({ trips, currentUser, onAdminAction, onSendNotification }) => {
    const [isTripModalOpen, setIsTripModalOpen] = useState(false);
    const [tripToEdit, setTripToEdit] = useState<Trip | null>(null);
    const [tripToDelete, setTripToDelete] = useState<Trip | null>(null);
    const [tripToNotify, setTripToNotify] = useState<Trip | null>(null);

    const handleSaveTrip = async (tripData: Omit<Trip, 'id'> | Trip) => {
        if ('id' in tripData) {
            await onAdminAction(
                supabase.from('trips').update(tripData).eq('id', tripData.id),
                'Trip updated successfully.',
                'Error updating trip'
            );
        } else {
            await onAdminAction(
                supabase.from('trips').insert(tripData),
                'Trip added successfully.',
                'Error adding trip'
            );
        }
        setIsTripModalOpen(false);
        setTripToEdit(null);
    };

    const confirmDeleteTrip = async () => {
        if (!tripToDelete) return;
        await onAdminAction(
            supabase.from('trips').delete().eq('id', tripToDelete.id),
            'Trip deleted successfully.',
            'Error deleting trip'
        );
        setTripToDelete(null);
    };

    const handleEditTrip = (trip: Trip) => {
        setTripToEdit(trip);
        setIsTripModalOpen(true);
    };

    const handleAddNewTrip = () => {
        setTripToEdit(null);
        setIsTripModalOpen(true);
    };

    return (
        <>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-semibold text-orange-700">Manage Trips</h3>
                    <button onClick={handleAddNewTrip} className="bg-green-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">Add New Trip</button>
                </div>
                {trips.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-amber-100">
                                <tr>
                                    <th className="p-3 font-semibold text-orange-900">Trip Title</th>
                                    <th className="p-3 font-semibold text-orange-900">Date</th>
                                    <th className="p-3 font-semibold text-orange-900">Status</th>
                                    <th className="p-3 font-semibold text-orange-900">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                            {trips.map(trip => (
                                <tr key={trip.id} className="border-b border-gray-200">
                                <td className="p-3">{trip.title}</td>
                                <td className="p-3">{formatDate(trip.date)}</td>
                                <td className="p-3">{trip.status}</td>
                                <td className="p-3 flex flex-wrap gap-2">
                                    <button onClick={() => handleEditTrip(trip)} className="bg-blue-500 text-white px-3 py-1 text-sm rounded hover:bg-blue-600">Edit</button>
                                    <button onClick={() => setTripToDelete(trip)} className="bg-red-600 text-white px-3 py-1 text-sm rounded hover:bg-red-700">Delete</button>
                                    {trip.status === TripStatus.UPCOMING && <button onClick={() => setTripToNotify(trip)} className="bg-teal-500 text-white px-3 py-1 text-sm rounded hover:bg-teal-600">Notify</button>}
                                </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                ) : <p className="text-center p-4 text-gray-500">No trips found. Click 'Add New Trip' to create one.</p>}
            </div>

            {isTripModalOpen && <AddEditTripForm trip={tripToEdit} onSave={handleSaveTrip} onClose={() => setIsTripModalOpen(false)} currentUser={currentUser} />}
            {tripToNotify && <NotificationModal trip={tripToNotify} onSend={onSendNotification} onClose={() => setTripToNotify(null)} />}
            {tripToDelete && <ConfirmationModal isOpen={!!tripToDelete} title="Confirm Deletion" message={`Are you sure you want to delete "${tripToDelete.title}"?`} onConfirm={confirmDeleteTrip} onClose={() => setTripToDelete(null)} />}
        </>
    );
};

export default TripManagementTab;