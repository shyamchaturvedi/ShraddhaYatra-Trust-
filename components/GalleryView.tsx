
import React, { useMemo } from 'react';
import { Trip, GalleryImage } from '../types';

interface GalleryViewProps {
  trips: Trip[];
  images: GalleryImage[];
}

const GalleryView: React.FC<GalleryViewProps> = ({ trips, images }) => {
    const tripsWithImages = useMemo(() => {
        const completedTrips = trips.filter(trip => images.some(img => img.tripId === trip.id));
        return completedTrips.map(trip => ({
            ...trip,
            images: images.filter(img => img.tripId === trip.id),
        }));
    }, [trips, images]);

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8">
            <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-extrabold text-amber-900 tracking-tight">Yatra Memories</h2>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-orange-800">Relive the divine moments from our completed spiritual journeys.</p>
            </div>

            {tripsWithImages.length > 0 ? (
                <div className="space-y-12">
                    {tripsWithImages.map(trip => (
                        <div key={trip.id}>
                            <h3 className="text-3xl font-bold text-orange-700 mb-6 border-b-2 border-amber-200 pb-2">{trip.title}</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {trip.images.map(image => (
                                    <div key={image.id} className="group relative overflow-hidden rounded-lg shadow-lg">
                                        <img src={image.imageUrl} alt={image.caption} className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-500 ease-in-out" />
                                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300">
                                            <div className="absolute bottom-0 left-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out">
                                                <p className="text-white text-md font-semibold">{image.caption}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-600 text-xl">Our gallery is currently empty. Check back after our next successful yatra!</p>
            )}
        </div>
    );
};

export default GalleryView;
