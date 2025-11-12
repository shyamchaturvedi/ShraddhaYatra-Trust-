import React, { useState, useEffect, useCallback } from 'react';
import { Trip, User, Role, Booking, BookingStatus, Donation, TripStatus, GalleryImage, AboutContent, ContactContent, Testimonial, ToastType } from './types';
import { supabase } from './services/supabaseClient';

import Header from './components/Header';
import HomeView from './components/HomeView';
import TripDetailView from './components/TripDetailView';
import BookingsView from './components/BookingsView';
import AdminDashboard from './components/AdminDashboard';
import LoginView from './components/LoginView';
import RegisterView from './components/RegisterView';
import ProfileView from './components/ProfileView';
import DonationView from './components/DonationView';
import Footer from './components/Footer';
import AboutView from './components/AboutView';
import GalleryView from './components/GalleryView';
import ContactView from './components/ContactView';
import Spinner from './components/Spinner';
import { useToasts } from './hooks/useToasts';
import { ToastContainer } from './components/Toast';

const App: React.FC = () => {
    const [view, setView] = useState('home');
    const [selectedTripId, setSelectedTripId] = useState<number | null>(null);
    const [authAction, setAuthAction] = useState<{ view: string; tripId?: number } | null>(null);
    
    // Auth state
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    
    // Live Data State
    const [trips, setTrips] = useState<Trip[]>([]);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [donations, setDonations] = useState<Donation[]>([]);
    const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [allUsers, setAllUsers] = useState<User[]>([]); // For admin view

    // Dynamic Content State
    const [config, setConfig] = useState<any>({});
    const [siteLogoUrl, setSiteLogoUrl] = useState('/logo.png');
    
    // Loading State
    const [isLoading, setIsLoading] = useState(true);
    // Fix: Add authError state for login/register forms.
    const [authError, setAuthError] = useState('');

    // Toast Notifications
    const { toasts, addToast, removeToast } = useToasts();

    // --- DATA FETCHING ---
    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
            if (sessionError) throw sessionError;

            let currentProfile: User | null = null;
            if (sessionData.session?.user) {
                const { data: profile } = await supabase.from('profiles').select('*').eq('id', sessionData.session.user.id).single();
                if (profile) {
                    currentProfile = profile;
                    setCurrentUser(profile);
                    setIsAuthenticated(true);
                }
            } else {
                 setCurrentUser(null);
                 setIsAuthenticated(false);
            }

            const { data: tripsData, error: tripsError } = await supabase.from('trips').select('*').order('date', { ascending: false });
            if (tripsError) throw tripsError;
            setTrips(tripsData || []);

            const { data: bookingsData, error: bookingsError } = await supabase.from('bookings').select('*');
            if (bookingsError) throw bookingsError;
            setBookings(bookingsData || []);

            const { data: galleryData, error: galleryError } = await supabase.from('gallery').select('*');
            if (galleryError) throw galleryError;
            setGalleryImages(galleryData || []);
            
            const { data: donationsData, error: donationsError } = await supabase.from('donations').select('*').order('created_at', { ascending: false });
            if (donationsError) throw donationsError;
            setDonations(donationsData || []);

            const { data: testimonialsData, error: testimonialsError } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false });
            if (testimonialsError) throw testimonialsError;
            setTestimonials(testimonialsData || []);

            const { data: configData, error: configError } = await supabase.from('config').select('*');
            if (configError) throw configError;
            const configMap = (configData || []).reduce((acc, item) => ({...acc, [item.key]: item.value}), {});
            setConfig(configMap);
            setSiteLogoUrl(configMap.site_logo_url || '/logo.png');
            
            // For Admin
            if (currentProfile?.role === Role.ADMIN) {
                 const { data: usersData, error: usersError } = await supabase.from('profiles').select('*');
                 if (usersError) throw usersError;
                 setAllUsers(usersData || []);
            }

        } catch (error: any) {
            addToast(`Error fetching data: ${error.message}`, 'error');
            console.error("Error fetching data:", error.message);
        } finally {
            setIsLoading(false);
        }
    }, [addToast]);

    useEffect(() => {
        fetchData();
        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            fetchData();
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, [fetchData]);

    // --- HANDLERS ---
    const handleLogin = async (phone: string, pass: string) => {
        // Fix: Reset auth error on new attempt and set it on failure.
        setAuthError('');
        const { data, error } = await supabase.auth.signInWithPassword({ phone: `+91${phone}`, password: pass });
        if (error) {
            addToast(error.message, 'error');
            setAuthError(error.message);
        } else if (data.user) {
            addToast('Login successful!', 'success');
            if (authAction) {
                if(authAction.tripId) setSelectedTripId(authAction.tripId);
                setView(authAction.view);
                setAuthAction(null);
            } else {
                setView('home');
            }
        }
    };

    const handleRegister = async (name: string, phone: string, pass: string): Promise<boolean> => {
        // Fix: Reset auth error on new attempt and set it on failure.
        setAuthError('');
        const { data, error } = await supabase.auth.signUp({ 
            phone: `+91${phone}`, 
            password: pass,
            options: { data: { name: name } }
        });

        if (error) {
            addToast(error.message, 'error');
            setAuthError(error.message);
            return false;
        }
        
        if (data.user) {
            addToast("Registration successful! You are now logged in.", 'success');
            setView('home'); 
            return true;
        }
        return false;
    };

    const handleUpdateUser = async (updatedUser: User) => {
        const { error } = await supabase.from('profiles').update({ name: updatedUser.name, phone: updatedUser.phone }).eq('id', updatedUser.id);
        if (error) {
            addToast('Error updating profile: ' + error.message, 'error');
        } else {
            addToast('Profile updated successfully!', 'success');
            await fetchData();
            setView('home');
        }
    };
    
     const handleChangePassword = async (newPassword: string) => {
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        if (error) {
            addToast('Error changing password: ' + error.message, 'error');
            return false;
        }
        addToast('Password changed successfully!', 'success');
        return true;
    };


    const handleLogout = async () => {
        await supabase.auth.signOut();
        setView('home');
        setSelectedTripId(null);
        setAuthAction(null);
        addToast("You've been logged out.", 'info');
    };

    const handleViewDetails = (id: number) => {
        setSelectedTripId(id);
        setView('tripDetail');
    };

    const handleAddBooking = async (tripId: number) => {
        if (!currentUser) {
            setAuthAction({ view: 'tripDetail', tripId });
            setView('login');
            return;
        }
        const { error } = await supabase.from('bookings').insert({ trip_id: tripId, user_id: currentUser.id });
        if (error) {
             if (error.code === '23505') { // unique constraint violation
                addToast('You have already requested to join this trip.', 'info');
             } else {
                addToast('Error submitting booking request: ' + error.message, 'error');
             }
        } else {
            await fetchData();
            addToast('Your request to join the trip has been sent.', 'success');
            setView('bookings');
        }
    };
    
    const handleUpdateBookingStatus = async (bookingId: number, newStatus: BookingStatus) => {
        const { error } = await supabase.from('bookings').update({ admin_status: newStatus }).eq('id', bookingId);
        if (error) addToast('Error updating booking: ' + error.message, 'error');
        else {
            await fetchData();
            addToast('Booking status updated.', 'success');
        }
    };

    const handleAddDonation = async (donationData: Omit<Donation, 'id' | 'created_at'>) => {
        const { error } = await supabase.from('donations').insert(donationData);
        if (error) addToast('Error recording donation: ' + error.message, 'error');
        else {
            await fetchData();
            addToast('Thank you for your generous donation!', 'success');
            setView('home');
        }
    };
    
    // Fix: Changed `Promise<any>` to `PromiseLike<any>` to correctly type Supabase's "thenable" query builders.
    const handleAdminAction = async (action: PromiseLike<any>, successMsg: string, errorMsg: string) => {
        const { error } = await action;
        if (error) {
            addToast(`${errorMsg}: ${error.message}`, 'error');
        } else {
            addToast(successMsg, 'success');
            await fetchData();
        }
    };

    const handleSendNotification = async (trip: Trip, message: string, newDate?: string) => {
        if (newDate) {
            await handleAdminAction(supabase.from('trips').update({ date: newDate }).eq('id', trip.id), 'Trip date updated.', 'Failed to update date');
        }
        if (trip.status === TripStatus.CANCELLED) {
             await handleAdminAction(supabase.from('trips').update({ status: TripStatus.CANCELLED }).eq('id', trip.id), 'Trip cancelled.', 'Failed to cancel trip');
        }
        const whatsappLink = `https://api.whatsapp.com/send?phone=919598023701&text=${encodeURIComponent(message)}`;
        window.open(whatsappLink, '_blank');
    };

    const renderContent = () => {
        if (isLoading) return <div className="flex justify-center items-center h-screen"><Spinner /></div>;
        const selectedTrip = trips.find(t => t.id === selectedTripId);

        switch (view) {
            // Fix: Pass the `authError` state as the `loginError` prop.
            case 'login': return <LoginView onLogin={handleLogin} setView={setView} loginError={authError} />;
            // Fix: Pass the `authError` state as the `loginError` prop.
            case 'register': return <RegisterView onRegister={handleRegister} setView={setView} loginError={authError} />;
            case 'tripDetail': return selectedTrip ? <TripDetailView trip={selectedTrip} onBookNow={handleAddBooking} /> : <p>Trip not found.</p>;
            case 'bookings': return currentUser ? <BookingsView bookings={bookings} trips={trips} currentUser={currentUser} /> : <p>Please log in.</p>;
            case 'admin':
                return currentUser?.role === Role.ADMIN ? <AdminDashboard trips={trips} bookings={bookings} users={allUsers} donations={donations} galleryImages={galleryImages} testimonials={testimonials} aboutContent={config.about_content} contactContent={config.contact_content} upiId={config.upi_id} siteLogoUrl={siteLogoUrl} onAdminAction={handleAdminAction} onSendNotification={handleSendNotification} /> : <p>Access Denied.</p>;
            case 'profile': return currentUser ? <ProfileView user={currentUser} onUpdateUser={handleUpdateUser} onChangePassword={handleChangePassword} /> : <p>Please log in.</p>;
            case 'donation': return <DonationView upiId={config.upi_id} onAddDonation={handleAddDonation} currentUser={currentUser} />;
            case 'about': return <AboutView content={config.about_content} />;
            case 'gallery': return <GalleryView trips={trips} images={galleryImages} />;
            case 'contact': return <ContactView content={config.contact_content} />;
            case 'home':
            default: return <HomeView trips={trips} onViewDetails={handleViewDetails} testimonials={testimonials} />;
        }
    };

    return (
        <div className="min-h-screen bg-amber-50 text-gray-900 font-sans flex flex-col">
            <ToastContainer toasts={toasts} removeToast={removeToast} />
            <Header isAuthenticated={isAuthenticated} userName={currentUser?.name || ''} currentRole={currentUser?.role || Role.MEMBER} setView={setView} setSelectedTripId={setSelectedTripId} onLogout={handleLogout} logoUrl={siteLogoUrl} />
            <main className="flex-grow">{renderContent()}</main>
            <Footer logoUrl={siteLogoUrl}/>
        </div>
    );
};

export default App;