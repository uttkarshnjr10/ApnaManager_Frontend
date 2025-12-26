import { useState } from 'react';
import { useUserProfile } from '../../features/user/useUserProfile';
import Button from '../../components/ui/Button';
import FormField from '../../components/ui/FormField';
import Modal from '../../components/ui/Modal';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import apiClient from '../../api/apiClient'; 
import toast from 'react-hot-toast';        

// Sub-component for the password change modal
const ChangePasswordModal = ({ onClose }) => {
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return toast.error("New passwords do not match!");
    }
    if (passwordData.newPassword.length < 6) {
      return toast.error("Password must be at least 6 characters.");
    }

    setLoading(true);
    const toastId = toast.loading("Updating password...");

    try {
      await apiClient.put('/users/change-password', {
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword
      });

      toast.success("Password changed successfully!", { id: toastId });
      onClose(); // Close modal on success
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to change password";
      toast.error(errorMsg, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal onClose={onClose}>
      <h2 className="text-xl font-bold mb-4">Change Password</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField 
          label="Old Password" 
          name="oldPassword"
          type="password" 
          value={passwordData.oldPassword}
          onChange={handleChange}
          required
        />
        <FormField 
          label="New Password" 
          name="newPassword"
          type="password" 
          value={passwordData.newPassword}
          onChange={handleChange}
          required
        />
        <FormField 
          label="Confirm New Password" 
          name="confirmPassword"
          type="password" 
          value={passwordData.confirmPassword}
          onChange={handleChange}
          required
        />
        <div className="flex justify-end gap-4 pt-4">
          <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

const ProfilePage = () => {
  const { profile, loading, isEditing, setIsEditing, formData, setFormData, handleSave, handleCancel } = useUserProfile();
  const [showModal, setShowModal] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, details: { ...prev.details, [name]: value } }));
  };

  const renderRoleSpecificDetails = () => {
    if (!profile.details) return null;
    switch (profile.role) {
      case 'Hotel':
        return isEditing ? (
          <>
            <FormField label="Hotel Name" name="hotelName" value={formData.details.hotelName || ''} onChange={handleInputChange} />
            <FormField label="City" name="city" value={formData.details.city || ''} onChange={handleInputChange} />
          </>
        ) : (
          <>
            <p><strong>Hotel Name:</strong> {profile.details.hotelName}</p>
            <p><strong>City:</strong> {profile.details.city}</p>
          </>
        );
      case 'Police':
        // Added Police case based on backend schema
        return (
           <>
             <p><strong>Station:</strong> {profile.details.station}</p>
             <p><strong>Rank:</strong> {profile.details.rank}</p>
           </>
        );
      default: return null;
    }
  };

  if (loading) {
    return <Skeleton height={300} />;
  }

  return (
    <>
      {showModal && <ChangePasswordModal onClose={() => setShowModal(false)} />}
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Profile</h1>
      <div className="bg-white p-8 rounded-xl shadow-md max-w-2xl mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold">{profile.username}</h2>
          <p className="text-gray-500">{profile.role}</p>
        </div>
        <div className="space-y-4 text-gray-700">
          <p><strong>Contact Email:</strong> {profile.email}</p>
          {renderRoleSpecificDetails()}
          <p><strong>Member Since:</strong> {new Date(profile.createdAt).toLocaleDateString()}</p>
        </div>
        <div className="flex justify-end gap-4 mt-8 pt-4 border-t">
          {isEditing ? (
            <>
              <Button variant="secondary" onClick={handleCancel}>Cancel</Button>
              <Button onClick={handleSave}>Save Changes</Button>
            </>
          ) : (
            <>
              <Button variant="secondary" onClick={() => setShowModal(true)}>Change Password</Button>
              <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ProfilePage;