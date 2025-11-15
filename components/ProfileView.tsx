import React, { useEffect, useState } from "react";
import { User, ToastType } from "../types";
import IDCard from "./IDCard";
import Spinner from "./Spinner";
import { uploadImage } from "../services/supabaseClient";

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

const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  onUpdateUser,
  onChangePassword,
  logoUrl,
  addToast,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState<Partial<User>>({});
  const [passwordData, setPasswordData] = useState({ newPassword: "", confirmPassword: "" });
  
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [govIdFile, setGovIdFile] = useState<File | null>(null);

  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(user.profile_image_url || null);
  const [govIdPreview, setGovIdPreview] = useState<string | null>(user.gov_id_image_url || null);

  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Sync formData with user prop when editing starts or user data changes
  useEffect(() => {
    setFormData({
      name: user.name || "",
      phone: user.phone || "",
      dob: user.dob ? new Date(user.dob).toISOString().split("T")[0] : "",
      address: user.address || "",
      blood_group: user.blood_group || "",
      emergency_contact_name: user.emergency_contact_name || "",
      emergency_contact_phone: user.emergency_contact_phone || "",
      gov_id_type: user.gov_id_type || "Aadhaar Card",
      gov_id_number: user.gov_id_number || "",
    });
    setProfileImagePreview(user.profile_image_url || null);
    setGovIdPreview(user.gov_id_image_url || null);
  }, [user, isEditing]);


  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData((p) => ({ ...p, [e.target.name]: e.target.value }));
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


  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const updatedData: Partial<User> = { ...formData };

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

      await Promise.resolve(onUpdateUser(user.id, updatedData));
      setIsEditing(false); // Exit edit mode on successful save
    } catch (err: any) {
      addToast(err?.message || "Failed to update profile.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      addToast("Passwords do not match.", "error");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      addToast("Password must be at least 6 characters.", "error");
      return;
    }
    setIsChangingPassword(true);
    const success = await onChangePassword(passwordData.newPassword);
    if (success) {
      setPasswordData({ newPassword: "", confirmPassword: "" });
    }
    setIsChangingPassword(false);
  };

  const handleDownloadIdCard = async () => {
    setIsDownloading(true);
    const cardElement = document.getElementById("id-card-capture");
    if (!cardElement || !window.html2canvas || !window.jspdf) {
      addToast("Download feature is currently unavailable.", "error");
      setIsDownloading(false);
      return;
    }

    try {
      const canvas = await window.html2canvas(cardElement, { scale: 3, useCORS: true });
      const imgData = canvas.toDataURL("image/png");
      const { jsPDF } = window.jspdf;
      
      // Create a standard A4 portrait PDF (210mm x 297mm)
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: 'a4' });
      
      const cardAspectRatio = 85.6 / 54;
      const pdfWidth = pdf.internal.pageSize.getWidth();
      
      // Define a larger, more prominent size for the card within the PDF
      // making it wider than a standard ID card for better visibility.
      const cardOnPdfWidth = 120; // e.g., 120mm wide
      const cardOnPdfHeight = cardOnPdfWidth / cardAspectRatio;

      // Center the card on the page with a margin from the top
      const x = (pdfWidth - cardOnPdfWidth) / 2;
      const y = 20; // 20mm from the top

      pdf.addImage(imgData, "PNG", x, y, cardOnPdfWidth, cardOnPdfHeight);
      pdf.save(`Shraddha-Yatra-ID-Card-${user.name}.pdf`);
    } catch (error) {
        console.error("Error generating PDF:", error);
        addToast("Could not generate PDF.", "error");
    } finally {
        setIsDownloading(false);
    }
  };

  // Render helpers
  const InfoItem: React.FC<{ label: string; value?: string }> = ({ label, value }) => (
    <div>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="text-lg text-gray-800">{value || "N/A"}</p>
    </div>
  );
  
  const FormInput: React.FC<any> = ({ label, ...props }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input {...props} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
    </div>
  );
  
  const emergencyContactValue = `${user.emergency_contact_name || ''}${user.emergency_contact_phone ? ` (${user.emergency_contact_phone})` : ''}`.trim() || 'N/A';
  const govIdValue = `${user.gov_id_type || ''} - ${user.gov_id_number || ''}`.replace(/^ - | - $/g, '') || 'N/A';

  const renderDisplay = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
      <InfoItem label="Full Name" value={user.name} />
      <InfoItem label="Phone" value={user.phone} />
      <InfoItem label="Date of Birth" value={user.dob ? new Date(user.dob).toLocaleDateString("en-GB") : "N/A"} />
      <InfoItem label="Blood Group" value={user.blood_group} />
      <div className="md:col-span-2">
         <InfoItem label="Address" value={user.address} />
      </div>
      <InfoItem label="Emergency Contact" value={emergencyContactValue} />
      <InfoItem label="Government ID" value={govIdValue} />
    </div>
  );

  const renderEdit = () => (
    <form onSubmit={handleSave} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput name="name" label="Full Name" value={formData.name || ""} onChange={handleFormChange} required />
        <FormInput name="phone" label="Phone" value={formData.phone || ""} onChange={handleFormChange} required />
        <FormInput name="dob" label="Date of Birth" type="date" value={formData.dob || ""} onChange={handleFormChange} />
        <FormInput name="blood_group" label="Blood Group" value={formData.blood_group || ""} onChange={handleFormChange} />
         <div className="md:col-span-2">
            <FormInput as="textarea" name="address" label="Address" value={formData.address || ""} onChange={handleFormChange} />
        </div>
        <FormInput name="emergency_contact_name" label="Emergency Contact Name" value={formData.emergency_contact_name || ""} onChange={handleFormChange} />
        <FormInput name="emergency_contact_phone" label="Emergency Contact Phone" value={formData.emergency_contact_phone || ""} onChange={handleFormChange} />
        <FormInput name="gov_id_type" label="Government ID Type" value={formData.gov_id_type || ""} onChange={handleFormChange} />
        <FormInput name="gov_id_number" label="Government ID Number" value={formData.gov_id_number || ""} onChange={handleFormChange} />
      </div>

       <div className="flex justify-end gap-4 mt-6">
        <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
        <button type="submit" disabled={isSaving} className="px-4 py-2 bg-orange-500 text-white rounded-md flex items-center gap-2 disabled:bg-orange-300">
          {isSaving ? <><Spinner /> Saving...</> : "Save Changes"}
        </button>
      </div>
    </form>
  );

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <h2 className="text-3xl font-bold text-amber-900 text-center mb-8">My Profile</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-1 space-y-6 flex flex-col items-center">
            <div className="bg-white p-6 rounded-lg shadow-md w-full">
                <h3 className="text-xl font-semibold text-center text-amber-800 mb-4">Devotee ID Card</h3>
                <IDCard user={user} logoUrl={logoUrl} />
                 <button
                    onClick={handleDownloadIdCard}
                    disabled={isDownloading}
                    className="w-full mt-4 flex items-center justify-center gap-2 bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {isDownloading ? <><Spinner /> Downloading...</> : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 9.707a1 1 0 011.414 0L9 11.001V3a1 1 0 112 0v8.001l1.293-1.294a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                        Download ID Card (PDF)
                      </>
                    )}
                  </button>
            </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-semibold text-orange-800">Personal Details</h3>
              {!isEditing && (
                <button onClick={() => setIsEditing(true)} className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 text-sm font-semibold">Edit Profile</button>
              )}
            </div>
            {isEditing ? renderEdit() : renderDisplay()}
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold text-orange-800 mb-4">Change Password</h3>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <FormInput type="password" name="newPassword" label="New Password" value={passwordData.newPassword} onChange={handlePasswordChange} required />
              <FormInput type="password" name="confirmPassword" label="Confirm New Password" value={passwordData.confirmPassword} onChange={handlePasswordChange} required />
              <div className="text-right">
                <button type="submit" disabled={isChangingPassword} className="px-6 py-2 bg-orange-500 text-white rounded-md flex items-center gap-2 disabled:bg-orange-300 font-semibold">
                  {isChangingPassword ? <><Spinner /> Changing...</> : "Change Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;