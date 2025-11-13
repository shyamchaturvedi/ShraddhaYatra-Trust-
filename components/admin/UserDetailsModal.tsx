import React from 'react';
import { User } from '../../types';

interface UserDetailsModalProps {
    user: User;
    onClose: () => void;
}

const DetailItem: React.FC<{ label: string; value: string | undefined }> = ({ label, value }) => (
    <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="font-semibold text-gray-800">{value || 'N/A'}</p>
    </div>
);

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({ user, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4 border-b pb-2">
                    <h3 className="text-2xl font-bold text-amber-900">Devotee Profile</h3>
                    <button onClick={onClose} className="p-2 rounded-full text-gray-500 hover:bg-gray-200">
                        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Left Column for Images */}
                    <div className="space-y-4 flex flex-col items-center text-center">
                        <div>
                            <p className="font-semibold text-orange-700 mb-1">Profile Photo</p>
                            <a href={user.profile_image_url || '#'} target="_blank" rel="noopener noreferrer">
                                <img src={user.profile_image_url || 'https://via.placeholder.com/150'} alt="Profile" className="w-32 h-32 object-cover rounded-full border-4 border-amber-200 shadow-md" />
                            </a>
                        </div>
                        <div>
                            <p className="font-semibold text-orange-700 mb-1">Government ID</p>
                             <a href={user.gov_id_image_url || '#'} target="_blank" rel="noopener noreferrer">
                                <img src={user.gov_id_image_url || 'https://via.placeholder.com/150'} alt="Gov ID" className="w-48 h-auto object-contain border-2 rounded shadow-md" />
                            </a>
                        </div>
                    </div>

                    {/* Right Column for Details */}
                    <div className="md:col-span-2 space-y-4">
                        <div className="p-4 bg-gray-50 rounded-lg">
                             <h4 className="text-lg font-semibold text-orange-800 mb-2">Personal Information</h4>
                             <div className="grid grid-cols-2 gap-4">
                                <DetailItem label="Full Name" value={user.name} />
                                <DetailItem label="Phone" value={user.phone} />
                                <DetailItem label="Date of Birth" value={user.dob ? new Date(user.dob).toLocaleDateString('en-GB') : 'N/A'} />
                                <DetailItem label="Blood Group" value={user.blood_group} />
                                <div className="col-span-2">
                                    <DetailItem label="Address" value={user.address} />
                                </div>
                             </div>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-lg">
                             <h4 className="text-lg font-semibold text-orange-800 mb-2">Emergency Contact</h4>
                             <div className="grid grid-cols-2 gap-4">
                                <DetailItem label="Contact Name" value={user.emergency_contact_name} />
                                <DetailItem label="Contact Phone" value={user.emergency_contact_phone} />
                             </div>
                        </div>

                         <div className="p-4 bg-gray-50 rounded-lg">
                             <h4 className="text-lg font-semibold text-orange-800 mb-2">ID Details</h4>
                             <div className="grid grid-cols-2 gap-4">
                                <DetailItem label="ID Type" value={user.gov_id_type} />
                                <DetailItem label="ID Number" value={user.gov_id_number} />
                             </div>
                        </div>
                    </div>
                </div>

                 <div className="mt-6 flex justify-end">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserDetailsModal;
