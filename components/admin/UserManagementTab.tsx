import React, { useState } from 'react';
import { User } from '../../types';
import UserDetailsModal from './UserDetailsModal';

interface UserManagementTabProps {
    users: User[];
}

const UserManagementTab: React.FC<UserManagementTabProps> = ({ users }) => {
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    return (
        <>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-2xl font-semibold text-orange-700 mb-4">Registered Devotees ({users.length})</h3>
                {users.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-amber-100">
                                <tr>
                                    <th className="p-3 font-semibold text-orange-900">Name</th>
                                    <th className="p-3 font-semibold text-orange-900">Phone</th>
                                    <th className="p-3 font-semibold text-orange-900">Role</th>
                                    <th className="p-3 font-semibold text-orange-900">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                            {users.map(user => (
                                <tr key={user.id} className="border-b border-gray-200">
                                    <td className="p-3">{user.name}</td>
                                    <td className="p-3">{user.phone}</td>
                                    <td className="p-3 capitalize">{user.role}</td>
                                    <td className="p-3">
                                        <button 
                                            onClick={() => setSelectedUser(user)} 
                                            className="bg-blue-500 text-white px-3 py-1 text-sm rounded hover:bg-blue-600"
                                        >
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                ) : <p className="text-center p-4 text-gray-500">No users have registered yet.</p>}
            </div>

            {selectedUser && (
                <UserDetailsModal user={selectedUser} onClose={() => setSelectedUser(null)} />
            )}
        </>
    );
};

export default UserManagementTab;
