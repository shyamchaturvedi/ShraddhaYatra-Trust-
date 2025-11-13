import React, { useState, useEffect, useCallback } from 'react';
import { Trip, User, Role, Booking, BookingStatus, Donation, TripStatus, GalleryImage, AboutContent, ContactContent, Testimonial, ToastType, TeamMember } from './types';
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
import OurTeamView from './components/OurTeamView';
import Spinner from './components/Spinner';
import { useToasts } from './hooks/useToasts';
import { ToastContainer } from './components/Toast';
import { ABOUT_CONTENT, CONTACT_CONTENT } from './constants';

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
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [allUsers, setAllUsers] = useState<User[]>([]); // For admin view

    // Dynamic Content State
    const [config, setConfig] = useState<any>({});
    const [siteLogoUrl, setSiteLogoUrl] = useState('/logo.png');
    
    // Loading State
    const [isLoading, setIsLoading] = useState(true);
    const [authError, setAuthError] = useState('');

    // Toast Notifications
    const { toasts, addToast, removeToast } = useToasts();
    
    // --- DATA FETCHING ---
    const fetchData = useCallback(async () => {
        setIsLoading(true);
        let currentProfile: User | null = null;
        try {
            const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
            if (sessionError) throw sessionError;

            if (sessionData.session?.user) {
                const userAuth = sessionData.session.user;
                const { data: profile, error: profileError } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', userAuth.id)
                    .single();

                if (profile) {
                    currentProfile = profile;
                } else if (profileError && profileError.code === 'PGRST116') { 
                    console.warn('User exists in auth but not in profiles. Creating profile to self-heal.');
                    
                    const newProfileData = {
                        id: userAuth.id,
                        name: userAuth.user_metadata?.name || 'New User',
                        phone: userAuth.phone ? userAuth.phone.replace('+91', '') : '',
                        role: Role.MEMBER
                    };

                    const { data: insertedProfile, error: insertError } = await supabase
                        .from('profiles')
                        .insert(newProfileData)
                        .select()
                        .single();

                    if (insertError) {
                        addToast(`Could not fix your account. Please contact support. Error: ${insertError.message}`, 'error');
                        await supabase.auth.signOut();
                        currentProfile = null;
                    } else if (insertedProfile) {
                        addToast('Account recovered and login successful!', 'success');
                        currentProfile = insertedProfile;
                    }
                } else if (profileError) {
                    console.error("Error fetching profile:", profileError);
                }
            }
            
            setCurrentUser(currentProfile);
            setIsAuthenticated(!!currentProfile);

            const logFetchError = (feature: string, error: any) => {
                const errorMessage = `Error fetching ${feature}: ${error.message}`;
                
                // Check for RLS infinite recursion
                if (error.message.includes("infinite recursion detected")) {
                    // Log a detailed error for the developer.
                    console.error(`A critical Supabase error occurred while fetching ${feature}: ${errorMessage}. This is likely due to a misconfigured Row Level Security (RLS) policy on your 'profiles' table. Please review your policies to remove recursive checks (e.g., a policy on 'profiles' that selects from 'profiles').`);
                    // Show a generic but serious toast to the user.
                    addToast('A database security policy error occurred. Please contact support.', 'error');
                    return;
                }
                
                // Check for missing 'team_members' table
                if (error.message.includes("public.team_members")) {
                    // Log a helpful warning for the developer, but don't show an error toast.
                    console.warn(`Could not fetch team members. This is expected if you haven't set up the 'Our Team' feature in Supabase yet. The feature will be hidden. Error: ${error.message}`);
                    return; // Don't show a toast for this specific, non-critical setup error.
                }
            
                // Generic error toast for other issues
                addToast(errorMessage, 'error');
                console.error(errorMessage);
            };

            const { data: tripsData, error: tripsError } = await supabase.from('trips').select('*').order('date', { ascending: false });
            if (tripsError) logFetchError('trips', tripsError); else setTrips(tripsData || []);

            const { data: bookingsData, error: bookingsError } = await supabase.from('bookings').select('*');
            if (bookingsError) logFetchError('bookings', bookingsError); else setBookings(bookingsData || []);

            const { data: galleryData, error: galleryError } = await supabase.from('gallery').select('*');
            if (galleryError) logFetchError('gallery', galleryError); else setGalleryImages(galleryData || []);
            
            const { data: donationsData, error: donationsError } = await supabase.from('donations').select('*').order('created_at', { ascending: false });
            if (donationsError) logFetchError('donations', donationsError); else setDonations(donationsData || []);

            const { data: testimonialsData, error: testimonialsError } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false });
            if (testimonialsError) logFetchError('testimonials', testimonialsError); else setTestimonials(testimonialsData || []);

            const { data: teamData, error: teamError } = await supabase.from('team_members').select('*').order('display_order', { ascending: true });
            if (teamError) {
                logFetchError('team members', teamError);
                setTeamMembers([]);
            } else {
                setTeamMembers(teamData || []);
            }

            const { data: configData, error: configError } = await supabase.from('config').select('*');
            if (configError) logFetchError('config', configError); else {
                const configMap = (configData || []).reduce((acc, item) => ({...acc, [item.key]: item.value}), {});
                
                // Use fallback content if database is empty
                if (!configMap.about_content) configMap.about_content = ABOUT_CONTENT;
                if (!configMap.contact_content) configMap.contact_content = CONTACT_CONTENT;
                
                setConfig(configMap);
                setSiteLogoUrl(configMap.site_logo_url || '/logo.png');
            }
            
            if (currentProfile?.role === Role.ADMIN) {
                 const { data: usersData, error: usersError } = await supabase.from('profiles').select('*');
                 if (usersError) logFetchError('all users', usersError); else setAllUsers(usersData || []);
            }

        } catch (error: any) {
            addToast(`A critical error occurred: ${error.message}`, 'error');
            console.error("Critical error fetching data:", error.message);
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
            const { error: profileError } = await supabase.from('profiles').insert({
                id: data.user.id,
                name,
                phone,
                role: Role.MEMBER,
            });

            if (profileError) {
                addToast(`Registration failed during profile creation: ${profileError.message}`, 'error');
                setAuthError(profileError.message);
                await supabase.auth.signOut();
                return false;
            }

            addToast("Registration successful! You are now logged in.", 'success');
            setView('home'); 
            return true;
        }
        return false;
    };

    const handleUpdateUser = async (userId: string, updatedData: Partial<User>) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, password, ...dataToUpdate } = updatedData; // Ensure password is not sent
        const { error } = await supabase.from('profiles').update(dataToUpdate).eq('id', userId);
        if (error) {
            addToast('Error updating profile: ' + error.message, 'error');
        } else {
            addToast('Profile updated successfully!', 'success');
            await fetchData();
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
            case 'login': return <LoginView onLogin={handleLogin} setView={setView} loginError={authError} />;
            case 'register': return <RegisterView onRegister={handleRegister} setView={setView} loginError={authError} />;
            case 'tripDetail': return selectedTrip ? <TripDetailView trip={selectedTrip} onBookNow={handleAddBooking} /> : <p>Trip not found.</p>;
            case 'bookings': return currentUser ? <BookingsView bookings={bookings} trips={trips} currentUser={currentUser} logoUrl={siteLogoUrl} /> : <p>Please log in.</p>;
            case 'admin':
                return currentUser?.role === Role.ADMIN ? <AdminDashboard trips={trips} bookings={bookings} users={allUsers} donations={donations} galleryImages={galleryImages} testimonials={testimonials} teamMembers={teamMembers} aboutContent={config.about_content} contactContent={config.contact_content} upiId={config.upi_id} siteLogoUrl={siteLogoUrl} onAdminAction={handleAdminAction} onSendNotification={handleSendNotification} /> : <p>Access Denied.</p>;
            case 'profile': return currentUser ? <ProfileView user={currentUser} onUpdateUser={handleUpdateUser} onChangePassword={handleChangePassword} logoUrl={siteLogoUrl} /> : <p>Please log in.</p>;
            case 'donation': return <DonationView upiId={config.upi_id} onAddDonation={handleAddDonation} currentUser={currentUser} />;
            case 'about': return <AboutView />;
            case 'ourTeam': return <OurTeamView teamMembers={teamMembers} />;
            case 'gallery': return <GalleryView trips={trips} images={galleryImages} />;
            case 'contact': return <ContactView content={config.contact_content} />;
            case 'home':
            default: return <HomeView trips={trips} onViewDetails={handleViewDetails} testimonials={testimonials} />;
        }
    };

    return (
        <div className="min-h-screen bg-amber-50 text-gray-900 font-sans flex flex-col">
            <ToastContainer toasts={toasts} removeToast={removeToast} />
            <Header 
                isAuthenticated={isAuthenticated} 
                userName={currentUser?.name || ''} 
                currentRole={currentUser?.role || Role.MEMBER} 
                setView={setView} 
                setSelectedTripId={setSelectedTripId} 
                onLogout={handleLogout} 
                logoUrl={siteLogoUrl}
             />
            <main className="flex-grow">{renderContent()}</main>
            <Footer logoUrl={siteLogoUrl}/>
        </div>
    );
};

export default App;