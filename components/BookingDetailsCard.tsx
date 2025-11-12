

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
    <div ref={cardRef} className="bg-white rounded-lg shadow-2xl max-w-2xl mx-auto my-8 p-6 md:p-8 border border-gray-200">
      <div className="text-center mb-6 border-b border-dashed border-gray-300 pb-4">
        <img src={logoUrl} alt="ShraddhaYatra Trust Logo" className="mx-auto h-20 w-auto mb-3" />
        <h2 className="text-3xl font-bold text-gray-800">ShraddhaYatra Trust</h2>
        <p className="text-gray-500">Yatra Booking Confirmation</p>
      </div>
      
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">{trip.title}</h3>
          <div className="space-y-1 text-gray-600">
            <p>Passenger: <span className="font-semibold text-gray-800">{user.name}</span></p>
            <p>Seats: <span className="font-semibold text-gray-800">{booking.seat_count}</span></p>
            <p>Booking ID: <span className="font-semibold text-gray-800">{formattedBookingId}</span></p>
          </div>
        </div>
        <div className="flex-shrink-0">
            <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&qzone=1&data=BookingID:${formattedBookingId}-TripID:${trip.id}`} alt="QR Code" />
        </div>
      </div>

      <div className="bg-gray-100 p-4 rounded-lg mb-6 flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-500">From</p>
          <p className="font-semibold text-gray-800 text-lg">{trip.from_station}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">To</p>
          <p className="font-semibold text-gray-800 text-lg">{trip.to_station}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-2 mb-4">
        <div>
          <p className="text-sm text-gray-500">Date</p>
          <p className="font-semibold text-gray-800">{formattedDate}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Time</p>
          <p className="font-semibold text-gray-800">{trip.time}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Train No:</p>
          <p className="font-semibold text-gray-800">{trip.train_no}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Platform:</p>
          <p className="font-semibold text-gray-800">{trip.platform}</p>
        </div>
      </div>
      
      <div className="print-grow" />

      <div className="mt-6 p-4 bg-gray-100 rounded-lg">
        <p className="font-bold text-gray-800">Important Note:</p>
        <p className="text-gray-600">Please reach the station at least 10 minutes early to avoid any last-minute hassle.</p>
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