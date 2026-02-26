// src/features/admin/useRegisterUser.js
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import apiClient from '../../api/apiClient';
import toast from 'react-hot-toast';

const initialHotelState = {
  username: '',
  email: '', 
  hotelName: '', 
  ownerName: '',
  gstNumber: '',
  phone: '', 
  address: '',
  city: '',
  state: '',
  pinCode: '',
  nationality: 'Indian', 
  postOffice: '',
  localThana: '',
};

const initialPoliceState = { 
  username: '', 
  station: '', 
  jurisdiction: '', 
  city: '', 
  email: '', 
  policeStation: '' 
};

export const useRegisterUser = () => {
  const location = useLocation();
  const inquiryData = location.state?.inquiryData;

  const [userType, setUserType] = useState('Hotel');
  const [formData, setFormData] = useState(initialHotelState);
  const [policeStations, setPoliceStations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState(null);
  
  // NEW: File state for manual hotel registration
  const [files, setFiles] = useState({
    ownerSignature: null,
    hotelStamp: null,
    aadhaarCard: null,
  });

  // Pre-fill form if coming from inquiry approval
  useEffect(() => {
    if (inquiryData) {
      setUserType('Hotel');
      
      const generatedUsername = inquiryData.email ? inquiryData.email.split('@')[0] : '';
      
      setFormData({
        username: generatedUsername,
        email: inquiryData.email || '',
        hotelName: inquiryData.hotelName || '',
        ownerName: inquiryData.ownerName || '',
        gstNumber: inquiryData.gstNumber || '',
        phone: inquiryData.mobileNumber || '',
        address: inquiryData.fullAddress || '',
        city: inquiryData.district || '', 
        state: inquiryData.state || '',
        pinCode: inquiryData.pinCode || '',
        nationality: inquiryData.nationality || 'Indian',
        postOffice: inquiryData.postOffice || '',
        localThana: inquiryData.localThana || '',
      });

      // Files from inquiry (already uploaded)
      setFiles({
        ownerSignature: inquiryData.ownerSignature || null,
        hotelStamp: inquiryData.hotelStamp || null,
        aadhaarCard: inquiryData.aadhaarCard || null,
      });
    }
  }, [inquiryData]);

  // Fetch police stations
  useEffect(() => {
    const fetchPoliceStations = async () => {
      try {
        const { data } = await apiClient.get('/stations');
        const formattedStations = data.data.map(station => ({
          value: station._id, 
          label: station.name,
        }));
        setPoliceStations(formattedStations);
      } catch (error) {
        toast.error('Could not fetch police stations.');
      }
    };
    fetchPoliceStations();
  }, []);

  const handleTypeChange = (newUserType) => {
    if (inquiryData) {
      toast.error("Cannot change user type when approving an inquiry.");
      return;
    }
    setUserType(newUserType);
    setFormData(newUserType === 'Hotel' ? initialHotelState : initialPoliceState);
    setFiles({ ownerSignature: null, hotelStamp: null, aadhaarCard: null });
    setSuccessData(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // NEW: Handle file input changes
  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;
    if (selectedFiles && selectedFiles[0]) {
      setFiles(prev => ({ ...prev, [name]: selectedFiles[0] }));
    }
  };

  const handleSelectChange = (selectedOption) => {
    setFormData(prev => ({...prev, policeStation: selectedOption.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading('Registering user...');
    
    try {
      let response;
      
      if (userType === 'Hotel') {
        // Check if we need multipart (actual new File objects to upload) or JSON
        const hasNewFiles = files.ownerSignature instanceof File || files.hotelStamp instanceof File || files.aadhaarCard instanceof File;

        if (hasNewFiles) {
          // Use FormData only when there are actual new File objects to upload
          const submissionData = new FormData();
          submissionData.append('role', userType);
          submissionData.append('username', formData.username);
          submissionData.append('email', formData.email);

          // Append all hotel details
          const detailsToSend = {
            hotelName: formData.hotelName,
            ownerName: formData.ownerName,
            gstNumber: formData.gstNumber,
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            pinCode: formData.pinCode,
            nationality: formData.nationality,
            postOffice: formData.postOffice,
            localThana: formData.localThana,
          };

          // Append details as JSON string
          submissionData.append('details', JSON.stringify(detailsToSend));

          // Append NEW file uploads
          if (files.ownerSignature instanceof File) {
            submissionData.append('ownerSignature', files.ownerSignature);
          }
          if (files.hotelStamp instanceof File) {
            submissionData.append('hotelStamp', files.hotelStamp);
          }
          if (files.aadhaarCard instanceof File) {
            submissionData.append('aadhaarCard', files.aadhaarCard);
          }

          response = await apiClient.post('/users/register', submissionData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
        } else {
          // JSON payload — either no files or files are already-uploaded references from inquiry
          const { username, email, ...hotelDetails } = formData;
          const details = { ...hotelDetails };

          // Include already-uploaded file references from inquiry
          if (inquiryData) {
            if (inquiryData.ownerSignature) details.ownerSignature = inquiryData.ownerSignature;
            if (inquiryData.hotelStamp) details.hotelStamp = inquiryData.hotelStamp;
            if (inquiryData.aadhaarCard) details.aadhaarCard = inquiryData.aadhaarCard;
          }

          const payload = {
            role: userType,
            username,
            email, 
            details,
          };
          response = await apiClient.post('/users/register', payload);
        }
      } else { 
        // Police user - always JSON
        const { username, email, policeStation, station, jurisdiction, city } = formData;
        const payload = {
          role: userType,
          username,
          email,
          policeStation, 
          details: {
            station,
            jurisdiction,
            city, 
          }
        };
        response = await apiClient.post('/users/register', payload);
      }

      setSuccessData(response.data.data);
      toast.success(response.data.message || 'User registered successfully!', { id: toastId });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed.', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSuccessData(null);
    setFormData(userType === 'Hotel' ? initialHotelState : initialPoliceState);
    setFiles({ ownerSignature: null, hotelStamp: null, aadhaarCard: null });
  };

  return { 
    userType, 
    formData, 
    files, 
    policeStations, 
    loading, 
    successData, 
    inquiryData, 
    handleTypeChange, 
    handleChange, 
    handleFileChange, 
    handleSelectChange, 
    handleSubmit, 
    resetForm 
  };
};