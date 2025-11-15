import React from 'react';
import { User } from '../types';

interface IDCardProps {
  user: User;
  logoUrl: string;
}

const IDCard: React.FC<IDCardProps> = ({ user, logoUrl }) => {
  const memberId = `SYT-${String(user.id).substring(0, 8).toUpperCase()}`;
  const qrData = `MemberID: ${memberId}\nName: ${user.name}\nPhone: ${user.phone}`;

  return (
    <div
      id="id-card-capture"
      className="
        relative 
        w-[324px] 
        h-[204px] 
        bg-white 
        border border-gray-300 
        rounded-lg 
        shadow-lg 
        p-2 
        flex flex-col 
        overflow-hidden 
        font-sans 
        text-[8pt] 
        text-black
      "
      style={{
        lineHeight: 1.1,
      }}
    >
      {/* Header */}
      <header className="flex items-center border-b-2 border-orange-500 pb-1 shrink-0">
        <img src={logoUrl} alt="Logo" className="h-8 w-auto shrink-0" />
        <div className="ml-2 min-w-0">
          <h1 className="text-[12pt] font-bold text-amber-900 leading-none break-words">
            Shraddha Yatra Trust
          </h1>
          <p className="text-[8pt] text-orange-700 break-words">
            Devotee Identity Card
          </p>
        </div>
      </header>

      {/* Body */}
      <main className="flex flex-1 pt-1 overflow-hidden">
        {/* Left: Photo + QR */}
        <div className="w-[32%] flex flex-col items-center justify-start gap-1 shrink-0">
          <img
            src={user.profile_image_url || 'https://via.placeholder.com/150'}
            alt="Profile"
            className="w-[65px] h-[78px] object-cover border-2 border-orange-400 rounded-md"
          />
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=60x60&qzone=1&data=${encodeURIComponent(qrData)}`}
            alt="QR Code"
            className="w-[50px] h-[50px]"
          />
        </div>

        {/* Right: Details */}
        <div className="w-[68%] pl-2 flex flex-col justify-between overflow-hidden">
          {/* Main details */}
          <div className="overflow-hidden text-[7pt] leading-snug space-y-1">

            <div className="grid grid-cols-2 gap-x-1">
              <div>
                <p className="text-gray-500 text-[6.5pt]">Full Name</p>
                <p className="font-bold text-amber-900 break-words">
                  {user.name}
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-[6.5pt]">Member ID</p>
                <p className="font-semibold break-words">{memberId}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-1">
              <div>
                <p className="text-gray-500 text-[6.5pt]">Date of Birth</p>
                <p className="font-semibold break-words">
                  {user.dob
                    ? new Date(user.dob).toLocaleDateString('en-GB')
                    : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-[6.5pt]">Blood Group</p>
                <p className="font-bold text-red-600 break-words">
                  {user.blood_group?.toUpperCase() || 'N/A'}
                </p>
              </div>
            </div>

            <div>
              <p className="text-gray-500 text-[6.5pt]">Phone</p>
              <p className="font-semibold break-words">{user.phone}</p>
            </div>

            <div className="overflow-hidden">
              <p className="text-gray-500 text-[6.5pt]">Address</p>
              <p className="font-semibold break-words leading-tight">
                {user.address || 'N/A'}
              </p>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="text-[6.5pt]">
            <p className="text-gray-500 break-words">
              In Case of Emergency, Contact:
            </p>
            <p className="font-bold break-words">
              {user.emergency_contact_name || 'N/A'} (
              {user.emergency_contact_phone || 'N/A'})
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-[6.5pt] text-gray-500 border-t border-gray-200 pt-1 break-words">
        This card is for identification purposes for yatras organized by
        Shraddha Yatra Trust.
      </footer>
    </div>
  );
};

export default IDCard;