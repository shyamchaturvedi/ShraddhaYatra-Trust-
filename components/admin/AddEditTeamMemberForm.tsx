import React, { useState } from 'react';
import { TeamMember } from '../../types';
import { uploadImage } from '../../services/supabaseClient';
import Spinner from '../Spinner';

interface AddEditTeamMemberFormProps {
  member: TeamMember | null;
  onSave: (memberData: Omit<TeamMember, 'id'> | TeamMember) => void;
  onClose: () => void;
}

const AddEditTeamMemberForm: React.FC<AddEditTeamMemberFormProps> = ({ member, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: member?.name || '',
    role: member?.role || '',
    responsibility: member?.responsibility || '',
    image_url: member?.image_url || 'https://picsum.photos/seed/person/400/400',
    display_order: member?.display_order || 99,
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(member?.image_url || null);
  const [isUploading, setIsUploading] = useState(false);


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'number') {
        setFormData(prev => ({ ...prev, [name]: parseInt(value, 10) || 0 }));
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    let finalImageUrl = formData.image_url;

    if (selectedFile) {
        const { data, error } = await uploadImage(selectedFile);
        if (error) {
            alert('Image upload failed. Please try again.');
            console.error('Upload failed:', error);
            setIsUploading(false);
            return;
        }
        finalImageUrl = data.publicUrl;
    }

    const memberDataToSave = { ...formData, image_url: finalImageUrl };

    if (member) {
      onSave({ ...memberDataToSave, id: member.id });
    } else {
      onSave(memberDataToSave);
    }
    setIsUploading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-amber-900 mb-4">{member ? 'Edit Team Member' : 'Add New Team Member'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Member Image</label>
              <div className="mt-1 flex items-center gap-4">
                {imagePreview && <img src={imagePreview} alt="Member preview" className="w-24 h-24 object-cover rounded-full" />}
                <input type="file" onChange={handleFileChange} accept="image/*" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"/>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Role / पद</label>
              <input type="text" name="role" value={formData.role} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
            </div>
            
             <div>
              <label className="block text-sm font-medium text-gray-700">Responsibility / कार्य</label>
              <textarea name="responsibility" value={formData.responsibility} onChange={handleChange} rows={3} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"></textarea>
            </div>
             
             <div>
              <label className="block text-sm font-medium text-gray-700">Display Order</label>
              <input type="number" name="display_order" value={formData.display_order} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
            </div>

          <div className="flex justify-end items-center gap-4 mt-6">
            {isUploading && <Spinner />}
            <button type="button" onClick={onClose} disabled={isUploading} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 disabled:opacity-50">Cancel</button>
            <button type="submit" disabled={isUploading} className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50">{member ? 'Save Changes' : 'Add Member'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditTeamMemberForm;
