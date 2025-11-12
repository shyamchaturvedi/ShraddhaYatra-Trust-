import React, { useState } from 'react';
import { GalleryImage, Trip, TripStatus } from '../../types';
import Spinner from '../Spinner';
import { uploadImage, supabase } from '../../services/supabaseClient';


interface GalleryManagementTabProps {
    galleryImages: GalleryImage[];
    trips: Trip[];
    // Fix: Changed `Promise<any>` to `PromiseLike<any>` to correctly type Supabase's "thenable" query builders.
    onAdminAction: (action: PromiseLike<any>, successMsg: string, errorMsg: string) => void;
}

const GalleryManagementTab: React.FC<GalleryManagementTabProps> = ({ galleryImages, trips, onAdminAction }) => {
    const [galleryFile, setGalleryFile] = useState<File | null>(null);
    const [galleryCaption, setGalleryCaption] = useState('');
    const [galleryTripId, setGalleryTripId] = useState<number | ''>('');
    const [isUploading, setIsUploading] = useState(false);
    
    const completedTrips = trips.filter(t => t.status === TripStatus.COMPLETED);

    const handleGallerySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!galleryFile || !galleryCaption || !galleryTripId) {
            alert('Please fill all fields for the gallery image.');
            return;
        }
        setIsUploading(true);
        const { data, error } = await uploadImage(galleryFile);
        if (error) {
            alert('Image upload failed.');
            setIsUploading(false);
            return;
        }
        await onAdminAction(
            supabase.from('gallery').insert({
                tripId: galleryTripId,
                caption: galleryCaption,
                imageUrl: data.publicUrl
            }),
            'Image added to gallery.',
            'Error adding image'
        );
        setGalleryFile(null);
        setGalleryCaption('');
        setGalleryTripId('');
        (e.target as HTMLFormElement).reset();
        setIsUploading(false);
    };

    const handleDeleteGalleryImage = (imageId: number) => {
        onAdminAction(
            supabase.from('gallery').delete().eq('id', imageId),
            'Image deleted from gallery.',
            'Error deleting image'
        );
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold text-orange-700 mb-4">Manage Gallery</h3>
            <form onSubmit={handleGallerySubmit} className="mb-8 p-4 border rounded-lg space-y-4">
                <h4 className="font-semibold text-lg text-amber-800">Add New Image</h4>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Image File</label>
                    <input type="file" onChange={(e) => setGalleryFile(e.target.files ? e.target.files[0] : null)} accept="image/*" required className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100" />
                </div>
                <div>
                        <label className="block text-sm font-medium text-gray-700">Link to Trip</label>
                        <select value={galleryTripId} onChange={e => setGalleryTripId(Number(e.target.value))} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white">
                        <option value="" disabled>Select a completed trip</option>
                        {completedTrips.map(trip => <option key={trip.id} value={trip.id}>{trip.title}</option>)}
                        </select>
                </div>
                    <div>
                    <label className="block text-sm font-medium text-gray-700">Caption</label>
                    <input type="text" value={galleryCaption} onChange={e => setGalleryCaption(e.target.value)} required placeholder="E.g., Devotees at the Ganga Aarti" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                </div>
                <div className="text-right flex items-center justify-end gap-4">
                    {isUploading && <Spinner />}
                    <button type="submit" disabled={isUploading} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50">Upload Image</button>
                </div>
            </form>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-amber-100"><tr><th className="p-3 font-semibold text-orange-900">Image</th><th className="p-3 font-semibold text-orange-900">Caption</th><th className="p-3 font-semibold text-orange-900">Trip</th><th className="p-3 font-semibold text-orange-900">Action</th></tr></thead>
                    <tbody>
                        {galleryImages.map(img => (
                            <tr key={img.id} className="border-b">
                                <td className="p-2"><img src={img.imageUrl} alt={img.caption} className="w-24 h-16 object-cover rounded"/></td>
                                <td className="p-2">{img.caption}</td>
                                <td className="p-2">{trips.find(t => t.id === img.tripId)?.title || 'N/A'}</td>
                                <td className="p-2"><button onClick={() => handleDeleteGalleryImage(img.id)} className="bg-red-600 text-white px-3 py-1 text-sm rounded hover:bg-red-700">Delete</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default GalleryManagementTab;