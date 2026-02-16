// src/pages/admin/RegisterUserPage.jsx
import Select from 'react-select';
import { useRegisterUser } from '../../features/admin/useRegisterUser';
import FormField from '../../components/ui/FormField';
import Button from '../../components/ui/Button';
import { FaCopy, FaUpload } from 'react-icons/fa';
import toast from 'react-hot-toast';

const SuccessDisplay = ({ username, password, onReset }) => {
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg max-w-lg mx-auto text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-green-600 mb-2">User Registered Successfully!</h2>
      <p className="text-gray-600 mb-6">Please securely share these credentials with the new user.</p>
      <div className="space-y-3 text-left bg-gray-50 p-4 rounded-lg">
        <div className="flex justify-between items-center p-3 bg-white rounded-md shadow-sm">
          <span className="font-semibold text-gray-700">Username:</span>
          <div className="flex items-center gap-3">
            <code className="text-blue-600 font-mono">{username}</code>
            <FaCopy className="cursor-pointer text-gray-400 hover:text-blue-600 transition-colors" onClick={() => copyToClipboard(username)} />
          </div>
        </div>
        <div className="flex justify-between items-center p-3 bg-white rounded-md shadow-sm">
          <span className="font-semibold text-gray-700">Temp Password:</span>
          <div className="flex items-center gap-3">
            <code className="text-blue-600 font-mono">{password}</code>
            <FaCopy className="cursor-pointer text-gray-400 hover:text-blue-600 transition-colors" onClick={() => copyToClipboard(password)} />
          </div>
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-4 mb-6">
        The user will be required to change their password on first login.
      </p>
      <Button onClick={onReset} className="w-full">Register Another User</Button>
    </div>
  );
};

// File Input Component
const FileInputField = ({ label, name, file, onChange, required = false, fromInquiry = false }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
      {fromInquiry && <span className="text-green-600 text-xs ml-2">(From Inquiry)</span>}
    </label>
    {fromInquiry && file?.url ? (
      <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <span className="text-sm text-green-700 flex-1">File already uploaded from inquiry</span>
        <a 
          href={file.url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-xs text-blue-600 hover:underline"
        >
          View
        </a>
      </div>
    ) : (
      <>
        <div className="relative">
          <input
            type="file"
            name={name}
            onChange={onChange}
            required={required}
            accept="image/*,.pdf"
            className="block w-full text-sm text-gray-500 
                       file:mr-4 file:py-2.5 file:px-4 
                       file:rounded-lg file:border-0 
                       file:text-sm file:font-semibold 
                       file:bg-blue-50 file:text-blue-700 
                       hover:file:bg-blue-100 
                       cursor-pointer border border-gray-300 rounded-lg
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {file && file instanceof File && (
          <p className="text-xs text-gray-600 mt-2 flex items-center gap-1">
            <FaUpload className="text-green-500" />
            Selected: {file.name} ({(file.size / 1024).toFixed(1)} KB)
          </p>
        )}
      </>
    )}
  </div>
);

const RegisterUserPage = () => {
  const { 
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
  } = useRegisterUser();

  if (successData) {
    return <SuccessDisplay username={successData.username} password={successData.password} onReset={resetForm} />;
  }

  const isFromInquiry = !!inquiryData;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Register New User</h1>
      <p className="text-gray-600 mb-6">Create credentials for hotel staff or police officers</p>
      
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-md">
        {/* User Type Switcher */}
        <div className="flex justify-center mb-8 p-1 bg-gray-100 rounded-xl shadow-inner">
          <button
            onClick={() => handleTypeChange('Hotel')}
            disabled={isFromInquiry}
            className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
              userType === 'Hotel' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'text-gray-600 hover:text-gray-800'
            } ${isFromInquiry ? 'cursor-not-allowed opacity-60' : ''}`}
          >
            Hotel
          </button>
          <button
            onClick={() => handleTypeChange('Police')}
            disabled={isFromInquiry}
            className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
              userType === 'Police' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'text-gray-600 hover:text-gray-800'
            } ${isFromInquiry ? 'cursor-not-allowed opacity-60' : ''}`}
          >
            Police
          </button>
        </div>

        {isFromInquiry && (
          <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
            <p className="text-sm text-blue-700 font-medium">
              📋 Form pre-filled from inquiry approval. Documents are already uploaded.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Common Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="e.g., john.doe"
            />
            <FormField 
              label="Contact Email" 
              name="email"
              type="email" 
              value={formData.email} 
              onChange={handleChange} 
              required 
              placeholder="user@example.com"
            />
          </div>

          {userType === 'Hotel' ? (
            <>
              {/* Hotel Basic Info */}
              <fieldset className="border border-gray-200 rounded-lg p-6 space-y-6">
                <legend className="text-lg font-semibold text-gray-800 px-2">Hotel Information</legend>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField 
                    label="Hotel Name" 
                    name="hotelName"
                    value={formData.hotelName} 
                    onChange={handleChange} 
                    required 
                    placeholder="e.g., Grand Plaza Hotel"
                  />
                  <FormField 
                    label="Owner Name" 
                    name="ownerName" 
                    value={formData.ownerName} 
                    onChange={handleChange} 
                    required 
                    placeholder="Full name of owner"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField 
                    label="GST Number" 
                    name="gstNumber"
                    value={formData.gstNumber} 
                    onChange={handleChange} 
                    required 
                    placeholder="22AAAAA0000A1Z5"
                  />
                  <FormField 
                    label="Mobile Number" 
                    name="phone"
                    type="tel"
                    value={formData.phone} 
                    onChange={handleChange} 
                    required 
                    placeholder="1234567890"
                  />
                </div>
              </fieldset>

              {/* Hotel Address */}
              <fieldset className="border border-gray-200 rounded-lg p-6 space-y-6">
                <legend className="text-lg font-semibold text-gray-800 px-2">Address Details</legend>
                
                <FormField 
                  label="Full Address" 
                  name="address" 
                  value={formData.address} 
                  onChange={handleChange} 
                  required 
                  placeholder="Street address, landmark"
                />
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField 
                    label="District/City" 
                    name="city" 
                    value={formData.city} 
                    onChange={handleChange} 
                    required 
                    placeholder="Mumbai"
                  />
                  <FormField 
                    label="State" 
                    name="state" 
                    value={formData.state} 
                    onChange={handleChange} 
                    required 
                    placeholder="Maharashtra"
                  />
                  <FormField 
                    label="Pin Code" 
                    name="pinCode" 
                    value={formData.pinCode} 
                    onChange={handleChange} 
                    required 
                    placeholder="400001"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField 
                    label="Post Office" 
                    name="postOffice" 
                    value={formData.postOffice} 
                    onChange={handleChange} 
                    required
                    placeholder="Local post office"
                  />
                  <FormField 
                    label="Local Thana" 
                    name="localThana" 
                    value={formData.localThana} 
                    onChange={handleChange} 
                    required
                    placeholder="Police station"
                  />
                  <FormField 
                    label="Nationality" 
                    name="nationality" 
                    value={formData.nationality} 
                    onChange={handleChange} 
                    required
                    placeholder="Indian"
                  />
                </div>
              </fieldset>

              {/* FIXED: Document Uploads */}
              <fieldset className="border border-gray-200 rounded-lg p-6 space-y-6">
                <legend className="text-lg font-semibold text-gray-800 px-2">Document Uploads</legend>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FileInputField 
                    label="Owner Signature" 
                    name="ownerSignature" 
                    file={files.ownerSignature} 
                    onChange={handleFileChange} 
                    required={!isFromInquiry}
                    fromInquiry={isFromInquiry && !!files.ownerSignature?.url}
                  />
                  <FileInputField 
                    label="Hotel Stamp" 
                    name="hotelStamp" 
                    file={files.hotelStamp} 
                    onChange={handleFileChange} 
                    required={!isFromInquiry}
                    fromInquiry={isFromInquiry && !!files.hotelStamp?.url}
                  />
                </div>
                
                <FileInputField 
                  label="Owner Aadhaar Card (Optional)" 
                  name="aadhaarCard" 
                  file={files.aadhaarCard} 
                  onChange={handleFileChange} 
                  required={false}
                  fromInquiry={isFromInquiry && !!files.aadhaarCard?.url}
                />
              </fieldset>
            </>
          ) : (
            /* Police Fields */
            <fieldset className="border border-gray-200 rounded-lg p-6 space-y-6">
              <legend className="text-lg font-semibold text-gray-800 px-2">Police Officer Details</legend>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField 
                  label="Station Name" 
                  name="station" 
                  value={formData.station} 
                  onChange={handleChange} 
                  required 
                  placeholder="e.g., Central Police Station"
                />
                <FormField 
                  label="Jurisdiction" 
                  name="jurisdiction" 
                  value={formData.jurisdiction} 
                  onChange={handleChange} 
                  required 
                  placeholder="e.g., Zone 1"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assign to Police Station <span className="text-red-500">*</span>
                </label>
                <Select 
                  options={policeStations} 
                  onChange={handleSelectChange} 
                  placeholder="Search and select a station..." 
                  required 
                  className="react-select-container"
                  classNamePrefix="react-select"
                />
              </div>
              
              <FormField 
                label="City" 
                name="city" 
                value={formData.city} 
                onChange={handleChange} 
                required 
                placeholder="e.g., Mumbai"
              />
            </fieldset>
          )}

          {/* Submit Button */}
          <div className="pt-4">
            <Button 
              type="submit" 
              disabled={loading} 
              className="w-full py-3.5 text-base font-semibold"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Registering...
                </span>
              ) : (
                'Register User'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterUserPage;