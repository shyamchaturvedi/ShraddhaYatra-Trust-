import React from "react";
import { User } from "../types";

interface IDCardProps {
  user: User;
  logoUrl: string;
}

const IDCard: React.FC<IDCardProps> = ({ user, logoUrl }) => {
  // Member ID — as per your screenshot
  const memberId = `SYT-${String(user.id).substring(0, 8).toUpperCase()}`;

  // QR Code Data
  const qrData =
    `MemberID: ${memberId}\n` +
    `Name: ${user.name}\n` +
    `Phone: ${user.phone}`;

  return (
    <div
      id="id-card-capture"
      className="
        relative
        w-[350px]
        h-[220px]
        bg-white
        rounded-xl
        shadow-lg
        border border-gray-300
        overflow-hidden
        p-4
        font-sans
        text-black
      "
      style={{ lineHeight: 1.2 }}
    >
      {/* HEADER */}
      <header className="flex items-center">
        <img
          src={logoUrl}
          alt="Logo"
          className="h-12 w-12 object-contain"
          style={{ imageRendering: "smooth" }}
        />

        <div className="ml-3">
          <p className="text-[16pt] font-bold text-amber-900 leading-none">
            Shraddha Yatra Trust
          </p>
          <p className="text-[10pt] text-orange-600 mt-1 leading-none">
            Devotee Identity Card
          </p>
        </div>
      </header>

      {/* Separator Line */}
      <div className="w-full h-[2px] bg-orange-500 mt-2"></div>

      <main className="flex mt-3 h-[130px]">

        {/* LEFT SIDE — Photo + QR */}
        <div className="w-[36%] flex flex-col items-center">
          <div
            className="
              border-[4px]
              border-orange-400
              rounded-xl
              p-1
            "
          >
            <img
              src={user.profile_image_url || "https://via.placeholder.com/150"}
              className="w-[80px] h-[95px] object-cover rounded-md"
              alt="Profile"
            />
          </div>

          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=90x90&data=${encodeURIComponent(
              qrData
            )}`}
            className="w-[70px] h-[70px] mt-2"
            alt="QR Code"
          />
        </div>

        {/* RIGHT SIDE DETAILS */}
        <div className="w-[64%] pl-4 text-[9pt] leading-tight grid grid-cols-2 gap-y-1">

          {/* Full Name */}
          <div>
            <p className="text-gray-500">Full Name</p>
            <p className="font-bold text-[11pt] text-amber-900">{user.name}</p>
          </div>

          {/* Member ID */}
          <div>
            <p className="text-gray-500">Member ID</p>
            <p className="font-semibold">{memberId}</p>
          </div>

          {/* DOB */}
          <div>
            <p className="text-gray-500">Date of Birth</p>
            <p className="font-semibold">
              {user.dob
                ? new Date(user.dob).toLocaleDateString("en-GB")
                : "N/A"}
            </p>
          </div>

          {/* Blood Group */}
          <div>
            <p className="text-gray-500">Blood Group</p>
            <p className="font-bold text-red-600 text-[12pt]">
              {user.blood_group?.toUpperCase() || "N/A"}
            </p>
          </div>

          {/* Phone */}
          <div className="col-span-2">
            <p className="text-gray-500">Phone</p>
            <p className="font-semibold">{user.phone}</p>
          </div>

          {/* Address */}
          <div className="col-span-2">
            <p className="text-gray-500">Address</p>
            <p className="font-semibold break-words leading-tight">
              {user.address || "N/A"}
            </p>
          </div>
        </div>
      </main>

      {/* Emergency Contact */}
      <div className="mt-1 text-[8.5pt]">
        <p className="text-gray-500">In Case of Emergency, Contact:</p>
        <p className="font-bold">
          {user.emergency_contact_name || "N/A"} (
          {user.emergency_contact_phone || "N/A"})
        </p>
      </div>

      {/* FOOTER */}
      <footer className="border-t border-gray-200 mt-2 pt-2 text-center text-[8pt] text-gray-600">
        This card serves as identification for Shraddha Yatra Trust yatras.
      </footer>
    </div>
  );
};

export default IDCard;
