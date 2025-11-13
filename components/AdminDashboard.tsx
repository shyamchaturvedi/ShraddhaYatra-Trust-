import React, { useState } from 'react';
import { Trip, Booking, User, Donation, GalleryImage, AboutContent, ContactContent, Testimonial, TeamMember } from '../types';

import OverviewTab from './admin/OverviewTab';
import TripManagementTab from './admin/TripManagementTab';
import BookingManagementTab from './admin/BookingManagementTab';
import GalleryManagementTab from './admin/GalleryManagementTab';
import TestimonialManagementTab from './admin/TestimonialManagementTab';
import TeamManagementTab from './admin/TeamManagementTab';
import DonationHistoryTab from './admin/DonationHistoryTab';
import SiteContentTab from './admin/SiteContentTab';
import UserManagementTab from './admin/UserManagementTab';

interface AdminDashboardProps {
  currentUser: User;
  trips: Trip[];
  bookings: Booking[];
  users: User[];
  donations: Donation[];
  galleryImages: GalleryImage[];
  testimonials: Testimonial[];
  teamMembers: TeamMember[];
  aboutContent: AboutContent;
  contactContent: ContactContent;
  upiId: string;
  siteLogoUrl: string;
  onAdminAction: (action: PromiseLike<any>, successMsg: string, errorMsg: string) => void;
  onSendNotification: (trip: Trip, message: string, newDate?: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = (props) => {
    const [activeTab, setActiveTab] = useState('overview');
    
    const tabs = [
        { key: 'overview', name: 'Overview', component: <OverviewTab trips={props.trips} bookings={props.bookings} donations={props.donations} users={props.users} /> },
        { key: 'trips', name: 'Trip Management', component: <TripManagementTab trips={props.trips} onAdminAction={props.onAdminAction} onSendNotification={props.onSendNotification} currentUser={props.currentUser} /> },
        { key: 'bookings', name: 'Booking Management', component: <BookingManagementTab bookings={props.bookings} trips={props.trips} users={props.users} onAdminAction={props.onAdminAction} /> },
        { key: 'users', name: 'User Management', component: <UserManagementTab users={props.users} /> },
        { key: 'gallery', name: 'Gallery Management', component: <GalleryManagementTab galleryImages={props.galleryImages} trips={props.trips} onAdminAction={props.onAdminAction} currentUser={props.currentUser} /> },
        { key: 'testimonials', name: 'Testimonials', component: <TestimonialManagementTab testimonials={props.testimonials} onAdminAction={props.onAdminAction} currentUser={props.currentUser} /> },
        { key: 'team', name: 'Team Management', component: <TeamManagementTab teamMembers={props.teamMembers} onAdminAction={props.onAdminAction} currentUser={props.currentUser} /> },
        { key: 'donations', name: 'Donation History', component: <DonationHistoryTab donations={props.donations} /> },
        { key: 'settings', name: 'Site Content', component: <SiteContentTab aboutContent={props.aboutContent} contactContent={props.contactContent} upiId={props.upiId} siteLogoUrl={props.siteLogoUrl} onAdminAction={props.onAdminAction} currentUser={props.currentUser} /> },
    ];

    const activeComponent = tabs.find(tab => tab.key === activeTab)?.component;

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-amber-900 mb-6 text-center">Admin Dashboard</h2>
            
            <div className="mb-6 border-b border-gray-300 flex flex-wrap justify-center">
                {tabs.map(tab => (
                     <button 
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)} 
                        className={`px-4 py-3 text-md font-medium capitalize ${activeTab === tab.key ? 'border-b-2 border-orange-600 text-orange-700' : 'text-gray-500'}`}
                     >
                        {tab.name}
                     </button>
                ))}
            </div>
            
            <div>
                {activeComponent}
            </div>

        </div>
    );
};

export default AdminDashboard;