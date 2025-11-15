import React from 'react';
import { User } from '../types';

interface IDCardProps {
  user: User;
  logoUrl: string;
}

const IDCard: React.FC<IDCardProps> = ({ user, logoUrl }) => {
  // Format based on new design image: SYT-FB + 6 chars of user ID
  const memberId = `SYT-FB${String(user.id).substring(0, 6).toUpperCase()}`;

  const qrData =
    `MemberID: ${memberId}\n` +
    `Name: ${user.name}\n` +
    `Phone: ${user.phone}`;

  return (
    <div
      id="id-card-capture"
      className="
        relative
        w-[340px] /* ~3.54 in @ 96 DPI */
        h-[214px] /* ~2.23 in @ 96 DPI, matches CR80 aspect ratio */
        bg-white
        border border-gray-200
        rounded-xl
        shadow-lg
        p-3
        flex flex-col
        overflow-hidden
        font-sans
        text-black
      "
      style={{
        lineHeight: 1.2,
      }}
    >
      {/* Header */}
      <header className="flex items-center shrink-0">
        <img
          src={logoUrl}
          alt="Logo"
          className="h-10 w-10 shrink-0"
          // Fix: Replaced non-standard 'high-quality' with 'smooth' for imageRendering.
          style={{ imageRendering: "smooth" }}
        />
        <div className="ml-2 min-w-0">
          <h1 className="font-serif text-[14pt] font-bold text-amber-900 leading-none">
            Shraddha Yatra Trust
          </h1>
          <p className="text-[9pt] text-orange-700 leading-none mt-0.5">
            Devotee Identity Card
          </p>
        </div>
      </header>
      
      <div className="w-full h-[2px] bg-orange-400 mt-1.5 shrink-0" />


      {/* Body */}
      <main className="flex flex-1 pt-2 overflow-hidden">

        {/* LEFT SIDE (Photo + QR) */}
        <div className="w-[35%] flex flex-col items-center justify-start gap-1 shrink-0 pt-1">
          <img
            src={user.profile_image_url || "https://via.placeholder.com/150"}
            alt="Profile"
            className="
              w-[75px]
              h-[90px]
              object-cover
              border-[3px]
              border-orange-400
              rounded-lg
            "
            // Fix: Replaced non-standard 'high-quality' with 'smooth' for imageRendering.
            style={{ imageRendering: "smooth" }}
          />

          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=80x80&qzone=1&data=${encodeURIComponent(
              qrData
            )}`}
            alt="QR Code"
            className="w-[65px] h-[65px] mt-auto"
            style={{
              imageRendering: "pixelated",
            }}
          />
        </div>

        {/* RIGHT SIDE DETAILS */}
        <div className="w-[65%] pl-2 flex flex-col text-[8pt]">
            <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 flex-grow">
                {/* Full Name */}
                <div className="col-span-1">
                    <p className="text-gray-500">Full Name</p>
                    <p className="font-bold text-amber-900 text-[9pt] break-words">{user.name}</p>
                </div>
                {/* Member ID */}
                <div className="col-span-1">
                    <p className="text-gray-500">Member ID</p>
                    <p className="font-semibold break-words">{memberId}</p>
                </div>
                {/* DOB */}
                <div className="col-span-1">
                    <p className="text-gray-500">Date of Birth</p>
                    <p className="font-semibold break-words">
                        {user.dob ? new Date(user.dob).toLocaleDateString("en-GB") : "N/A"}
                    </p>
                </div>
                {/* Blood Group */}
                <div className="col-span-1">
                    <p className="text-gray-500">Blood Group</p>
                    <p className="font-bold text-red-600 text-[10pt] break-words">
                        {user.blood_group?.toUpperCase() || "N/A"}
                    </p>
                </div>
                {/* Phone */}
                <div className="col-span-2">
                    <p className="text-gray-500">Phone</p>
                    <p className="font-semibold break-words">{user.phone}</p>
                </div>
                {/* Address */}
                <div className="col-span-2">
                    <p className="text-gray-500">Address</p>
                    <p className="font-semibold leading-tight break-words">
                        {user.address || "N/A"}
                    </p>
                </div>
            </div>

            {/* Emergency Contact */}
            <div className="text-[7.5pt] mt-auto">
                <p className="text-gray-500">In Case of Emergency, Contact:</p>
                <p className="font-bold break-words">
                    {user.emergency_contact_name || "N/A"} ({user.emergency_contact_phone || "N/A"})
                </p>
            </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-[7pt] text-gray-500 pt-1.5 border-t border-gray-200 mt-1 shrink-0">
        This card serves as identification for Shraddha Yatra Trust yatras.
      </footer>
    </div>
  );
};

export default IDCard;