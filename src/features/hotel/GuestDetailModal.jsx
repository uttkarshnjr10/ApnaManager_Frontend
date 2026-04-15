// src/features/hotel/GuestDetailModal.jsx
import { useState, useEffect } from 'react';
import apiClient from '../../api/apiClient';
import toast from 'react-hot-toast';

// ── Helpers ──────────────────────────────────────────────────

const formatDate = (val) => {
  if (!val) return 'N/A';
  return new Date(val).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

const formatDateTime = (val) => {
  if (!val) return 'N/A';
  return new Date(val).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true,
  });
};

const calcAge = (dob) => {
  if (!dob) return null;
  const birth = new Date(dob);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
  return age >= 0 ? age : null;
};

// ── Sub-components ───────────────────────────────────────────

const Field = ({ label, value }) => (
  <div className="flex flex-col">
    <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">{label}</span>
    <span className="text-sm text-gray-800 mt-0.5">{value || 'N/A'}</span>
  </div>
);

const SectionTitle = ({ children }) => (
  <h3 className="text-sm font-semibold text-blue-700 uppercase tracking-wider border-b border-blue-100 pb-1 mb-3">
    {children}
  </h3>
);

const StatusBadge = ({ status }) => {
  const isCheckedIn = status === 'Checked-In';
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
      isCheckedIn ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
    }`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${isCheckedIn ? 'bg-green-500' : 'bg-gray-400'}`} />
      {status}
    </span>
  );
};

const ImageThumb = ({ src, alt }) => {
  if (!src) return (
    <div className="w-full h-28 rounded bg-gray-100 flex items-center justify-center text-xs text-gray-400">
      Not available
    </div>
  );
  return (
    <img
      src={src}
      alt={alt}
      className="w-full h-28 object-cover rounded border border-gray-200"
      loading="lazy"
      onError={(e) => { e.target.style.display = 'none'; }}
    />
  );
};

const AccompanyingGuestCard = ({ guest, index, type }) => {
  const age = calcAge(guest.dob);
  return (
    <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-gray-700">
          {index + 1}. {guest.name || 'N/A'}
        </span>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
          type === 'Adult' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'
        }`}>
          {type}
        </span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        <Field label="Gender" value={guest.gender} />
        <Field label="DOB" value={age !== null ? `${formatDate(guest.dob)} (${age} yrs)` : formatDate(guest.dob)} />
        {guest.idType && <Field label="ID Type" value={guest.idType} />}
        {guest.idNumber && <Field label="ID Number" value={guest.idNumber} />}
      </div>
    </div>
  );
};

// ── Skeleton ─────────────────────────────────────────────────

const ModalSkeleton = () => (
  <div className="animate-pulse space-y-6 p-6">
    <div className="h-6 bg-gray-200 rounded w-1/3" />
    <div className="grid grid-cols-2 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="space-y-1">
          <div className="h-3 bg-gray-200 rounded w-1/2" />
          <div className="h-4 bg-gray-200 rounded w-3/4" />
        </div>
      ))}
    </div>
    <div className="h-6 bg-gray-200 rounded w-1/4" />
    <div className="grid grid-cols-3 gap-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="h-28 bg-gray-200 rounded" />
      ))}
    </div>
  </div>
);

// ── Main Component ───────────────────────────────────────────

const GuestDetailModal = ({ guestId, isOpen, onClose }) => {
  const [guest, setGuest] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !guestId) return;
    let cancelled = false;

    const fetchGuest = async () => {
      setLoading(true);
      setGuest(null);
      try {
        const res = await apiClient.get(`/guests/${guestId}`);
        if (!cancelled) setGuest(res.data.data);
      } catch {
        if (!cancelled) toast.error('Failed to load guest details');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchGuest();
    return () => { cancelled = true; };
  }, [guestId, isOpen]);

  if (!isOpen) return null;

  const adults = guest?.accompanyingGuests?.adults || [];
  const children = guest?.accompanyingGuests?.children || [];
  const hasAccompanying = adults.length > 0 || children.length > 0;
  const address = guest?.primaryGuest?.address;
  const fullAddress = address
    ? [address.street, address.city, address.state, address.zipCode].filter(Boolean).join(', ')
    : 'N/A';

  const getImageSrc = (field) => field?.signedUrl || field?.url || null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-xl">
            <div>
              <h2 className="text-lg font-bold text-gray-800">Guest Details</h2>
              {guest && (
                <p className="text-xs text-gray-400 mt-0.5">
                  {guest.customerId} · Room {guest.stayDetails?.roomNumber || 'N/A'}
                </p>
              )}
            </div>
            <div className="flex items-center gap-3">
              {guest && <StatusBadge status={guest.status} />}
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
                aria-label="Close modal"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Body */}
          {loading ? (
            <ModalSkeleton />
          ) : guest ? (
            <div className="px-6 py-5 space-y-6">
              {/* ── Primary Guest ── */}
              <section>
                <SectionTitle>Primary Guest</SectionTitle>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-3">
                  <Field label="Full Name" value={guest.primaryGuest?.name} />
                  <Field label="Customer ID" value={guest.customerId} />
                  <Field label="Phone" value={guest.primaryGuest?.phone} />
                  <Field label="Email" value={guest.primaryGuest?.email} />
                  <Field label="Gender" value={guest.primaryGuest?.gender} />
                  <Field label="Date of Birth" value={
                    guest.primaryGuest?.dob
                      ? `${formatDate(guest.primaryGuest.dob)} (${calcAge(guest.primaryGuest.dob)} yrs)`
                      : 'N/A'
                  } />
                  <Field label="Address" value={fullAddress} />
                  <Field label="Nationality" value={guest.primaryGuest?.nationality} />
                </div>
              </section>

              {/* ── Stay Details ── */}
              <section>
                <SectionTitle>Stay Details</SectionTitle>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-3">
                  <Field label="Room Number" value={guest.stayDetails?.roomNumber} />
                  <Field label="Purpose" value={guest.stayDetails?.purposeOfVisit} />
                  <Field label="Check-In" value={formatDateTime(guest.stayDetails?.checkIn)} />
                  <Field label="Expected Checkout" value={formatDateTime(guest.stayDetails?.expectedCheckout)} />
                  {guest.stayDetails?.checkOut && (
                    <Field label="Actual Checkout" value={formatDateTime(guest.stayDetails.checkOut)} />
                  )}
                  <Field label="Registered" value={formatDateTime(guest.registrationTimestamp)} />
                </div>
              </section>

              {/* ── Identity ── */}
              <section>
                <SectionTitle>Identity</SectionTitle>
                <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                  <Field label="ID Type" value={guest.idType} />
                  <Field label="ID Number" value={guest.idNumber} />
                </div>
                <div className="grid grid-cols-3 gap-3 mt-3">
                  <div className="text-center">
                    <span className="text-xs text-gray-400 block mb-1">Live Photo</span>
                    <ImageThumb src={getImageSrc(guest.livePhoto)} alt="Live photo" />
                  </div>
                  <div className="text-center">
                    <span className="text-xs text-gray-400 block mb-1">ID Front</span>
                    <ImageThumb src={getImageSrc(guest.idImageFront)} alt="ID front" />
                  </div>
                  <div className="text-center">
                    <span className="text-xs text-gray-400 block mb-1">ID Back</span>
                    <ImageThumb src={getImageSrc(guest.idImageBack)} alt="ID back" />
                  </div>
                </div>
              </section>

              {/* ── Accompanying Guests ── */}
              {hasAccompanying && (
                <section>
                  <SectionTitle>
                    Accompanying Guests ({adults.length + children.length})
                  </SectionTitle>
                  <div className="space-y-2">
                    {adults.map((g, i) => (
                      <AccompanyingGuestCard key={`adult-${i}`} guest={g} index={i} type="Adult" />
                    ))}
                    {children.map((g, i) => (
                      <AccompanyingGuestCard key={`child-${i}`} guest={g} index={adults.length + i} type="Child" />
                    ))}
                  </div>
                </section>
              )}
            </div>
          ) : (
            <div className="px-6 py-12 text-center text-gray-400 text-sm">
              Unable to load guest details.
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default GuestDetailModal;
