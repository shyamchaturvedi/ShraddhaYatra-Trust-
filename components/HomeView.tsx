import React, { useRef, useEffect } from 'react';
import { Trip, Testimonial } from '../types';
import TripCard from './TripCard';

interface HomeViewProps {
  trips: Trip[];
  testimonials: Testimonial[];
  onViewDetails: (id: number) => void;
}

const TestimonialCard: React.FC<{ testimonial: Testimonial }> = ({ testimonial }) => (
    <div className="flex-shrink-0 w-80 bg-white rounded-xl shadow-lg p-6 flex flex-col items-center text-center snap-center">
        <img src={testimonial.author_image_url || '/images/testimonials/avatar.png'} alt={testimonial.author_name} className="w-20 h-20 rounded-full object-cover mb-4 border-4 border-amber-200" />
        <p className="text-gray-600 italic flex-grow">"{testimonial.message}"</p>
        <div className="mt-4">
            <p className="font-bold text-amber-900">{testimonial.author_name}</p>
            <p className="text-sm text-gray-500">{testimonial.author_location}</p>
        </div>
    </div>
);

const HomeView: React.FC<HomeViewProps> = ({ trips, testimonials, onViewDetails }) => {
    const testimonialContainerRef = useRef<HTMLDivElement>(null);
    const scrollIntervalRef = useRef<number | null>(null);

    const handleScrollToJourneys = () => {
        document.getElementById('journeys')?.scrollIntoView({ behavior: 'smooth' });
    };
    
    const startAutoScroll = () => {
        if (scrollIntervalRef.current) clearInterval(scrollIntervalRef.current);
        scrollIntervalRef.current = window.setInterval(() => {
            if (testimonialContainerRef.current) {
                const { scrollLeft, scrollWidth, clientWidth } = testimonialContainerRef.current;
                let newScrollLeft = scrollLeft + clientWidth / 2; // Scroll half the container width for a smoother effect
                if (newScrollLeft >= scrollWidth - clientWidth) {
                    newScrollLeft = 0;
                }
                testimonialContainerRef.current.scrollTo({ left: newScrollLeft, behavior: 'smooth' });
            }
        }, 5000); // Scroll every 5 seconds
    };

    const stopAutoScroll = () => {
        if (scrollIntervalRef.current) clearInterval(scrollIntervalRef.current);
    };
    
    useEffect(() => {
        // Start scrolling only if there are enough testimonials to scroll
        if (testimonials.length > 1) {
            startAutoScroll();
        }
        return () => stopAutoScroll(); // Cleanup interval on component unmount
    }, [testimonials]);

    return (
    <>
        <div 
            className="relative h-[60vh] flex items-center justify-center text-white text-center px-4"
            style={{ backgroundImage: `url('/images/hero.jpg')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
            <div className="absolute inset-0 bg-black bg-opacity-50"></div>
            <div className="relative z-10">
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">आस्था की पावन यात्रा</h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-amber-100">Embark on a journey of faith, devotion, and discovery with us.</p>
                <button onClick={handleScrollToJourneys} className="mt-8 inline-block bg-orange-500 text-white font-bold py-3 px-8 rounded-lg hover:bg-orange-600 transition-colors text-lg">
                    Explore Our Journeys
                </button>
            </div>
        </div>

         <div className="py-16 bg-white">
            <div className="container mx-auto px-6 text-center">
                <h2 className="text-3xl font-bold text-amber-900 mb-4">Why Travel With Us?</h2>
                <p className="max-w-3xl mx-auto text-gray-600 mb-12">We provide a seamless and deeply spiritual pilgrimage experience, rooted in devotion and community.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="flex flex-col items-center">
                         <div className="bg-orange-100 p-5 rounded-full mb-4">
                            <svg className="w-10 h-10 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 16.382V5.618a1 1 0 00-1.447-.894L15 7m-6 3v3m6-3v3" /></svg>
                        </div>
                        <h3 className="text-xl font-semibold text-amber-800 mb-2">Expertly Planned Yatras</h3>
                        <p className="text-gray-500">We manage all logistics, so you can focus on your spiritual practices without any worries.</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="bg-orange-100 p-5 rounded-full mb-4">
                            <svg className="w-10 h-10 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                        </div>
                        <h3 className="text-xl font-semibold text-amber-800 mb-2">Devotional Community</h3>
                        <p className="text-gray-500">Travel with like-minded devotees and forge lifelong bonds in a supportive, spiritual environment.</p>
                    </div>
                     <div className="flex flex-col items-center">
                        <div className="bg-orange-100 p-5 rounded-full mb-4">
                            <svg className="w-10 h-10 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <h3 className="text-xl font-semibold text-amber-800 mb-2">Authentic Experiences</h3>
                        <p className="text-gray-500">We ensure you experience the sacred rituals and deep heritage of each holy site authentically.</p>
                    </div>
                </div>
            </div>
        </div>
        
        <div id="journeys" className="text-center py-16 px-4 bg-amber-50">
            <h2 className="text-3xl font-bold text-amber-900 mb-4">Upcoming Sacred Journeys</h2>
            <p className="max-w-2xl mx-auto text-gray-600 mb-12">Choose your path and let us guide you on a journey of a lifetime.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-4 md:p-8">
                {trips.filter(t => t.status === 'Upcoming').map(trip => (
                    <TripCard key={trip.id} trip={trip} onViewDetails={onViewDetails} />
                ))}
            </div>
        </div>

        {testimonials.length > 0 && (
            <div className="py-16 bg-amber-100">
                <div className="container mx-auto px-6 text-center">
                     <h2 className="text-3xl font-bold text-amber-900 mb-4">What Our Devotees Say</h2>
                     <p className="max-w-2xl mx-auto text-gray-600 mb-12">The words of those who have journeyed with us.</p>
                     <div 
                        ref={testimonialContainerRef}
                        onMouseEnter={stopAutoScroll}
                        onMouseLeave={startAutoScroll}
                        className="flex overflow-x-auto space-x-8 p-4 snap-x snap-mandatory scroll-smooth"
                     >
                        {testimonials.map(testimonial => <TestimonialCard key={testimonial.id} testimonial={testimonial} />)}
                     </div>
                </div>
            </div>
        )}
    </>
    );
};
export default HomeView;