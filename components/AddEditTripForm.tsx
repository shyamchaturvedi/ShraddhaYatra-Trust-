import React, { useState } from 'react';
import { Trip, TripStatus, User } from '../types';
import Spinner from './Spinner';
import { uploadImage } from '../services/supabaseClient';


interface AddEditTripFormProps {
  trip: Trip | null;
  currentUser: User;
  onSave: (tripData: Omit<Trip, 'id'> | Trip) => void;
  onClose: () => void;
}

const AddEditTripForm: React.FC<AddEditTripFormProps> = ({ trip, currentUser, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    title: trip?.title || '',
    description: trip?.description || '',
    date: trip?.date || '',
    time: trip?.time || '',
    from_station: trip?.from_station || '',
    to_station: trip?.to_station || '',
    platform: trip?.platform || '',
    train_no: trip?.train_no || '',
    ticket_price: trip?.ticket_price || 0,
    food_price: trip?.food_price || 0,
    food_option: trip?.food_option || false,
    notes: trip?.notes || '',
    image_url: trip?.image_url || '/images/trips/default.jpg',
    status: trip?.status || TripStatus.UPCOMING,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(trip?.image_url || null);


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
        const { checked } = e.target as HTMLInputElement;
        setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
        setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    let finalImageUrl = formData.image_url;
    if (selectedFile) {
        const { data, error } = await uploadImage(selectedFile, currentUser.id);
        if (error) {
            alert('Image upload failed. Please try again.');
            setIsLoading(false);
            return;
        }
        finalImageUrl = data.publicUrl;
    }

    const tripDataToSave = { ...formData, image_url: finalImageUrl };

    if (trip) {
      onSave({ ...tripDataToSave, id: trip.id });
    } else {
      onSave(tripDataToSave);
    }
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-amber-900 mb-4">{trip ? 'Edit Trip' : 'Add New Trip'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white">
                {Object.values(TripStatus).map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <input type="date" name="date" value={formData.date} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Time</label>
              <input type="time" name="time" value={formData.time} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">From Station</label>
              <input type="text" name="from_station" value={formData.from_station} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">To Station</label>
              <input type="text" name="to_station" value={formData.to_station} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Train No.</label>
              <input type="text" name="train_no" value={formData.train_no} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Platform</label>
              <input type="text" name="platform" value={formData.platform} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Ticket Price (₹)</label>
              <input type="number" name="ticket_price" value={formData.ticket_price} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Food Price (₹)</label>
              <input type="number" name="food_price" value={formData.food_price} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
            </div>
          </div>
           <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Notes</label>
              <textarea name="notes" value={formData.notes} onChange={handleChange} rows={2} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"></textarea>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Trip Image</label>
                <div className="mt-1 flex items-center gap-4">
                    {imagePreview && <img src={imagePreview} alt="Trip preview" className="w-32 h-20 object-cover rounded" />}
                    <input type="file" onChange={handleFileChange} accept="image/*" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"/>
                </div>
            </div>
             <div className="flex items-center">
                <input type="checkbox" name="food_option" checked={formData.food_option} onChange={handleChange} className="h-4 w-4 text-orange-600 border-gray-300 rounded" />
                <label className="ml-2 block text-sm text-gray-900">Food Option Available</label>
            </div>
          <div className="flex justify-end items-center gap-4 mt-6">
            {isLoading && <Spinner />}
            <button type="button" onClick={onClose} disabled={isLoading} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 disabled:opacity-50">Cancel</button>
            <button type="submit" disabled={isLoading} className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50">{trip ? 'Save Changes' : 'Add Trip'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditTripForm;