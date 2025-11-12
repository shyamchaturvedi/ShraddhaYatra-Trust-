import React from 'react';
import { Trip, Booking, User, Donation, TripStatus, BookingStatus } from '../../types';

interface OverviewTabProps {
    trips: Trip[];
    bookings: Booking[];
    donations: Donation[];
    users: User[];
}

const statusStyles: { [key in BookingStatus]: string } = {
  [BookingStatus.APPROVED]: 'text-green-600',
  [BookingStatus.PENDING]: 'text-yellow-600',
  [BookingStatus.REJECTED]: 'text-red-600',
};

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; }> = ({ title, value, icon }) => (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
        <div className="bg-orange-100 p-3 rounded-full">
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-amber-900">{value}</p>
        </div>
    </div>
);

const OverviewTab: React.FC<OverviewTabProps> = ({ trips, bookings, donations, users }) => {
    const upcomingTripsCount = trips.filter(t => t.status === TripStatus.UPCOMING).length;
    const pendingBookingsCount = bookings.filter(b => b.admin_status === BookingStatus.PENDING).length;
    const totalDonations = donations.reduce((sum, d) => sum + d.amount, 0).toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 });
    const totalUsers = users.length;
    
    const recentBookings = bookings.sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5);
    const recentDonations = donations.slice(0, 5);

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Upcoming Trips" value={upcomingTripsCount} icon={<svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2a1 1 0 011 1v8a1 1 0 01-1 1h-2a1 1 0 01-1-1z" /></svg>} />
                <StatCard title="Pending Bookings" value={pendingBookingsCount} icon={<svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
                <StatCard title="Total Donations" value={totalDonations} icon={<svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>} />
                <StatCard title="Registered Devotees" value={totalUsers} icon={<svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold text-orange-700 mb-4">Recent Booking Requests</h3>
                    {recentBookings.length > 0 ? (
                        <ul className="space-y-3">
                            {recentBookings.map(booking => {
                                const trip = trips.find(t => t.id === booking.trip_id);
                                const user = users.find(u => u.id === booking.user_id);
                                return (
                                    <li key={booking.id} className="flex justify-between items-center text-sm">
                                        <div>
                                            <p className="font-semibold text-gray-800">{user?.name || 'Unknown User'}</p>
                                            <p className="text-gray-500">{trip?.title || 'Unknown Trip'}</p>
                                        </div>
                                        <span className={`capitalize font-semibold px-2 py-0.5 rounded-full text-xs ${statusStyles[booking.admin_status].replace('text-', 'bg-').replace('-600', '-100')} ${statusStyles[booking.admin_status]}`}>{booking.admin_status}</span>
                                    </li>
                                )
                            })}
                        </ul>
                    ) : <p className="text-center p-4 text-gray-500">No recent bookings.</p>}
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold text-orange-700 mb-4">Recent Donations</h3>
                    {recentDonations.length > 0 ? (
                        <ul className="space-y-3">
                            {recentDonations.map(donation => (
                                <li key={donation.id} className="flex justify-between items-center text-sm">
                                    <p className="font-semibold text-gray-800">{donation.donor_name}</p>
                                    <p className="text-green-600 font-bold">₹{donation.amount.toLocaleString('en-IN')}</p>
                                </li>
                            ))}
                        </ul>
                    ) : <p className="text-center p-4 text-gray-500">No recent donations.</p>}
                </div>
            </div>
        </div>
    );
};

export default OverviewTab;
