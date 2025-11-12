

import React, { useRef } from 'react';
import { Booking, Trip, User } from '../types';

interface BookingDetailsCardProps {
  booking: Booking;
  trip: Trip;
  user: User;
  logoUrl: string;
}

// Helper function for date formatting
const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

// Helper function for booking ID formatting
const formatBookingId = (booking: Booking): string => {
  const date = new Date(booking.created_at);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const sequentialId = String(booking.id).padStart(3, '0');
  return `SYT00/${month}/${sequentialId}`;
};

const BookingDetailsCard: React.FC<BookingDetailsCardProps> = ({ booking, trip, user, logoUrl }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const cardElement = cardRef.current;
    if (!cardElement) return;

    // This function will run after the print dialog is closed
    const afterPrint = () => {
      document.body.classList.remove('is-printing');
      cardElement.classList.remove('print-this');
      window.removeEventListener('afterprint', afterPrint);
    };

    window.addEventListener('afterprint', afterPrint);

    // Add classes to isolate the card for printing
    document.body.classList.add('is-printing');
    cardElement.classList.add('print-this');
    
    // Trigger the browser's print functionality
    window.print();
  };

  const formattedDate = formatDate(trip.date);
  const formattedBookingId = formatBookingId(booking);

  const shareMessage = `Yatra Booking Confirmed!\n\nHi ${user.name},\nYour booking with ShraddhaYatra Trust for the "${trip.title}" is confirmed.\n\n*Trip Details:*\n- *Date:* ${formattedDate}\n- *Time:* ${trip.time}\n- *From:* ${trip.from_station}\n- *To:* ${trip.to_station}\n- *Train No:* ${trip.train_no}\n- *Platform:* ${trip.platform}\n\n*Booking Info:*\n- *Seats:* ${booking.seat_count}\n- *Booking ID:* ${formattedBookingId}\n\n*Important:* Please reach the station 10 minutes early.\n\nWe wish you a blessed journey!`;

  const whatsappLink = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareMessage)}`;

  return (
    <div ref={cardRef} className="bg-white rounded-lg shadow-2xl max-w-2xl mx-auto my-8 p-6 md:p-8 border-4 border-amber-400 printable-card">
      <div className="text-center mb-6 border-b-2 border-dashed border-amber-300 pb-4">
        <img src={logoUrl} alt="ShraddhaYatra Trust Logo" className="mx-auto h-24 w-auto mb-4" />
        <h2 className="text-3xl font-bold text-orange-800">ShraddhaYatra Trust</h2>
        <p className="text-orange-600">Yatra Booking Confirmation</p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6 mb-6">
        <div className="md:col-span-2">
          <h3 className="text-2xl font-bold text-orange-900 mb-2">{trip.title}</h3>
          <p className="text-gray-700 font-medium">Passenger: <span className="font-bold">{user.name}</span></p>
          <p className="text-gray-700 font-medium">Seats: <span className="font-bold">{booking.seat_count}</span></p>
          <p className="text-gray-700 font-medium">Booking ID: <span className="font-bold">{formattedBookingId}</span></p>
        </div>
        <div className="flex items-center justify-center">
            <img src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=BookingID:${formattedBookingId}-TripID:${trip.id}`} alt="QR Code" />
        </div>
      </div>

      <div className="space-y-4 text-gray-800">
        <div className="grid grid-cols-2 gap-4 bg-amber-50 p-3 rounded-md">
          <div><strong>From:</strong><br/>{trip.from_station}</div>
          <div><strong>To:</strong><br/>{trip.to_station}</div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div><strong>Date:</strong><br/>{formattedDate}</div>
          <div><strong>Time:</strong><br/>{trip.time}</div>
          <div><strong>Train No:</strong><br/>{trip.train_no}</div>
          <div><strong>Platform:</strong><br/>{trip.platform}</div>
        </div>
      </div>
      
      <div className="print-grow" />

      <div className="mt-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-md">
        <p className="font-bold">Important Note:</p>
        <p>Please reach the station at least 10 minutes early to avoid any last-minute hassle.</p>
      </div>
      
      <div className="mt-8 flex flex-col md:flex-row gap-4 justify-center print-hide">
        <a 
          href={whatsappLink}
          target="_blank" 
          rel="noopener noreferrer"
          className="w-full md:w-auto flex items-center justify-center gap-2 bg-green-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-600 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M10.363 3.036a7.5 7.5 0 10-7.327 9.45l.93 3.518-3.605-.945a7.5 7.5 0 005.004 5.004l3.518.93-3.08-3.08a7.5 7.5 0 004.55-14.887zM10 16a6 6 0 110-12 6 6 0 010 12z" /><path d="M11.693 7.307a.999.999 0 00-1.414 0l-3 3a.999.999 0 101.414 1.414L10 10.414l1.293 1.293a.999.999 0 101.414-1.414l-2-2z" /></svg>
          Share on WhatsApp
        </a>
        <button 
          onClick={handlePrint}
          className="w-full md:w-auto flex items-center justify-center gap-2 bg-orange-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-orange-600 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" /></svg>
          Print / Save PDF
        </button>
      </div>
    </div>
  );
};

export default BookingDetailsCard;