

import React, { useRef } from 'react';
import { Booking, Trip, User } from '../types';

// Add this for TypeScript to recognize libraries from script tags
declare global {
  interface Window {
    html2canvas: any;
    jspdf: any;
  }
}

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

  const formattedDate = formatDate(trip.date);
  const formattedBookingId = formatBookingId(booking);

  const handleDownloadPng = () => {
    const cardElement = cardRef.current;
    if (!cardElement) return;
    
    if (typeof window.html2canvas === 'undefined') {
        alert('Download feature is currently unavailable. Please try again later.');
        return;
    }
    
    // Find the button container to hide it during capture
    const buttonContainer = cardElement.querySelector('.print-hide') as HTMLElement;
    
    // Hide buttons before capture
    if(buttonContainer) buttonContainer.style.display = 'none';

    window.html2canvas(cardElement, {
      scale: 2, // For higher resolution
      useCORS: true, // To capture the external QR code image
      backgroundColor: '#ffffff', // Ensure a solid white background
    }).then((canvas: HTMLCanvasElement) => {
        // Show buttons again after capture
        if(buttonContainer) buttonContainer.style.display = 'flex';

        const image = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = image;
        link.download = `Shraddha-Yatra-Booking-${formattedBookingId}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }).catch((err: any) => {
        // Ensure buttons are shown again on error
        if(buttonContainer) buttonContainer.style.display = 'flex';
        console.error("Error generating ticket image:", err);
        alert('An error occurred while generating the ticket image.');
    });
  };

  const handleDownloadPdf = () => {
    const cardElement = cardRef.current;
    if (!cardElement) return;
    
    if (typeof window.html2canvas === 'undefined' || typeof window.jspdf === 'undefined') {
        alert('Download feature is currently unavailable. Please try again later.');
        return;
    }

    const buttonContainer = cardElement.querySelector('.print-hide') as HTMLElement;
    
    // Hide buttons before capture
    if(buttonContainer) buttonContainer.style.display = 'none';

    window.html2canvas(cardElement, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
    }).then((canvas: HTMLCanvasElement) => {
        // Show buttons again after capture
        if(buttonContainer) buttonContainer.style.display = 'flex';

        const imgData = canvas.toDataURL('image/png');
        const pdf = new window.jspdf.jsPDF({
            orientation: 'p',
            unit: 'mm',
            format: 'a4'
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        
        // Calculate aspect ratio
        const ratio = canvasWidth / canvasHeight;
        
        // Scale image to fit within A4 page with a 10mm margin on all sides
        let finalWidth = pdfWidth - 20;
        let finalHeight = finalWidth / ratio;
        
        // If calculated height is greater than page height, scale based on height instead
        if (finalHeight > pdfHeight - 20) {
            finalHeight = pdfHeight - 20;
            finalWidth = finalHeight * ratio;
        }
        
        // Center the image on the page
        const x = (pdfWidth - finalWidth) / 2;
        const y = (pdfHeight - finalHeight) / 2;

        pdf.addImage(imgData, 'PNG', x, y, finalWidth, finalHeight);
        pdf.save(`Shraddha-Yatra-Booking-${formattedBookingId}.pdf`);

    }).catch((err: any) => {
        // Ensure buttons are shown again on error
        if(buttonContainer) buttonContainer.style.display = 'flex';
        console.error("Error generating ticket PDF:", err);
        alert('An error occurred while generating the ticket PDF.');
    });
  };


  const shareMessage = `Yatra Booking Confirmed!\n\nHi ${user.name},\nYour booking with Shraddha Yatra Trust for the "${trip.title}" is confirmed.\n\n*Trip Details:*\n- *Date:* ${formattedDate}\n- *Time:* ${trip.time}\n- *From:* ${trip.from_station}\n- *To:* ${trip.to_station}\n- *Train No:* ${trip.train_no}\n- *Platform:* ${trip.platform}\n\n*Booking Info:*\n- *Seats:* ${booking.seat_count}\n- *Booking ID:* ${formattedBookingId}\n\n*Important:* Please reach the station 10 minutes early.\n\nWe wish you a blessed journey!`;

  const whatsappLink = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareMessage)}`;

  return (
    <div ref={cardRef} className="bg-white rounded-lg shadow-2xl max-w-2xl mx-auto my-8 p-6 md:p-8 border border-gray-200">
      <div className="text-center mb-6 border-b border-dashed border-gray-300 pb-4">
        <img src={logoUrl} alt="Shraddha Yatra Trust Logo" className="mx-auto h-20 w-auto mb-3" />
        <h2 className="text-3xl font-bold text-gray-800">Shraddha Yatra Trust</h2>
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
          onClick={handleDownloadPng}
          className="w-full md:w-auto flex items-center justify-center gap-2 bg-orange-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-orange-600 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 9.707a1 1 0 011.414 0L9 11.001V3a1 1 0 112 0v8.001l1.293-1.294a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          Download PNG
        </button>
        <button 
          onClick={handleDownloadPdf}
          className="w-full md:w-auto flex items-center justify-center gap-2 bg-red-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-red-700 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 9.707a1 1 0 011.414 0L9 11.001V3a1 1 0 112 0v8.001l1.293-1.294a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          Download PDF
        </button>
      </div>
    </div>
  );
};

export default BookingDetailsCard;