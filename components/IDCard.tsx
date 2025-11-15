import React from "react";
import { User } from "../types";

interface IDCardProps {
  user: User;
  logoUrl: string;
}

const IDCard: React.FC<IDCardProps> = ({ user, logoUrl }) => {
  const memberId = `SYT-FB${String(user.id ?? "").substring(0, 4).toUpperCase()}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=100x100&qzone=1&data=MemberID:${memberId}`;

  // Reusable component for displaying labeled data
  const InfoField: React.FC<{ label: string; value: string; color?: string }> = ({ label, value, color = "text-gray-900" }) => (
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className={`font-semibold text-sm break-words ${color}`}>{value || "N/A"}</p>
    </div>
  );

  const formattedDob = user.dob ? new Date(user.dob).toLocaleDateString("en-GB") : "N/A";
  const emergencyContact = `${user.emergency_contact_name || 'Home'} (${user.emergency_contact_phone || 'N/A'})`;

  return (
    <div
      id="id-card-capture"
      className="w-full max-w-lg mx-auto bg-white rounded-lg shadow-md border border-gray-200 p-3 font-sans text-gray-800 flex flex-col"
      style={{ aspectRatio: '85.6 / 54' }} // Standard ID card size: 85.6mm x 54mm
    >
      {/* HEADER */}
      <header className="flex items-center space-x-3 pb-2">
        <img src={logoUrl} alt="Logo" className="h-12 w-12 object-contain" />
        <div>
          <h1 className="text-xl font-bold text-amber-900 leading-tight">Shraddha Yatra Trust</h1>
          <p className="text-sm text-gray-600 leading-tight">Devotee Identity Card</p>
        </div>
      </header>
      <div className="w-full h-px bg-orange-400"></div>

      {/* MAIN CONTENT */}
      <main className="flex flex-grow gap-3 pt-2 min-h-0">
        {/* Left Column: Photo & QR */}
        <div className="w-1/3 flex flex-col items-center justify-between">
          <img
            src={user.profile_image_url || "/images/testimonials/avatar.png"}
            className="w-full aspect-[3/4] object-cover rounded-md border-2 border-orange-300 p-0.5"
            alt="Profile"
            crossOrigin="anonymous"
          />
          <img
            src={qrCodeUrl}
            className="w-20 h-20 object-contain"
            alt="QR Code"
            crossOrigin="anonymous"
          />
        </div>

        {/* Right Column: Details */}
        <div className="w-2/3 flex flex-col justify-between">
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 content-start">
            <InfoField label="Full Name" value={user.name || ''} />
            <InfoField label="Member ID" value={memberId} />
            <InfoField label="Date of Birth" value={formattedDob} />
            <InfoField label="Blood Group" value={user.blood_group || 'N/A'} color="text-red-600" />
            <InfoField label="Phone" value={user.phone || ''} />
            <div className="col-span-2">
                 <InfoField label="Address" value={user.address || ''} />
            </div>
          </div>
          <div className="mt-auto">
            <p className="text-xs text-gray-500">In Case of Emergency, Contact:</p>
            <p className="font-semibold text-sm">{emergencyContact}</p>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="mt-auto pt-2 border-t border-gray-200">
        <p className="text-center text-xs text-gray-500">
            This card serves as identification for Shraddha Yatra Trust yatras.
        </p>
      </footer>
    </div>
  );
};

export default IDCard;