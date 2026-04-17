// src/features/user/useUserProfile.js
import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import apiClient from '../../api/apiClient';

const EDITABLE_FIELDS_BY_ROLE = {
  Hotel: ['ownerName', 'phone', 'address', 'city', 'state', 'pinCode', 'postOffice', 'localThana', 'pinLocation'],
  Police: [],
  'Regional Admin': [],
};

const getEditableFieldKeys = (role) => EDITABLE_FIELDS_BY_ROLE[role] || [];

const buildFormDataFromProfile = (profile) => {
  if (!profile) return { email: '', details: {} };

  const editableFields = getEditableFieldKeys(profile.role);
  const details = editableFields.reduce((acc, key) => {
    acc[key] = profile[key] || '';
    return acc;
  }, {});

  return {
    email: profile.email || '',
    details,
  };
};

export const useUserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({ email: '', details: {} });

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch the current user's profile data
      const { data } = await apiClient.get('/users/profile');
      const profileData = data.data;
      setProfile(profileData);
      setFormData(buildFormDataFromProfile(profileData));
    } catch {
      toast.error('Could not fetch profile.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleSave = async () => {
    if (!profile) return;

    const toastId = toast.loading('Updating profile...');
    setIsSaving(true);

    const editableFieldKeys = getEditableFieldKeys(profile.role);
    const safeDetails = editableFieldKeys.reduce((acc, key) => {
      acc[key] = formData.details?.[key] || '';
      return acc;
    }, {});

    try {
      await apiClient.put('/users/profile', {
        email: formData.email,
        details: safeDetails,
      });
      toast.success('Profile updated successfully!', { id: toastId });
      setIsEditing(false);
      fetchProfile(); // Refresh profile data
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile.', { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData(buildFormDataFromProfile(profile));
  };

  const updateEmail = (email) => {
    setFormData((prev) => ({ ...prev, email }));
  };

  const updateDetailField = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      details: {
        ...prev.details,
        [key]: value,
      },
    }));
  };

  return {
    profile,
    loading,
    isEditing,
    isSaving,
    setIsEditing,
    formData,
    editableFieldKeys: getEditableFieldKeys(profile?.role),
    updateEmail,
    updateDetailField,
    handleSave,
    handleCancel,
  };
};
