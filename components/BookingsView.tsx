
import React from 'react';
import { Booking, Trip, User, BookingStatus } from '../types';
import BookingDetailsCard from './BookingDetailsCard';

interface BookingsViewProps {
  bookings: Booking[];
  trips: Trip[];
  currentUser: User;
}

const statusStyles: { [key in BookingStatus]: string } = {
  [BookingStatus.APPROVED]: 'bg-green-100 text-green-800',
  [BookingStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
  [BookingStatus.REJECTED]: 'bg-red-100 text-red-800',
};

const StatusInfoCard: React.FC<{ booking: Booking; trip: Trip }> = ({ booking, trip }) => (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-400">
        <div className="flex justify-between items-start">
            <div>
                <h3 className="text-xl font-bold text-amber-900">{trip.title}</h3>
                <p className="text-sm text-gray-600">Requested on: {new Date(booking.created_at).toLocaleDateString()}</p>
            </div>
            <span className={`px-3 py-1 text-sm font-semibold rounded-full ${statusStyles[booking.admin_status]}`}>
                {booking.admin_status}
            </span>
        </div>
        {booking.admin_status === BookingStatus.PENDING && (
            <p className="mt-4 text-gray-700">Your booking request is under review. You will be notified once the admin approves it.</p>
        )}
        {booking.admin_status === BookingStatus.REJECTED && (
            <p className="mt-4 text-gray-700">We regret to inform you that your booking request could not be approved at this time. Please contact us for more details.</p>
        )}
    </div>
);


const BookingsView: React.FC<BookingsViewProps> = ({ bookings, trips, currentUser }) => {
    const myBookings = bookings
      .filter(b => b.user_id === currentUser.id)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    if (myBookings.length === 0) return <p className="text-center p-8 text-gray-600">You have no bookings yet. Join a yatra to get started.</p>;

    const approvedBookings = myBookings.filter(b => b.admin_status === BookingStatus.APPROVED);
    const otherBookings = myBookings.filter(b => b.admin_status !== BookingStatus.APPROVED);

    return (
        <div className="p-4 md:p-8 space-y-12">
            <div>
                <h2 className="text-3xl font-bold text-amber-900 text-center mb-8">My Bookings</h2>
                {approvedBookings.length > 0 ? (
                    approvedBookings.map(booking => {
                        const trip = trips.find(t => t.id === booking.trip_id);
                        if (!trip) return null;
                        return <BookingDetailsCard key={booking.id} booking={booking} trip={trip} user={currentUser} />;
                    })
                ) : (
                    <p className="text-center text-gray-600">You have no approved bookings yet.</p>
                )}
            </div>

            {otherBookings.length > 0 && (
                <div>
                    <h3 className="text-2xl font-bold text-amber-800 text-center mb-6 border-t pt-8">Booking Requests</h3>
                    <div className="space-y-6">
                        {otherBookings.map(booking => {
                            const trip = trips.find(t => t.id === booking.trip_id);
                            if (!trip) return null;
                            return <StatusInfoCard key={booking.id} booking={booking} trip={trip} />;
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookingsView;