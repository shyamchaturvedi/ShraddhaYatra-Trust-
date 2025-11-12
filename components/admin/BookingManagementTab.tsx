import React from 'react';
import { Booking, Trip, User, BookingStatus } from '../../types';
import { supabase } from '../../services/supabaseClient';

interface BookingManagementTabProps {
    bookings: Booking[];
    trips: Trip[];
    users: User[];
    // Fix: Changed `Promise<any>` to `PromiseLike<any>` to correctly type Supabase's "thenable" query builders.
    onAdminAction: (action: PromiseLike<any>, successMsg: string, errorMsg: string) => void;
}

const statusStyles: { [key in BookingStatus]: string } = {
  [BookingStatus.APPROVED]: 'text-green-600',
  [BookingStatus.PENDING]: 'text-yellow-600',
  [BookingStatus.REJECTED]: 'text-red-600',
};


const BookingManagementTab: React.FC<BookingManagementTabProps> = ({ bookings, trips, users, onAdminAction }) => {

    const handleUpdateBookingStatus = (bookingId: number, newStatus: BookingStatus) => {
        onAdminAction(
            supabase.from('bookings').update({ admin_status: newStatus }).eq('id', bookingId),
            'Booking status updated.',
            'Error updating booking status'
        );
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold text-orange-700 mb-4">Manage Booking Requests</h3>
                {bookings.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-amber-100">
                            <tr>
                                <th className="p-3 font-semibold text-orange-900">Requested On</th>
                                <th className="p-3 font-semibold text-orange-900">Trip</th>
                                <th className="p-3 font-semibold text-orange-900">User</th>
                                <th className="p-3 font-semibold text-orange-900">Status</th>
                                <th className="p-3 font-semibold text-orange-900">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map(booking => {
                                const trip = trips.find(t => t.id === booking.trip_id);
                                const user = users.find(u => u.id === booking.user_id);
                                return (
                                    <tr key={booking.id} className="border-b border-gray-200">
                                        <td className="p-3">{new Date(booking.created_at).toLocaleDateString()}</td>
                                        <td className="p-3">{trip?.title}</td>
                                        <td className="p-3">{user?.name} ({user?.phone})</td>
                                        <td className={`p-3 capitalize font-semibold ${statusStyles[booking.admin_status]}`}>{booking.admin_status}</td>
                                        <td className="p-3">
                                            {booking.admin_status === BookingStatus.PENDING && (
                                                <div className="flex gap-2">
                                                    <button onClick={() => handleUpdateBookingStatus(booking.id, BookingStatus.APPROVED)} className="bg-green-500 text-white px-3 py-1 text-sm rounded hover:bg-green-600">Approve</button>
                                                    <button onClick={() => handleUpdateBookingStatus(booking.id, BookingStatus.REJECTED)} className="bg-red-500 text-white px-3 py-1 text-sm rounded hover:bg-red-600">Reject</button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            ) : <p className="text-center p-4 text-gray-500">No booking requests have been made yet.</p>}
        </div>
    );
};

export default BookingManagementTab;