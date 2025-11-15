import React, { useState, useEffect } from 'react';
import { User, ToastType } from '../types';
import IDCard from './IDCard';
import Spinner from './Spinner';
import { uploadImage } from '../services/supabaseClient';

declare global {
  interface Window {
    html2canvas: any;
    jspdf: any;
  }
}

interface ProfileViewProps {
  user: User;
  onUpdateUser: (userId: string, updatedData: Partial<User>) => void;
  onChangePassword: (newPassword: string) => Promise<boolean>;
  logoUrl: string;
  addToast: (message: string, type: ToastType) => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ user, onUpdateUser, onChangePassword, logoUrl, addToast }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<Partial<User>>({});
    const [passwordData, setPasswordData] = useState({ newPassword: '', confirmPassword: '' });
    
    const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
    const [profileImagePreview, setProfileImagePreview] = useState<string | null>(user.profile_image_url || null);
    const [govIdFile, setGovIdFile] = useState<File | null>(null);
    const [govIdPreview, setGovIdPreview] = useState<string | null>(user.gov_id_image_url || null);

    const [isSaving, setIsSaving] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);

    useEffect(() => {
        setFormData({
            name: user.name,
            phone: user.phone,
            dob: user.dob ? new Date(user.dob).toISOString().split('T')[0] : '',
            address: user.address,
            blood_group: user.blood_group,
            emergency_contact_name: user.emergency_contact_name,
            emergency_contact_phone: user.emergency_contact_phone,
            gov_id_type: user.gov_id_type,
            gov_id_number: user.gov_id_number,
        });
        setProfileImagePreview(user.profile_image_url || null);
        setGovIdPreview(user.gov_id_image_url || null);
    }, [user, isEditing]);

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handlePasswordFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasswordData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };
    
    const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setProfileImageFile(file);
            setProfileImagePreview(URL.createObjectURL(file));
        }
    };
    
    const handleGovIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
         if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setGovIdFile(file);
            setGovIdPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        const updatedData = { ...formData };
        try {
            if (profileImageFile) {
                const { data, error } = await uploadImage(profileImageFile, user.id);
                if (error) throw new Error("Profile image upload failed.");
                updatedData.profile_image_url = data.publicUrl;
            }
            if (govIdFile) {
                const { data, error } = await uploadImage(govIdFile, user.id);
                if (error) throw new Error("Government ID upload failed.");
                updatedData.gov_id_image_url = data.publicUrl;
            }
            onUpdateUser(user.id, updatedData);
            setIsEditing(false);
        } catch (error: any) {
            addToast(error.message, 'error');
        } finally {
            setIsSaving(false);
        }
    };
    
    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            addToast("New passwords do not match.", "error"); return;
        }
        if(passwordData.newPassword.length < 6) {
            addToast("Password must be at least 6 characters long.", "error"); return;
        }
        setIsChangingPassword(true);
        const success = await onChangePassword(passwordData.newPassword);
        if (success) setPasswordData({ newPassword: '', confirmPassword: '' });
        setIsChangingPassword(false);
    };

    const handleDownloadIdCard = async () => {
        setIsDownloading(true);

        const cardElement = document.getElementById("id-card-capture");
        if (!cardElement || !window.html2canvas || !window.jspdf) {
            addToast("Download feature not ready. Please try again later.", "error");
            setIsDownloading(false);
            return;
        }

        try {
            const { jsPDF } = window.jspdf;

            // --- High-Quality Rendering Logic ---
            const CARD_WIDTH_IN = 3.375;  // Standard ID card width in inches (CR80 size)
            const CARD_HEIGHT_IN = 2.125; // Standard ID card height in inches
            const DPI = 300;              // Target DPI for print quality

            // The card element is designed at 96 CSS pixels per inch (324px / 3.375in = 96).
            // To render at 300 DPI, we need to scale the canvas capture accordingly.
            const scale = DPI / 96;

            const canvas = await window.html2canvas(cardElement, {
                scale: scale,
                useCORS: true,       // Required for external images (QR, profile pics)
                backgroundColor: "#ffffff",
            });

            const imgData = canvas.toDataURL("image/png", 1.0);

            // --- PDF Creation ---
            // Create a PDF document with the exact dimensions of a standard ID card in landscape.
            const pdf = new jsPDF({
                orientation: "landscape",
                unit: "in",
                format: [CARD_WIDTH_IN, CARD_HEIGHT_IN]
            });

            // Add the captured image to the PDF, filling the entire page without margins.
            pdf.addImage(
                imgData,
                "PNG",
                0,
                0,
                CARD_WIDTH_IN,
                CARD_HEIGHT_IN,
                undefined, // alias
                "FAST"     // compression
            );

            const memberId = `SYT-${String(user.id).substring(0, 8).toUpperCase()}`;
            pdf.save(`Shraddha-Yatra-ID-Card-${memberId}.pdf`);

        } catch (err: any) {
            console.error("PDF generation error:", err);
            addToast("An error occurred while generating the ID Card PDF.", "error");
        } finally {
            setIsDownloading(false);
        }
    };

    const renderDisplayInfo = () => (
      <div className="space-y-4">
        <InfoItem label="Full Name" value={user.name} />
        <InfoItem label="Phone Number" value={user.phone} />
        <InfoItem label="Date of Birth" value={user.dob ? new Date(user.dob).toLocaleDateString('en-GB') : 'N/A'} />
        <InfoItem label="Blood Group" value={user.blood_group} />
        <InfoItem label="Address" value={user.address} />
        <InfoItem label="Emergency Contact" value={`${user.emergency_contact_name || 'N/A'} (${user.emergency_contact_phone || 'N/A'})`} />
        <InfoItem label="Government ID" value={`${user.gov_id_type || 'N/A'} - ${user.gov_id_number || 'N/A'}`} />
      </div>
    );
    
    const renderEditForm = () => (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput name="name" label="Full Name" value={formData.name || ''} onChange={handleFormChange} />
            <FormInput name="phone" label="Phone" value={formData.phone || ''} onChange={handleFormChange} disabled />
            <FormInput name="dob" label="Date of Birth" type="date" value={formData.dob || ''} onChange={handleFormChange} />
            <FormSelect name="blood_group" label="Blood Group" value={formData.blood_group || ''} onChange={handleFormChange} options={['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']} />
            <div className="md:col-span-2">
                <FormTextarea name="address" label="Address" value={formData.address || ''} onChange={handleFormChange} />
            </div>
            <FormInput name="emergency_contact_name" label="Emergency Contact Name" value={formData.emergency_contact_name || ''} onChange={handleFormChange} />
            <FormInput name="emergency_contact_phone" label="Emergency Contact Phone" value={formData.emergency_contact_phone || ''} onChange={handleFormChange} />
            <FormInput name="gov_id_type" label="Government ID Type" value={formData.gov_id_type || ''} onChange={handleFormChange} />
            <FormInput name="gov_id_number" label="Government ID Number" value={formData.gov_id_number || ''} onChange={handleFormChange} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            <ImageUploadField label="Profile Photo" preview={profileImagePreview} onChange={handleProfileImageChange} />
            <ImageUploadField label="Government ID Photo" preview={govIdPreview} onChange={handleGovIdChange} />
        </div>
        <div className="flex justify-end gap-4 mt-6">
            <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 bg-gray-200 rounded-md">Cancel</button>
            <button type="submit" disabled={isSaving} className="px-4 py-2 bg-orange-600 text-white rounded-md flex items-center disabled:opacity-50">
                {isSaving ? <><Spinner/> Saving...</> : 'Save Changes'}
            </button>
        </div>
      </form>
    );

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
            <h2 className="text-3xl font-bold text-amber-900 text-center">My Profile</h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-6 flex flex-col items-center">
                    <h3 className="text-2xl font-semibold text-orange-700">Devotee ID Card</h3>
                    <div className="p-2 bg-gray-100 rounded-lg inline-block">
                        <IDCard user={user} logoUrl={logoUrl} />
                    </div>
                    <button onClick={handleDownloadIdCard} disabled={isDownloading} className="w-full max-w-xs flex items-center justify-center gap-2 bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50">
                        {isDownloading ? <Spinner/> : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 9.707a1 1 0 011.414 0L9 11.001V3a1 1 0 112 0v8.001l1.293-1.294a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                                Download ID Card (PDF)
                            </>
                        )}
                    </button>
                </div>
                
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-2xl font-semibold text-orange-700">Personal Details</h3>
                            {!isEditing && <button onClick={() => setIsEditing(true)} className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600">Edit Profile</button>}
                        </div>
                        {isEditing ? renderEditForm() : renderDisplayInfo()}
                    </div>
                     <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-2xl font-semibold text-orange-700 mb-4">Change Password</h3>
                        <form onSubmit={handlePasswordSubmit} className="space-y-4">
                            <FormInput type="password" name="newPassword" label="New Password" value={passwordData.newPassword} onChange={handlePasswordFormChange} />
                            <FormInput type="password" name="confirmPassword" label="Confirm New Password" value={passwordData.confirmPassword} onChange={handlePasswordFormChange} />
                             <div className="text-right">
                                <button type="submit" disabled={isChangingPassword} className="px-4 py-2 bg-orange-600 text-white rounded-md flex items-center disabled:opacity-50">
                                    {isChangingPassword ? <><Spinner/> Changing...</> : 'Change Password'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Helper components for ProfileView
const InfoItem: React.FC<{ label: string; value?: string }> = ({ label, value }) => (
    <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="text-lg text-gray-800">{value || 'Not set'}</p>
    </div>
);

const FormInput: React.FC<any> = ({ label, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <input {...props} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
    </div>
);

const FormTextarea: React.FC<any> = ({ label, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <textarea {...props} rows={3} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
    </div>
);

const FormSelect: React.FC<any> = ({ label, options, ...props }) => (
     <div>
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <select {...props} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white">
            <option value="">Select...</option>
            {options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
        </select>
    </div>
);

const ImageUploadField: React.FC<{label: string, preview: string | null, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void}> = ({label, preview, onChange}) => (
    <div>
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <div className="mt-1 flex items-center gap-4">
            <img src={preview || 'https://via.placeholder.com/150'} alt="Preview" className="w-24 h-24 object-cover rounded-md border" />
            <input type="file" onChange={onChange} accept="image/*" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"/>
        </div>
    </div>
);

export default ProfileView;