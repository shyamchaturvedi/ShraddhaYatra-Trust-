import React, { useState } from 'react';
import { TeamMember } from '../../types';
import { supabase } from '../../services/supabaseClient';
import AddEditTeamMemberForm from './AddEditTeamMemberForm';
import ConfirmationModal from '../ConfirmationModal';

interface TeamManagementTabProps {
    teamMembers: TeamMember[];
    onAdminAction: (action: PromiseLike<any>, successMsg: string, errorMsg: string) => void;
}

const TeamManagementTab: React.FC<TeamManagementTabProps> = ({ teamMembers, onAdminAction }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [memberToEdit, setMemberToEdit] = useState<TeamMember | null>(null);
    const [memberToDelete, setMemberToDelete] = useState<TeamMember | null>(null);

    const handleSaveMember = async (memberData: Omit<TeamMember, 'id'> | TeamMember) => {
        if ('id' in memberData) {
            await onAdminAction(
                supabase.from('team_members').update(memberData).eq('id', memberData.id),
                'Team member updated successfully.',
                'Error updating team member'
            );
        } else {
            await onAdminAction(
                supabase.from('team_members').insert(memberData),
                'Team member added successfully.',
                'Error adding team member'
            );
        }
        setIsModalOpen(false);
        setMemberToEdit(null);
    };

    const confirmDeleteMember = async () => {
        if (!memberToDelete) return;
        await onAdminAction(
            supabase.from('team_members').delete().eq('id', memberToDelete.id),
            'Team member deleted successfully.',
            'Error deleting team member'
        );
        setMemberToDelete(null);
    };

    const handleEditMember = (member: TeamMember) => {
        setMemberToEdit(member);
        setIsModalOpen(true);
    };

    const handleAddNewMember = () => {
        setMemberToEdit(null);
        setIsModalOpen(true);
    };

    return (
        <>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-semibold text-orange-700">Manage Team</h3>
                    <button onClick={handleAddNewMember} className="bg-green-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">Add New Member</button>
                </div>
                {teamMembers.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-amber-100">
                                <tr>
                                    <th className="p-3 font-semibold text-orange-900">Image</th>
                                    <th className="p-3 font-semibold text-orange-900">Name</th>
                                    <th className="p-3 font-semibold text-orange-900">Role</th>
                                    <th className="p-3 font-semibold text-orange-900">Order</th>
                                    <th className="p-3 font-semibold text-orange-900">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                            {teamMembers.map(member => (
                                <tr key={member.id} className="border-b border-gray-200">
                                <td className="p-3"><img src={member.image_url} alt={member.name} className="w-16 h-16 object-cover rounded-full"/></td>
                                <td className="p-3">{member.name}</td>
                                <td className="p-3">{member.role}</td>
                                <td className="p-3">{member.display_order}</td>
                                <td className="p-3 flex items-center gap-2">
                                    <button onClick={() => handleEditMember(member)} className="bg-blue-500 text-white px-3 py-1 text-sm rounded hover:bg-blue-600">Edit</button>
                                    <button onClick={() => setMemberToDelete(member)} className="bg-red-600 text-white px-3 py-1 text-sm rounded hover:bg-red-700">Delete</button>
                                </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                ) : <p className="text-center p-4 text-gray-500">No team members found. Click 'Add New Member' to create one.</p>}
            </div>

            {isModalOpen && <AddEditTeamMemberForm member={memberToEdit} onSave={handleSaveMember} onClose={() => setIsModalOpen(false)} />}
            {memberToDelete && <ConfirmationModal isOpen={!!memberToDelete} title="Confirm Deletion" message={`Are you sure you want to delete "${memberToDelete.name}"?`} onConfirm={confirmDeleteMember} onClose={() => setMemberToDelete(null)} />}
        </>
    );
};

export default TeamManagementTab;
