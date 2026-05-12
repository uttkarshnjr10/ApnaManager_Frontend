// src/features/guest/GuestRegistrationForm.jsx
import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FaCheck, FaChevronDown, FaChevronLeft, FaChevronRight, FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import { useGuestForm } from './useGuestForm';
import { differenceInYears, parseISO, format } from 'date-fns';
import Button from '../../components/ui/Button';
import FormField from '../../components/ui/FormField';
import PhotoUpload from '../../components/ui/PhotoUpload';
import WebcamModal from '../../components/ui/WebcamModal';

const Motion = motion;

const steps = [
  { title: 'Guest Identity', subtitle: 'Capture the primary guest details used for verification.' },
  { title: 'Address & Stay', subtitle: 'Add address, visit purpose, timing, and room allocation.' },
  { title: 'ID Verification', subtitle: 'Capture ID information and required photos.' },
  { title: 'Accompanying Guests', subtitle: 'Add companions staying with the primary guest.' },
  { title: 'Review & Submit', subtitle: 'Confirm the details before registering the guest.' },
];

const pageVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 60 : -60,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction) => ({
    x: direction < 0 ? 60 : -60,
    opacity: 0,
  }),
};

const fieldGrid = 'grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5';
const selectClasses = 'apna-input appearance-none pr-10';

const StepIndicator = ({ currentStep }) => (
  <div className="mb-6">
    <div className="relative flex items-start justify-between">
      <div className="absolute left-4 right-4 top-4 hidden h-px bg-slate-200 md:block" />
      {steps.map((step, index) => {
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;

        return (
          <div key={step.title} className="relative z-10 flex flex-1 flex-col items-center gap-2">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-colors ${
                isActive || isCompleted
                  ? 'bg-blue-600 text-white'
                  : 'border border-slate-200 bg-white text-slate-400'
              }`}
            >
              {isCompleted ? <FaCheck size={12} /> : index + 1}
            </div>
            <span className={`hidden text-center text-xs font-medium md:block ${isActive ? 'text-blue-700' : 'text-slate-400'}`}>
              {step.title}
            </span>
          </div>
        );
      })}
    </div>
  </div>
);

const SelectField = ({ label, name, value, onChange, error, children, disabled = false }) => (
  <div>
    <label htmlFor={name} className="mb-1.5 block text-sm font-medium text-slate-700">{label}</label>
    <div className="relative">
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={selectClasses}
      >
        {children}
      </select>
      <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400">
        <FaChevronDown className="text-xs" />
      </span>
    </div>
    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
  </div>
);

const ReviewField = ({ label, value }) => (
  <div>
    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p>
    <p className="mt-1 break-words text-sm font-medium text-slate-800">
      {value === null || value === undefined || value === '' ? 'Not provided' : value}
    </p>
  </div>
);

const ReviewSection = ({ title, stepIndex, onEdit, children }) => (
  <section className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
    <div className="mb-4 flex items-center justify-between gap-3">
      <h3 className="text-base font-semibold text-slate-800">{title}</h3>
      <button
        type="button"
        onClick={() => onEdit(stepIndex)}
        className="inline-flex min-h-8 items-center gap-1.5 rounded-full bg-blue-50 px-3 text-xs font-medium text-blue-700 transition-colors hover:bg-blue-100"
      >
        <FaEdit size={11} /> Edit
      </button>
    </div>
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{children}</div>
  </section>
);

const AccompanyingGuestCard = ({
  guest,
  index,
  expanded,
  onToggle,
  onRemove,
  onGuestChange,
  onDobChange,
  openWebcam,
  errors,
  idTypeOptions,
}) => (
  <div className="rounded-xl border border-slate-100 bg-white shadow-sm">
    <div className="flex items-center justify-between gap-3 px-4 py-3">
      <button type="button" onClick={onToggle} className="min-w-0 flex-1 text-left">
        <p className="truncate text-sm font-semibold text-slate-800">{guest.name || `Guest ${index + 2}`}</p>
        <p className="text-xs text-slate-400">{guest.age ? `${guest.age} years` : 'Details pending'}</p>
      </button>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={onToggle}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-blue-50 hover:text-blue-600"
          aria-label="Edit accompanying guest"
        >
          <FaEdit />
        </button>
        <button
          type="button"
          onClick={onRemove}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
          aria-label="Remove accompanying guest"
        >
          <FaTrash />
        </button>
      </div>
    </div>

    {expanded && (
      <div className="space-y-5 border-t border-slate-100 p-4">
        <div className={fieldGrid}>
          <FormField
            label={`Guest ${index + 2} Name *`}
            name="name"
            value={guest.name}
            onChange={(e) => onGuestChange(index, 'name', e.target.value)}
            error={errors[`accompanying_${index}_name`]}
          />
          <FormField
            label="Date of Birth *"
            name="dob"
            type="date"
            value={guest.dob}
            onChange={(e) => onDobChange(e, index)}
            error={errors[`accompanying_${index}_dob`]}
          />
          <FormField label="Age" name="age" type="number" value={guest.age} disabled className="bg-slate-50" />
          <SelectField
            label="Gender *"
            name={`gender-${index}`}
            value={guest.gender}
            onChange={(e) => onGuestChange(index, 'gender', e.target.value)}
            error={errors[`accompanying_${index}_gender`]}
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </SelectField>
          <SelectField
            label="ID Type"
            name={`idType-${index}`}
            value={guest.idType || ''}
            onChange={(e) => onGuestChange(index, 'idType', e.target.value)}
          >
            <option value="">Select ID Type</option>
            {idTypeOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </SelectField>
          <FormField
            label="ID Number"
            name="idNumber"
            value={guest.idNumber || ''}
            onChange={(e) => onGuestChange(index, 'idNumber', e.target.value)}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <PhotoUpload label="ID Front (Optional)" onCaptureClick={() => openWebcam('accompanying_idImageFront', index)} imageSrc={guest.idImageFront} />
          <PhotoUpload label="ID Back (Optional)" onCaptureClick={() => openWebcam('accompanying_idImageBack', index)} imageSrc={guest.idImageBack} />
          <PhotoUpload label="Live Photo (Optional)" onCaptureClick={() => openWebcam('accompanying_livePhoto', index)} imageSrc={guest.livePhoto} />
        </div>
      </div>
    )}
  </div>
);

const GuestRegistrationForm = () => {
  const {
    formState,
    errors,
    isSubmitting,
    isWebcamOpen,
    handleChange,
    handleGuestChange,
    handleSubmit,
    openWebcam,
    closeWebcam,
    handleCapture,
    addGuest,
    removeGuest,
    vacantRooms,
    isRoomsLoading,
  } = useGuestForm();

  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [expandedGuestIndex, setExpandedGuestIndex] = useState(null);

  const idTypeOptions = useMemo(() => ['Aadhaar', 'Passport', 'Voter ID', 'Driving License'], []);
  const minCheckInDate = format(new Date(), "yyyy-MM-dd'T'HH:mm");

  const handleDobChange = (e, index = null) => {
    const { name, value } = e.target;
    if (index !== null) {
      handleGuestChange(index, name, value);
    } else {
      handleChange(e);
    }
    if (value) {
      const age = differenceInYears(new Date(), parseISO(value)).toString();
      if (index !== null) {
        handleGuestChange(index, 'age', age);
      } else {
        handleChange({ target: { name: 'age', value: age } });
      }
    } else if (index !== null) {
      handleGuestChange(index, 'age', '');
    } else {
      handleChange({ target: { name: 'age', value: '' } });
    }
  };

  const goToStep = (stepIndex) => {
    setDirection(stepIndex > currentStep ? 1 : -1);
    setCurrentStep(stepIndex);
  };

  const goNext = () => {
    if (currentStep < steps.length - 1) {
      setDirection(1);
      setCurrentStep((step) => step + 1);
    }
  };

  const goBack = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep((step) => step - 1);
    }
  };

  const handleAddGuest = () => {
    setExpandedGuestIndex(formState.accompanyingGuests.length);
    addGuest();
  };

  const handleRemoveGuest = (index) => {
    removeGuest(index);
    setExpandedGuestIndex(null);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className={fieldGrid}>
            <FormField label="Full Name *" name="name" value={formState.name} onChange={handleChange} error={errors.name} />
            <FormField label="Date of Birth *" name="dob" type="date" value={formState.dob} onChange={handleDobChange} error={errors.dob} />
            <SelectField label="Gender *" name="gender" value={formState.gender} onChange={handleChange} error={errors.gender}>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </SelectField>
            <FormField label="Phone Number *" name="phone" type="tel" value={formState.phone} onChange={handleChange} error={errors.phone} />
            <FormField label="Email *" name="email" type="email" value={formState.email} onChange={handleChange} error={errors.email} />
          </div>
        );
      case 1:
        return (
          <div className="space-y-5">
            <div className={fieldGrid}>
              <FormField label="State *" name="address.state" value={formState.address.state} onChange={handleChange} error={errors['address.state']} />
              <FormField label="City *" name="address.city" value={formState.address.city} onChange={handleChange} error={errors['address.city']} />
              <FormField label="Pin code *" name="address.zipCode" value={formState.address.zipCode} onChange={handleChange} error={errors['address.zipCode']} />
              <FormField label="Nationality *" name="nationality" value={formState.nationality} onChange={handleChange} error={errors.nationality} />
            </div>
            <div className={fieldGrid}>
              <FormField label="Purpose of Visit *" name="purpose" value={formState.purpose} onChange={handleChange} error={errors.purpose} />
              <FormField label="Check-In Time *" name="checkIn" type="datetime-local" value={formState.checkIn} onChange={handleChange} min={minCheckInDate} error={errors.checkIn} />
              <FormField label="Expected Checkout *" name="expectedCheckout" type="datetime-local" value={formState.expectedCheckout} onChange={handleChange} min={formState.checkIn} error={errors.expectedCheckout} />
              <SelectField
                label="Allocated Room Number *"
                name="roomNumber"
                value={formState.roomNumber}
                onChange={handleChange}
                disabled={isRoomsLoading || vacantRooms.length === 0}
                error={errors.roomNumber}
              >
                <option value="">
                  {isRoomsLoading
                    ? 'Loading vacant rooms...'
                    : vacantRooms.length === 0
                      ? 'No vacant rooms available'
                      : 'Select a vacant room...'}
                </option>
                {vacantRooms.map((roomNum) => (
                  <option key={roomNum} value={roomNum}>{roomNum}</option>
                ))}
              </SelectField>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-5">
            <div className={fieldGrid}>
              <SelectField label="ID Proof Type *" name="idType" value={formState.idType} onChange={handleChange} error={errors.idType}>
                <option value="">Select ID Type</option>
                {idTypeOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </SelectField>
              <FormField label="ID Number *" name="idNumber" value={formState.idNumber} onChange={handleChange} error={errors.idNumber} />
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <PhotoUpload label="ID Proof Front *" onCaptureClick={() => openWebcam('idImageFront')} imageSrc={formState.idImageFront} error={errors.idImageFront} />
              <PhotoUpload label="ID Proof Back *" onCaptureClick={() => openWebcam('idImageBack')} imageSrc={formState.idImageBack} error={errors.idImageBack} />
              <PhotoUpload label="Live Photo *" onCaptureClick={() => openWebcam('livePhoto')} imageSrc={formState.livePhoto} error={errors.livePhoto} />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            {formState.accompanyingGuests.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-5 py-8 text-center">
                <h3 className="text-sm font-semibold text-slate-700">No accompanying guests added</h3>
                <p className="mt-1 text-sm text-slate-500">Add companions only when they are staying in the same room.</p>
              </div>
            ) : (
              formState.accompanyingGuests.map((guest, index) => (
                <AccompanyingGuestCard
                  key={index}
                  guest={guest}
                  index={index}
                  expanded={expandedGuestIndex === index}
                  onToggle={() => setExpandedGuestIndex(expandedGuestIndex === index ? null : index)}
                  onRemove={() => handleRemoveGuest(index)}
                  onGuestChange={handleGuestChange}
                  onDobChange={handleDobChange}
                  openWebcam={openWebcam}
                  errors={errors}
                  idTypeOptions={idTypeOptions}
                />
              ))
            )}
            <button
              type="button"
              onClick={handleAddGuest}
              className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 py-3 text-sm font-medium text-slate-500 transition-colors duration-150 hover:border-blue-400 hover:text-blue-600"
            >
              <FaPlus /> Add Guest
            </button>
          </div>
        );
      default:
        return (
          <div className="space-y-4">
            <ReviewSection title="Guest Identity" stepIndex={0} onEdit={goToStep}>
              <ReviewField label="Name" value={formState.name} />
              <ReviewField label="DOB" value={formState.dob} />
              <ReviewField label="Gender" value={formState.gender} />
              <ReviewField label="Phone" value={formState.phone} />
              <ReviewField label="Email" value={formState.email} />
            </ReviewSection>
            <ReviewSection title="Stay Details" stepIndex={1} onEdit={goToStep}>
              <ReviewField label="State" value={formState.address.state} />
              <ReviewField label="City" value={formState.address.city} />
              <ReviewField label="Pin" value={formState.address.zipCode} />
              <ReviewField label="Nationality" value={formState.nationality} />
              <ReviewField label="Purpose" value={formState.purpose} />
              <ReviewField label="Room" value={formState.roomNumber} />
              <ReviewField label="Check-in" value={formState.checkIn} />
              <ReviewField label="Checkout" value={formState.expectedCheckout} />
            </ReviewSection>
            <ReviewSection title="ID Information" stepIndex={2} onEdit={goToStep}>
              <ReviewField label="ID Type" value={formState.idType} />
              <ReviewField label="ID Number" value={formState.idNumber} />
              <ReviewField label="ID Front" value={formState.idImageFront ? 'Captured' : 'Missing'} />
              <ReviewField label="ID Back" value={formState.idImageBack ? 'Captured' : 'Missing'} />
              <ReviewField label="Live Photo" value={formState.livePhoto ? 'Captured' : 'Missing'} />
            </ReviewSection>
            <ReviewSection title="Accompanying Guests" stepIndex={3} onEdit={goToStep}>
              <ReviewField label="Count" value={formState.accompanyingGuests.length} />
              <ReviewField
                label="Guests"
                value={
                  formState.accompanyingGuests.length > 0
                    ? formState.accompanyingGuests.map((guest, index) => guest.name || `Guest ${index + 2}`).join(', ')
                    : 'None'
                }
              />
            </ReviewSection>
            <Button type="submit" disabled={isSubmitting} className="mt-2 hidden w-full rounded-xl py-3 md:inline-flex">
              {isSubmitting ? 'Registering...' : 'Confirm & Register Guest'}
            </Button>
            <p className="hidden text-center text-xs text-slate-400 md:block">
              By submitting, you confirm that guest details and captured documents have been verified by hotel staff.
            </p>
          </div>
        );
    }
  };

  const isLastStep = currentStep === steps.length - 1;

  return (
    <>
      {isWebcamOpen && (
        <WebcamModal onCapture={handleCapture} onCancel={closeWebcam} />
      )}

      <form onSubmit={handleSubmit} className="relative min-h-[calc(100vh-13rem)] md:min-h-0">
        <div className="mx-auto max-w-2xl rounded-t-3xl border border-slate-100 bg-white shadow-sm md:rounded-2xl md:shadow-lg">
          <div className="p-4 md:p-6">
            <StepIndicator currentStep={currentStep} />

            <div className="mb-6">
              <h2 className="text-lg font-semibold text-slate-900">{steps[currentStep].title}</h2>
              <p className="mt-1 text-sm text-slate-500">{steps[currentStep].subtitle}</p>
            </div>

            <div className="relative overflow-hidden">
              <AnimatePresence mode="wait" custom={direction}>
                <Motion.div
                  key={currentStep}
                  custom={direction}
                  variants={pageVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ type: 'tween', ease: 'easeInOut', duration: 0.25 }}
                >
                  {renderStep()}
                </Motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-8 hidden items-center justify-between border-t border-slate-100 pt-5 md:flex">
              <Button type="button" variant="secondary" onClick={goBack} disabled={currentStep === 0}>
                <FaChevronLeft /> Back
              </Button>
              {!isLastStep ? (
                <Button type="button" onClick={goNext}>
                  Continue <FaChevronRight />
                </Button>
              ) : (
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Registering...' : 'Submit'}
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between border-t border-slate-100 bg-white px-4 py-3 md:hidden">
          <Button type="button" variant="secondary" onClick={goBack} disabled={currentStep === 0} className="min-w-24">
            Back
          </Button>
          <span className="text-xs font-medium text-slate-400">Step {currentStep + 1} of {steps.length}</span>
          {!isLastStep ? (
            <Button type="button" onClick={goNext} className="min-w-24">
              Continue
            </Button>
          ) : (
            <Button type="submit" disabled={isSubmitting} className="min-w-24">
              {isSubmitting ? 'Saving...' : 'Submit'}
            </Button>
          )}
        </div>
      </form>
    </>
  );
};

export default GuestRegistrationForm;
