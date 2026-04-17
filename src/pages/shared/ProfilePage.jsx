import { useState } from 'react';
import { useUserProfile } from '../../features/user/useUserProfile';
import Button from '../../components/ui/Button';
import FormField from '../../components/ui/FormField';
import Card from '../../components/ui/Card';
import Modal from '../../components/ui/Modal';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import apiClient from '../../api/apiClient'; 
import toast from 'react-hot-toast';        
import { FaBuilding, FaLock, FaShieldAlt, FaUserTie } from 'react-icons/fa';

const ROLE_META = {
  Hotel: { icon: <FaBuilding />, tone: 'bg-blue-50 text-blue-700 border-blue-200' },
  Police: { icon: <FaShieldAlt />, tone: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  'Regional Admin': { icon: <FaUserTie />, tone: 'bg-violet-50 text-violet-700 border-violet-200' },
};

const EDITABLE_LABELS = {
  ownerName: 'Owner Name',
  phone: 'Phone',
  address: 'Address',
  city: 'City',
  state: 'State',
  pinCode: 'PIN Code',
  postOffice: 'Post Office',
  localThana: 'Local Thana',
  pinLocation: 'Pin Location',
};

const STATUS_STYLES = {
  Active: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  Suspended: 'bg-red-100 text-red-700 border-red-200',
  Pending: 'bg-amber-100 text-amber-800 border-amber-200',
};

const formatValue = (value) => {
  if (value === null || value === undefined || value === '') return 'N/A';
  return String(value);
};

const formatDateValue = (value) => {
  if (!value) return 'N/A';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'N/A';
  return date.toLocaleDateString();
};

const getRoleSpecificDetails = (profile) => {
  if (profile.role === 'Hotel') {
    return [
      { label: 'Hotel Name', value: profile.hotelName },
      { label: 'Owner Name', value: profile.ownerName },
      { label: 'GST Number', value: profile.gstNumber },
      { label: 'Phone', value: profile.phone },
      { label: 'Address', value: profile.address },
      { label: 'City', value: profile.city },
      { label: 'State', value: profile.state },
      { label: 'PIN Code', value: profile.pinCode },
      { label: 'Nationality', value: profile.nationality },
      { label: 'Post Office', value: profile.postOffice },
      { label: 'Local Thana', value: profile.localThana },
      { label: 'Pin Location', value: profile.pinLocation },
      { label: 'Subscription Status', value: profile.subscriptionStatus },
      { label: 'Subscription Ends', value: formatDateValue(profile.subscriptionPeriodEnd) },
      { label: 'Rooms Configured', value: Array.isArray(profile.rooms) ? profile.rooms.length : 0 },
      { label: 'Owner Signature', value: profile.ownerSignature?.url ? 'Uploaded' : 'Not Uploaded' },
      { label: 'Hotel Stamp', value: profile.hotelStamp?.url ? 'Uploaded' : 'Not Uploaded' },
      { label: 'Aadhaar Card', value: profile.aadhaarCard?.url ? 'Uploaded' : 'Not Uploaded' },
    ];
  }

  if (profile.role === 'Police') {
    return [
      { label: 'Station', value: profile.station },
      { label: 'Jurisdiction', value: profile.jurisdiction },
      { label: 'Rank', value: profile.rank },
      { label: 'Service ID', value: profile.serviceId },
      { label: 'Assigned Station ID', value: profile.policeStation },
    ];
  }

  return [];
};

const DetailItem = ({ label, value }) => (
  <div className="rounded-lg border border-slate-200 bg-slate-50/50 px-4 py-3">
    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
    <p className="mt-1 text-sm font-medium text-slate-800">{formatValue(value)}</p>
  </div>
);

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
      <div className="flex items-center gap-3 mb-4">
        <div className="h-10 w-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
          <FaLock />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">Change Password</h2>
          <p className="text-sm text-slate-500">Use a strong password you have not used before.</p>
        </div>
      </div>
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
  const {
    profile,
    loading,
    isEditing,
    isSaving,
    setIsEditing,
    formData,
    editableFieldKeys,
    updateEmail,
    updateDetailField,
    handleSave,
    handleCancel,
  } = useUserProfile();
  const [showModal, setShowModal] = useState(false);

  const handleEmailChange = (e) => {
    updateEmail(e.target.value);
  };

  const handleEditableDetailChange = (e) => {
    const { name, value } = e.target;
    updateDetailField(name, value);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton height={48} width={220} />
        <Skeleton height={220} />
        <Skeleton height={220} />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
        Could not load profile details.
      </div>
    );
  }

  const roleMeta = ROLE_META[profile.role] || ROLE_META['Regional Admin'];
  const roleSpecificDetails = getRoleSpecificDetails(profile);
  const hasEditableDetails = editableFieldKeys.length > 0;

  return (
    <>
      {showModal && <ChangePasswordModal onClose={() => setShowModal(false)} />}
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <h1 className="text-3xl font-bold text-slate-800">My Profile</h1>
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" onClick={() => setShowModal(true)}>
              Change Password
            </Button>
            {isEditing ? (
              <>
                <Button variant="secondary" onClick={handleCancel} disabled={isSaving}>Cancel</Button>
                <Button onClick={handleSave} disabled={isSaving}>{isSaving ? 'Saving...' : 'Save Changes'}</Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <Card>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className={`h-12 w-12 rounded-xl border flex items-center justify-center ${roleMeta.tone}`}>
                  {roleMeta.icon}
                </div>
                <div>
                  <p className="text-lg font-bold text-slate-900">{profile.username}</p>
                  <p className="text-sm text-slate-500">{profile.role}</p>
                </div>
              </div>

              <div className="space-y-2 border-t border-slate-100 pt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Status</span>
                  <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${STATUS_STYLES[profile.status] || 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                    {profile.status || 'N/A'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Member Since</span>
                  <span className="font-medium text-slate-800">{formatDateValue(profile.createdAt)}</span>
                </div>
              </div>
            </div>
          </Card>

          <Card className="xl:col-span-2">
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-slate-800">Account Information</h2>
                <p className="text-sm text-slate-500 mt-1">Your role details are shown below. Only practical and safe fields can be edited.</p>
              </div>

              {!isEditing ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <DetailItem label="Username" value={profile.username} />
                    <DetailItem label="Role" value={profile.role} />
                    <DetailItem label="Email" value={profile.email} />
                    <DetailItem label="Password Reset Required" value={profile.passwordChangeRequired ? 'Yes' : 'No'} />
                  </div>

                  {roleSpecificDetails.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500 mb-3">Role Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {roleSpecificDetails.map((item) => (
                          <DetailItem key={item.label} label={item.label} value={item.value} />
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="space-y-4">
                  <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-3 text-sm text-blue-700">
                    Only safe profile fields are editable here.
                  </div>

                  <FormField
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleEmailChange}
                  />

                  {hasEditableDetails && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {editableFieldKeys.map((fieldKey) => (
                        <FormField
                          key={fieldKey}
                          label={EDITABLE_LABELS[fieldKey] || fieldKey}
                          name={fieldKey}
                          value={formData.details?.[fieldKey] || ''}
                          onChange={handleEditableDetailChange}
                        />
                      ))}
                    </div>
                  )}

                  {!hasEditableDetails && (
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                      Additional role details are managed by administrators and are read-only.
                    </div>
                  )}
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;