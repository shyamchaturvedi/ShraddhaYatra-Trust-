import React, { useState, useMemo } from 'react';
import { User, ToastType } from '../types';
import Spinner from './Spinner';
import { uploadImage } from '../services/supabaseClient';
import IDCard from './IDCard';

// Add this for TypeScript to recognize libraries from script tags
declare global {
  interface Window {
    html2canvas: any;
    jspdf: any;
  }
}

interface ProfileViewProps {
  user: User;
  onUpdateUser: (userId: string, updatedData: Partial<User>) => Promise<void>;
  onChangePassword: (newPassword: string) => Promise<boolean>;
  logoUrl: string;
  addToast: (message: string, type: ToastType) => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ user, onUpdateUser, onChangePassword, logoUrl, addToast }) => {
  const [formData, setFormData] = useState<Partial<User>>({
    name: user.name || '',
    phone: user.phone || '',
    dob: user.dob || '',
    address: user.address || '',
    blood_group: user.blood_group || '',
    emergency_contact_name: user.emergency_contact_name || '',
    emergency_contact_phone: user.emergency_contact_phone || '',
    gov_id_type: user.gov_id_type || 'Aadhaar Card',
    gov_id_number: user.gov_id_number || '',
  });

  const [passwords, setPasswords] = useState({ new: '', confirm: '' });
  const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });
  
  const [profilePicFile, setProfilePicFile] = useState<File | null>(null);
  const [govIdFile, setGovIdFile] = useState<File | null>(null);

  const [profilePicPreview, setProfilePicPreview] = useState<string | null>(user.profile_image_url || null);
  const [govIdPreview, setGovIdPreview] = useState<string | null>(user.gov_id_image_url || null);

  const [isDetailsLoading, setIsDetailsLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const isProfileComplete = useMemo(() => {
    return !!(
      user.name && user.phone && user.dob && user.address && user.blood_group &&
      user.emergency_contact_name && user.emergency_contact_phone &&
      user.gov_id_type && user.gov_id_number && user.gov_id_image_url &&
      user.profile_image_url
    );
  }, [user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'profile' | 'govId') => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      if (type === 'profile') {
        setProfilePicFile(file);
        setProfilePicPreview(previewUrl);
      } else {
        setGovIdFile(file);
        setGovIdPreview(previewUrl);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsDetailsLoading(true);

    let updatedData = { ...formData };
    
    // Upload profile picture if changed
    if (profilePicFile) {
        const { data, error } = await uploadImage(profilePicFile);
        if (error) {
            addToast('Profile picture upload failed. Please try again.', 'error');
            setIsDetailsLoading(false);
            return;
        }
        updatedData.profile_image_url = data.publicUrl;
    }
    
    // Upload government ID if changed
    if (govIdFile) {
        const { data, error } = await uploadImage(govIdFile);
        if (error) {
            addToast('Government ID upload failed. Please try again.', 'error');
            setIsDetailsLoading(false);
            return;
        }
        updatedData.gov_id_image_url = data.publicUrl;
    }

    await onUpdateUser(user.id, updatedData);
    setIsDetailsLoading(false);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage({type: '', text: ''});
    setIsPasswordLoading(true);

    if (passwords.new.length < 6) {
        setPasswordMessage({type: 'error', text: 'New password must be at least 6 characters long.'});
        setIsPasswordLoading(false);
        return;
    }
    if (passwords.new !== passwords.confirm) {
      setPasswordMessage({type: 'error', text: 'New passwords do not match.'});
      setIsPasswordLoading(false);
      return;
    }
    const success = await onChangePassword(passwords.new);
    if (success) {
        setPasswords({ new: '', confirm: '' });
        setPasswordMessage({type: 'success', text: 'Password updated successfully!'});
    } else {
        setPasswordMessage({type: 'error', text: 'Failed to update password.'});
    }
    setIsPasswordLoading(false);
  };

  const handleDownloadIdCard = async () => {
    if (!isProfileComplete) {
      addToast("Please complete your profile fully to download the ID card.", "info");
      return;
    }
    
    setIsDownloading(true);
    
    const cardElement = document.getElementById('id-card-capture');
    if (!cardElement || typeof window.html2canvas === 'undefined' || typeof window.jspdf === 'undefined') {
        addToast("Download feature is currently unavailable. Please try again later.", "error");
        setIsDownloading(false);
        return;
    }

    try {
        const canvas = await window.html2canvas(cardElement, {
            scale: 3, // Higher scale for better quality
            useCORS: true,
            backgroundColor: null, // Use transparent background for cleaner embedding
        });

        const imgData = canvas.toDataURL('image/png');
        
        // Create a standard A4 PDF (210mm x 297mm)
        const pdf = new window.jspdf.jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        
        // Standard credit card size in mm
        const cardWidth = 85.6;
        const cardHeight = 53.98;

        // Center the card on the page
        const x = (pdfWidth - cardWidth) / 2;
        const y = 30; // 30mm from the top

        // Add the card image
        pdf.addImage(imgData, 'PNG', x, y, cardWidth, cardHeight);

        pdf.save(`Shraddha-Yatra-ID-Card-${user.name}.pdf`);
    } catch (err) {
        console.error("Error generating ID card PDF:", err);
        addToast('An error occurred while generating the ID card.', 'error');
    } finally {
        setIsDownloading(false);
    }
  };


  return (
    <>
      <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8">
        <div className="text-center">
            <h2 className="text-3xl font-bold text-amber-900">My Devotee Profile</h2>
            <p className="text-gray-600 mt-1">Keep your information updated for a seamless yatra experience.</p>
        </div>
        
        {/* Update Details Form */}
        <form onSubmit={handleDetailsSubmit} className="bg-white p-6 md:p-8 rounded-lg shadow-md space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Personal Details */}
            <div className="md:col-span-2 space-y-4">
              <h3 className="text-xl font-semibold text-orange-700 border-b pb-2">Personal Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} pattern="[0-9]{10}" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
                </div>
                 <div>
                  <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                  <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Blood Group</label>
                  <input type="text" name="blood_group" placeholder="e.g. O+" value={formData.blood_group} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                </div>
              </div>
               <div>
                  <label className="block text-sm font-medium text-gray-700">Full Address</label>
                  <textarea name="address" value={formData.address} onChange={handleChange} rows={2} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"></textarea>
                </div>
            </div>

            {/* Profile Picture */}
            <div className="flex flex-col items-center justify-center space-y-2">
                <img src={profilePicPreview || 'https://via.placeholder.com/150'} alt="Profile Preview" className="w-32 h-32 object-cover rounded-full border-4 border-amber-200 shadow-sm" />
                <label htmlFor="profile-pic-upload" className="cursor-pointer text-sm text-orange-600 hover:underline">Change Photo</label>
                <input id="profile-pic-upload" type="file" onChange={(e) => handleFileChange(e, 'profile')} accept="image/*" className="hidden" />
            </div>
          </div>
          
           {/* Emergency Contact */}
          <div className="space-y-4 pt-4 border-t">
              <h3 className="text-xl font-semibold text-orange-700">Emergency Contact</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Contact Name</label>
                    <input type="text" name="emergency_contact_name" value={formData.emergency_contact_name} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Contact Phone</label>
                    <input type="tel" name="emergency_contact_phone" value={formData.emergency_contact_phone} onChange={handleChange} pattern="[0-9]{10}" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                </div>
              </div>
          </div>

          {/* Government ID */}
          <div className="space-y-4 pt-4 border-t">
              <h3 className="text-xl font-semibold text-orange-700">Government ID</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">ID Type</label>
                    <select name="gov_id_type" value={formData.gov_id_type} onChange={handleChange} className="mt-1 block w-full border bg-white border-gray-300 rounded-md shadow-sm p-2">
                        <option>Aadhaar Card</option>
                        <option>Voter ID Card</option>
                        <option>Passport</option>
                        <option>Driving License</option>
                    </select>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700">ID Number</label>
                    <input type="text" name="gov_id_number" value={formData.gov_id_number} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                </div>
                <div className="flex flex-col items-center">
                    <a href={govIdPreview || '#'} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                        {govIdPreview ? <img src={govIdPreview} alt="ID Preview" className="h-16 w-auto border rounded" /> : 'No ID uploaded'}
                    </a>
                    <label htmlFor="gov-id-upload" className="cursor-pointer text-sm text-orange-600 hover:underline mt-1">Upload ID Image</label>
                    <input id="gov-id-upload" type="file" onChange={(e) => handleFileChange(e, 'govId')} accept="image/*" className="hidden" />
                </div>
              </div>
          </div>
          
          <div className="text-right">
              <button type="submit" className="px-6 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:bg-orange-300 flex items-center justify-center min-w-[120px]" disabled={isDetailsLoading}>
                  {isDetailsLoading ? <Spinner/> : 'Save Details'}
              </button>
          </div>
        </form>

        {/* ID Card Section */}
        <div className="bg-white p-6 md:p-8 rounded-lg shadow-md text-center">
            <h3 className="text-2xl font-semibold text-orange-700 mb-4">Your Devotee ID Card</h3>
            {!isProfileComplete ? (
              <p className="text-amber-700 bg-amber-100 p-3 rounded-md">Please complete all fields in your profile, including uploading a profile picture and government ID, to generate your ID card.</p>
            ) : (
              <div>
                <p className="text-gray-600 mb-4">Your profile is complete. You can now download your official ID card.</p>
                <button 
                  onClick={handleDownloadIdCard}
                  className="px-8 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors disabled:bg-green-300" 
                  disabled={isDownloading}>
                  {isDownloading ? 'Generating...' : 'Download ID Card (PDF)'}
                </button>
              </div>
            )}
        </div>

        {/* Change Password Form */}
        <form onSubmit={handlePasswordSubmit} className="bg-white p-6 md:p-8 rounded-lg shadow-md">
          <h3 className="text-2xl font-semibold text-orange-700 mb-4">Change Password</h3>
          <div className="space-y-4">
               <div>
                  <label className="block text-sm font-medium text-gray-700">New Password</label>
                  <input type="password" name="new" value={passwords.new} onChange={(e) => setPasswords(p => ({...p, new: e.target.value}))} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required disabled={isPasswordLoading}/>
              </div>
              <div>
                  <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                  <input type="password" name="confirm" value={passwords.confirm} onChange={(e) => setPasswords(p => ({...p, confirm: e.target.value}))} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required disabled={isPasswordLoading}/>
              </div>
               {passwordMessage.text && <p className={`text-sm ${passwordMessage.type === 'error' ? 'text-red-600' : 'text-green-600'}`}>{passwordMessage.text}</p>}
              <div className="text-right">
                  <button type="submit" className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:bg-gray-300 flex items-center justify-center min-w-[170px]" disabled={isPasswordLoading}>
                      {isPasswordLoading ? <Spinner /> : 'Change Password'}
                  </button>
              </div>
          </div>
        </form>
      </div>

      {/* Hidden container for rendering the ID card for capture */}
      <div className="absolute -left-[9999px] top-0">
          <IDCard user={user} logoUrl={logoUrl} />
      </div>
    </>
  );
};

export default ProfileView;