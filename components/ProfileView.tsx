import React, { useState } from 'react';
import { User } from '../types';
import Spinner from './Spinner';

interface ProfileViewProps {
  user: User;
  onUpdateUser: (updatedUser: User) => Promise<void>;
  onChangePassword: (newPassword: string) => Promise<boolean>;
}

const ProfileView: React.FC<ProfileViewProps> = ({ user, onUpdateUser, onChangePassword }) => {
  const [details, setDetails] = useState({ name: user.name, phone: user.phone });
  const [passwords, setPasswords] = useState({ new: '', confirm: '' });
  const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);


  const handleDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsDetailsLoading(true);
    await onUpdateUser({ ...user, ...details });
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


  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8">
      <h2 className="text-3xl font-bold text-amber-900 text-center">My Profile</h2>
      
      {/* Update Details Form */}
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-md">
        <h3 className="text-2xl font-semibold text-orange-700 mb-4">Update Your Details</h3>
        <form onSubmit={handleDetailsSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input type="text" name="name" value={details.name} onChange={handleDetailsChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required disabled={isDetailsLoading} />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
                <input type="tel" name="phone" value={details.phone} onChange={handleDetailsChange} pattern="[0-9]{10}" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required disabled={isDetailsLoading}/>
            </div>
            <div className="text-right">
                <button type="submit" className="px-6 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:bg-orange-300 flex items-center justify-center min-w-[120px]" disabled={isDetailsLoading}>
                    {isDetailsLoading ? <Spinner/> : 'Save Details'}
                </button>
            </div>
        </form>
      </div>

      {/* Change Password Form */}
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-md">
        <h3 className="text-2xl font-semibold text-orange-700 mb-4">Change Password</h3>
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
             <div>
                <label className="block text-sm font-medium text-gray-700">New Password</label>
                <input type="password" name="new" value={passwords.new} onChange={handlePasswordChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required disabled={isPasswordLoading}/>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                <input type="password" name="confirm" value={passwords.confirm} onChange={handlePasswordChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required disabled={isPasswordLoading}/>
            </div>
             {passwordMessage.text && <p className={`text-sm ${passwordMessage.type === 'error' ? 'text-red-600' : 'text-green-600'}`}>{passwordMessage.text}</p>}
            <div className="text-right">
                <button type="submit" className="px-6 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:bg-orange-300 flex items-center justify-center min-w-[170px]" disabled={isPasswordLoading}>
                    {isPasswordLoading ? <Spinner /> : 'Change Password'}
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileView;