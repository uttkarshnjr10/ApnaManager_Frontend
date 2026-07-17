// src/pages/public/HotelRegistrationPage.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX } from 'react-icons/fi';
import { FaUpload, FaFileAlt } from 'react-icons/fa';
import { useHotelInquiryForm } from '../../features/admin/useHotelInquiryForm';
import FormField from '../../components/ui/FormField';
import Button from '../../components/ui/Button';
import Footer from '../../components/layout/LandingPage/Footer';

const Motion = motion;

const FileInputField = ({ label, name, file, onChange, required = false }) => (
  <div className="flex flex-col gap-2">
    <span className="text-sm font-bold text-[#5C5346] flex items-center gap-1">
      {label}
      {required && <span className="text-red-500">*</span>}
    </span>
    <label className="relative flex items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-[#DED7CD] bg-[#FAF8F5] p-5 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50/20 transition-all duration-200 group">
      <input
        type="file"
        name={name}
        onChange={onChange}
        required={required}
        className="sr-only"
      />
      {file ? (
        <div className="flex items-center gap-2.5 text-left text-sm text-[#1F1C18]">
          <FaFileAlt className="text-blue-600 flex-shrink-0" size={18} />
          <div className="truncate max-w-[200px] sm:max-w-xs">
            <p className="font-bold truncate text-[#1F1C18]">{file.name}</p>
            <p className="text-xs text-[#9E9587]">Selected file</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-1.5 text-sm text-[#7C756B]">
          <FaUpload className="text-[#9E9587] group-hover:text-blue-600 transition-colors" size={18} />
          <span className="font-bold text-[#5C5346] group-hover:text-blue-600 transition-colors">Choose file to upload</span>
          <span className="text-xs text-[#9E9587]">PDF, JPG, PNG up to 10MB</span>
        </div>
      )}
    </label>
  </div>
);

const HotelRegistrationPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const closeMenu = () => setMobileMenuOpen(false);

  const { formData, files, isSubmitting, handleInputChange, handleFileChange, handleSubmit } =
    useHotelInquiryForm();

  return (
    <div className="font-poppins bg-[#FAF8F5] min-h-screen flex flex-col text-[#2C2925] selection:bg-blue-600/10 scroll-smooth">
      {/* Top Header */}
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-[#EBE6DD]/60 bg-[#FAF8F5]/85 backdrop-blur-md transition-all duration-300">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center" onClick={closeMenu}>
            <img src="/logo.png" alt="ApnaManager Logo" className="h-9 w-auto object-contain" />
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <Link to="/" className="text-sm font-bold text-[#5C5346] hover:text-blue-600 transition-colors duration-150">
              Home
            </Link>
            <Link to="/why-us" className="text-sm font-bold text-[#5C5346] hover:text-blue-600 transition-colors duration-150">
              Why Us
            </Link>
            <Link to="/hotel-registration" className="text-sm font-bold text-blue-600 transition-colors duration-150">
              Register Hotel
            </Link>
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <Link
              to="/login"
              className="inline-flex min-h-10 items-center justify-center rounded-xl bg-blue-600 px-5 text-sm font-bold text-white shadow-sm shadow-blue-600/15 hover:bg-blue-700 transition-all hover:scale-[1.02] active:scale-95"
            >
              Sign In
            </Link>
          </div>

          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#EBE6DD] bg-white text-[#2C2925] hover:bg-[#F2EDE4] transition-colors md:hidden"
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-label="Open navigation menu"
          >
            {mobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <Motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-[#1F1C18]/30 backdrop-blur-sm md:hidden"
              aria-label="Close navigation"
              onClick={closeMenu}
            />
            <Motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="fixed left-0 right-0 top-16 z-50 border-b border-[#EBE6DD] bg-[#FAF8F5] p-5 shadow-xl rounded-b-3xl md:hidden"
            >
              <div className="mx-auto flex flex-col gap-3">
                <Link to="/" onClick={closeMenu} className="flex items-center rounded-2xl px-4 py-3 text-sm font-bold text-[#2C2925] hover:bg-[#F2EDE4] transition-all">
                  Home
                </Link>
                <Link to="/why-us" onClick={closeMenu} className="flex items-center rounded-2xl px-4 py-3 text-sm font-bold text-[#2C2925] hover:bg-[#F2EDE4] transition-all">
                  Why Us
                </Link>
                <Link to="/hotel-registration" onClick={closeMenu} className="flex items-center rounded-2xl px-4 py-3 text-sm font-bold text-blue-600 bg-[#F2EDE4]/50 transition-all">
                  Register Hotel
                </Link>
                <Link to="/login" onClick={closeMenu} className="mt-2 inline-flex min-h-12 items-center justify-center rounded-2xl bg-blue-600 px-5 text-sm font-bold text-white shadow-md shadow-blue-600/15">
                  Sign In
                </Link>
              </div>
            </Motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-grow pt-28 pb-16 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#DED7CD] bg-[#F2EDE4] px-4 py-1.5 text-xs font-semibold tracking-wide text-[#5C5346] mb-4">
            <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
            Partner Onboarding Portal
          </span>
          <h1 className="text-3xl font-black tracking-tight text-[#1F1C18] sm:text-4xl md:text-5xl leading-tight">
            Register Your <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Hotel</span>
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-[#7C756B] sm:text-base max-w-xl mx-auto">
            Submit your onboarding details below. Our verification team will review your application and establish credentials.
          </p>
        </div>

        <div className="max-w-4xl mx-auto border border-[#EBE6DD] bg-white p-6 sm:p-10 rounded-3xl shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Basic Information */}
            <fieldset className="space-y-6">
              <legend className="text-lg font-bold text-[#1F1C18] border-b border-[#EBE6DD] pb-2 w-full mb-2">
                Basic Information
              </legend>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField label="Hotel Name" name="hotelName" value={formData.hotelName} onChange={handleInputChange} required />
                <FormField label="GST Number" name="gstNumber" value={formData.gstNumber} onChange={handleInputChange} required />
                <FormField label="Owner Name" name="ownerName" value={formData.ownerName} onChange={handleInputChange} required />
                <FormField label="Hotel / Owner Email" name="email" type="email" value={formData.email} onChange={handleInputChange} required />
                <FormField label="Hotel Mobile Number" name="mobileNumber" type="tel" value={formData.mobileNumber} onChange={handleInputChange} required />
              </div>
            </fieldset>

            {/* Address Details */}
            <fieldset className="space-y-6">
              <legend className="text-lg font-bold text-[#1F1C18] border-b border-[#EBE6DD] pb-2 w-full mb-2">
                Address Details
              </legend>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField label="State" name="state" value={formData.state} onChange={handleInputChange} required />
                <FormField label="District" name="district" value={formData.district} onChange={handleInputChange} required />
                <FormField label="Post Office" name="postOffice" value={formData.postOffice} onChange={handleInputChange} required />
                <FormField label="Local Thana" name="localThana" value={formData.localThana} onChange={handleInputChange} required />
                <FormField label="Pin Code" name="pinCode" value={formData.pinCode} onChange={handleInputChange} required />
                <FormField label="Full Address" name="fullAddress" value={formData.fullAddress} onChange={handleInputChange} required className="md:col-span-2" />
              </div>
            </fieldset>

            {/* Document Uploads */}
            <fieldset className="space-y-6">
              <legend className="text-lg font-bold text-[#1F1C18] border-b border-[#EBE6DD] pb-2 w-full mb-2">
                Document Uploads
              </legend>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FileInputField label="Shop Owner Signature" name="ownerSignature" file={files.ownerSignature} onChange={handleFileChange} required={true} />
                <FileInputField label="Hotel Stamp / Shop Mohar" name="hotelStamp" file={files.hotelStamp} onChange={handleFileChange} required={true} />
                <FileInputField label="Owner Aadhaar Card (Optional)" name="aadhaarCard" file={files.aadhaarCard} onChange={handleFileChange} required={false} />
              </div>
            </fieldset>

            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto inline-flex min-h-12 items-center justify-center rounded-xl bg-blue-600 px-8 text-sm font-bold text-white shadow-md shadow-blue-600/15 hover:bg-blue-700 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Request'}
              </Button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HotelRegistrationPage;