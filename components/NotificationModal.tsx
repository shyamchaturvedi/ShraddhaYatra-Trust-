

import React, { useState } from 'react';
import { Trip, TripStatus } from '../types';

interface NotificationModalProps {
  trip: Trip;
  onClose: () => void;
  onSend: (trip: Trip, message: string, newDate?: string) => void;
}

type Template = 'reminder' | 'date_change' | 'cancellation' | 'custom';

const NotificationModal: React.FC<NotificationModalProps> = ({ trip, onClose, onSend }) => {
  const [template, setTemplate] = useState<Template>('reminder');
  const [customMessage, setCustomMessage] = useState('');
  const [newDate, setNewDate] = useState(trip.date);

  const generateMessage = () => {
    const header = `Update from Shraddha Yatra Trust regarding your trip: "${trip.title}"\n\n`;
    switch (template) {
      case 'reminder':
        return `${header}This is a friendly reminder that your journey is scheduled for tomorrow, ${new Date(trip.date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}. Please arrive at ${trip.from_station} by ${trip.time}. We wish you a blessed yatra!`;
      case 'date_change':
        return `${header}Important: The date for this trip has been changed. The new date is ${new Date(newDate).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}. All other details remain the same. We apologize for any inconvenience.`;
      case 'cancellation':
        return `${header}We regret to inform you that this trip has been cancelled due to unforeseen circumstances. A full refund will be processed shortly. We are sorry for the inconvenience and hope you will join us for a future yatra.`;
      case 'custom':
        return `${header}${customMessage}`;
    }
  };
  
  const handleSend = () => {
    const finalMessage = generateMessage();
    if(template === 'cancellation'){
        onSend({...trip, status: TripStatus.CANCELLED}, finalMessage);
    } else if (template === 'date_change' && newDate !== trip.date) {
        onSend(trip, finalMessage, newDate);
    } else {
        onSend(trip, finalMessage);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Notify Devotees for "{trip.title}"</h3>
        
        <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Notification Type</label>
              <select value={template} onChange={(e) => setTemplate(e.target.value as Template)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white">
                <option value="reminder">24-Hour Reminder</option>
                <option value="date_change">Date Change</option>
                <option value="cancellation">Trip Cancellation</option>
                <option value="custom">Custom Message</option>
              </select>
            </div>

            {template === 'date_change' && (
                <div>
                    <label className="block text-sm font-medium text-gray-700">New Trip Date</label>
                    <input type="date" value={newDate} onChange={e => setNewDate(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"/>
                </div>
            )}

            {template === 'custom' && (
                <div>
                    <label className="block text-sm font-medium text-gray-700">Custom Message</label>
                    <textarea value={customMessage} onChange={e => setCustomMessage(e.target.value)} rows={4} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="Enter your custom message here..."></textarea>
                </div>
            )}

            <div className="bg-amber-50 p-3 rounded-md border border-amber-200">
                <p className="text-sm font-semibold text-orange-800">Message Preview:</p>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{generateMessage()}</p>
            </div>
        </div>

        <div className="mt-6 flex justify-end gap-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
            Cancel
          </button>
          <button onClick={handleSend} className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700">
            Send Notification
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;