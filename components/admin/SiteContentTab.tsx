import React, { useState } from 'react';
import { AboutContent, ContactContent, User } from '../../types';
import { supabase } from '../../services/supabaseClient';

interface SiteContentTabProps {
    aboutContent: AboutContent;
    contactContent: ContactContent;
    upiId: string;
    siteLogoUrl: string;
    currentUser: User;
    onAdminAction: (action: PromiseLike<any>, successMsg: string, errorMsg: string) => void;
}

const SiteContentTab: React.FC<SiteContentTabProps> = ({ aboutContent, contactContent, upiId, siteLogoUrl, currentUser, onAdminAction }) => {
    const [currentUpi, setCurrentUpi] = useState(upiId);
    const [currentAbout, setCurrentAbout] = useState(aboutContent);
    const [currentContact, setCurrentContact] = useState(contactContent);
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(siteLogoUrl);
    const [isUploadingLogo, setIsUploadingLogo] = useState(false);

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
            alert('Please select a new logo file.');
            return;
        }
        setIsUploadingLogo(true);
        
        const fileExt = logoFile.name.split('.').pop();
        const filePath = `config/logo.${fileExt}`;

        const { error: uploadError } = await supabase.storage
            .from('images')
            .upload(filePath, logoFile, { upsert: true });

        if (uploadError) {
            onAdminAction(Promise.reject(uploadError), '', 'Error uploading logo');
            setIsUploadingLogo(false);
            return;
        }

        const { data } = supabase.storage.from('images').getPublicUrl(filePath);
        
        // Add a timestamp to the URL to bypass browser cache
        const newLogoUrl = `${data.publicUrl}?t=${new Date().getTime()}`;

        await onAdminAction(
            supabase.from('config').upsert({ key: 'site_logo_url', value: newLogoUrl }),
            'Site logo updated successfully.',
            'Error updating site logo URL in database'
        );
        
        setLogoFile(null);
        setIsUploadingLogo(false);
    };

    return (
        <div className="space-y-8">
             <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-2xl font-semibold text-orange-700 mb-4">Site Branding</h3>
                <form onSubmit={handleLogoUpdate} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Site Logo</label>
                        <div className="mt-2 flex items-center gap-4">
                            <img src={logoPreview || '/images/logo.png'} alt="Current site logo" className="h-24 w-auto bg-white p-2 rounded shadow border"/>
                            <input 
                                type="file" 
                                onChange={handleLogoFileChange} 
                                accept="image/png, image/jpeg, image/svg+xml"
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                            />
                        </div>
                    </div>
                    <div className="text-right">
                        <button type="submit" className="px-6 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50" disabled={!logoFile || isUploadingLogo}>
                            {isUploadingLogo ? 'Uploading...' : 'Update Logo'}
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