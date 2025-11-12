import React, { useState, useEffect } from 'react';
import { AboutContent, ContactContent } from '../../types';
import { supabase, uploadImage } from '../../services/supabaseClient';
import Spinner from '../Spinner';

interface SiteContentTabProps {
    aboutContent: AboutContent;
    contactContent: ContactContent;
    upiId: string;
    siteLogoUrl: string;
    onAdminAction: (action: PromiseLike<any>, successMsg: string, errorMsg: string) => void;
}

const SiteContentTab: React.FC<SiteContentTabProps> = ({ aboutContent, contactContent, upiId, siteLogoUrl, onAdminAction }) => {
    const [currentUpi, setCurrentUpi] = useState(upiId);
    const [currentAbout, setCurrentAbout] = useState(aboutContent);
    const [currentContact, setCurrentContact] = useState(contactContent);
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(siteLogoUrl);
    const [isLogoUploading, setIsLogoUploading] = useState(false);

    useEffect(() => {
        setLogoPreview(siteLogoUrl);
    }, [siteLogoUrl]);
    
    const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setLogoFile(file);
            setLogoPreview(URL.createObjectURL(file));
        }
    };
    
    const handleLogoUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!logoFile) {
            alert("Please select a new logo file to upload.");
            return;
        }
        setIsLogoUploading(true);
        const { data, error } = await uploadImage(logoFile);

        if (error) {
            alert('Logo upload failed: ' + error.message);
            setIsLogoUploading(false);
            return;
        }
        
        await onAdminAction(
            supabase.from('config').update({ value: data.publicUrl }).eq('key', 'site_logo_url'),
            'Site logo updated successfully.',
            'Error updating site logo'
        );
        setIsLogoUploading(false);
        setLogoFile(null);
    };

    const handleUpiUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        onAdminAction(
            supabase.from('config').update({ value: currentUpi }).eq('key', 'upi_id'),
            'UPI ID updated.',
            'Error updating UPI ID'
        );
    };

    const handleAboutUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        onAdminAction(
            supabase.from('config').update({ value: currentAbout }).eq('key', 'about_content'),
            'About content updated.',
            'Error updating about content'
        );
    };
    
    const handleContactUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        onAdminAction(
            supabase.from('config').update({ value: currentContact }).eq('key', 'contact_content'),
            'Contact details updated.',
            'Error updating contact details'
        );
    };

    return (
        <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-2xl font-semibold text-orange-700 mb-4">Site Logo</h3>
                <form onSubmit={handleLogoUpdate} className="space-y-4">
                    <div className="flex items-center gap-4">
                        {logoPreview && <img src={logoPreview} alt="Logo preview" className="h-16 w-auto bg-gray-100 p-1 rounded-md border" />}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Upload New Logo</label>
                            <input 
                                type="file" 
                                onChange={handleLogoFileChange} 
                                accept="image/png, image/jpeg, image/svg+xml" 
                                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                            />
                        </div>
                    </div>
                    <div className="text-right flex items-center justify-end gap-4">
                        {isLogoUploading && <Spinner />}
                        <button type="submit" className="px-6 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50" disabled={isLogoUploading || !logoFile}>
                            Update Logo
                        </button>
                    </div>
                </form>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-2xl font-semibold text-orange-700 mb-4">About Us Page Content</h3>
                <form onSubmit={handleAboutUpdate} className="space-y-4">
                    <input type="text" value={currentAbout.mainTitle} onChange={e => setCurrentAbout(p => ({...p, mainTitle: e.target.value}))} className="w-full p-2 border rounded" />
                    <textarea value={currentAbout.body} onChange={e => setCurrentAbout(p => ({...p, body: e.target.value}))} rows={4} className="w-full p-2 border rounded" />
                    <div className="text-right"><button type="submit" className="px-6 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700">Update About Content</button></div>
                </form>
            </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-2xl font-semibold text-orange-700 mb-4">Contact & Donation Details</h3>
                    <form onSubmit={handleContactUpdate} className="space-y-4 mb-6">
                        <input type="text" value={currentContact.address} onChange={e => setCurrentContact(p => ({...p, address: e.target.value}))} className="w-full p-2 border rounded" />
                        <input type="text" value={currentContact.phone} onChange={e => setCurrentContact(p => ({...p, phone: e.target.value}))} className="w-full p-2 border rounded" />
                        <input type="email" value={currentContact.email} onChange={e => setCurrentContact(p => ({...p, email: e.target.value}))} className="w-full p-2 border rounded" />
                        <div>
                        <label className="block text-sm font-medium text-gray-700">WhatsApp Number for Enquiries</label>
                        <input 
                            type="tel" 
                            placeholder="e.g., 919876543210"
                            value={currentContact.whatsapp_number || ''} 
                            onChange={e => setCurrentContact(p => ({...p, whatsapp_number: e.target.value}))} 
                            className="w-full p-2 border rounded mt-1" />
                        </div>
                        <div className="text-right"><button type="submit" className="px-6 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700">Update Contact Details</button></div>
                </form>
                <form onSubmit={handleUpiUpdate} className="space-y-4 pt-6 border-t">
                    <label className="block text-sm font-medium text-gray-700">UPI ID for Donations</label>
                    <input type="text" value={currentUpi} onChange={(e) => setCurrentUpi(e.target.value)} className="w-full p-2 border rounded" required />
                    <div className="text-right"><button type="submit" className="px-6 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700">Update UPI ID</button></div>
                </form>
            </div>
        </div>
    );
};

export default SiteContentTab;