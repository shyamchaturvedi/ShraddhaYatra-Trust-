import React, { useState } from 'react';
import { Testimonial } from '../../types';
import Spinner from '../Spinner';
import { uploadImage, supabase } from '../../services/supabaseClient';

interface TestimonialManagementTabProps {
    testimonials: Testimonial[];
    // Fix: Changed `Promise<any>` to `PromiseLike<any>` to correctly type Supabase's "thenable" query builders.
    onAdminAction: (action: PromiseLike<any>, successMsg: string, errorMsg: string) => void;
}

const TestimonialManagementTab: React.FC<TestimonialManagementTabProps> = ({ testimonials, onAdminAction }) => {
    const [testimonialFile, setTestimonialFile] = useState<File | null>(null);
    const [testimonialAuthor, setTestimonialAuthor] = useState('');
    const [testimonialLocation, setTestimonialLocation] = useState('');
    const [testimonialMessage, setTestimonialMessage] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    const handleTestimonialSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if(!testimonialFile || !testimonialAuthor || !testimonialMessage) {
            alert('Please provide an image, author name, and message.');
            return;
        }
        setIsUploading(true);
        const { data, error } = await uploadImage(testimonialFile);
        if (error) {
            alert('Testimonial image upload failed.');
            setIsUploading(false);
            return;
        }
        
        await onAdminAction(
            supabase.from('testimonials').insert({
                author_name: testimonialAuthor,
                author_location: testimonialLocation,
                message: testimonialMessage,
                author_image_url: data.publicUrl
            }),
            'Testimonial added successfully.',
            'Error adding testimonial'
        );

        setTestimonialFile(null);
        setTestimonialAuthor('');
        setTestimonialLocation('');
        setTestimonialMessage('');
        (e.target as HTMLFormElement).reset();
        setIsUploading(false);
    };

     const handleDeleteTestimonial = (testimonialId: number) => {
        onAdminAction(
            supabase.from('testimonials').delete().eq('id', testimonialId),
            'Testimonial deleted successfully.',
            'Error deleting testimonial'
        );
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold text-orange-700 mb-4">Manage Testimonials</h3>
            <form onSubmit={handleTestimonialSubmit} className="mb-8 p-4 border rounded-lg space-y-4">
                <h4 className="font-semibold text-lg text-amber-800">Add New Testimonial</h4>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Author's Image</label>
                    <input type="file" onChange={(e) => setTestimonialFile(e.target.files ? e.target.files[0] : null)} accept="image/*" required className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100" />
                </div>
                    <div>
                    <label className="block text-sm font-medium text-gray-700">Author's Name</label>
                    <input type="text" value={testimonialAuthor} onChange={e => setTestimonialAuthor(e.target.value)} required placeholder="E.g., Priya Singh" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Author's Location (Optional)</label>
                    <input type="text" value={testimonialLocation} onChange={e => setTestimonialLocation(e.target.value)} placeholder="E.g., Mumbai" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                </div>
                    <div>
                    <label className="block text-sm font-medium text-gray-700">Message</label>
                    <textarea value={testimonialMessage} onChange={e => setTestimonialMessage(e.target.value)} required rows={4} placeholder="Write the testimonial message here..." className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                </div>
                <div className="text-right flex items-center justify-end gap-4">
                    {isUploading && <Spinner />}
                    <button type="submit" disabled={isUploading} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50">Add Testimonial</button>
                </div>
            </form>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-amber-100"><tr><th className="p-3 font-semibold text-orange-900">Image</th><th className="p-3 font-semibold text-orange-900">Author</th><th className="p-3 font-semibold text-orange-900">Message</th><th className="p-3 font-semibold text-orange-900">Action</th></tr></thead>
                    <tbody>
                        {testimonials.map(t => (
                            <tr key={t.id} className="border-b">
                                <td className="p-2"><img src={t.author_image_url} alt={t.author_name} className="w-16 h-16 object-cover rounded-full"/></td>
                                <td className="p-2">{t.author_name}<br/><span className="text-sm text-gray-500">{t.author_location}</span></td>
                                <td className="p-2 text-sm">{t.message}</td>
                                <td className="p-2"><button onClick={() => handleDeleteTestimonial(t.id)} className="bg-red-600 text-white px-3 py-1 text-sm rounded hover:bg-red-700">Delete</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TestimonialManagementTab;