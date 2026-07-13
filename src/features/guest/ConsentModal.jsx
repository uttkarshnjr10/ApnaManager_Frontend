// src/features/guest/ConsentModal.jsx
import { useRef, useState, useCallback } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaShieldAlt, FaEraser, FaTimesCircle, FaCheckCircle, FaLock, FaFingerprint } from 'react-icons/fa';

const Motion = motion;

// ─── Consent Text Version Identifier ───────────────────────────────
// IMPORTANT: Increment this version whenever consent text is updated.
// It is hashed alongside the timestamp to create a tamper-evident record.
const CONSENT_TEXT_VERSION = 'DPDP_V1_2025';

// ─── Minimum points across all strokes to count as a valid signature ──
const MIN_SIGNATURE_POINTS = 15;

// ─── The exact consent text shown to the guest (bilingual) ─────────
const CONSENT_NOTICE_EN = {
  title: 'Guest Data Privacy Consent',
  intro:
    'As required under the Digital Personal Data Protection (DPDP) Act, 2023, we need your informed consent before collecting your personal data for this hotel stay.',
  dataCollected: {
    heading: 'What data we collect',
    items: [
      'Full name, Date of birth, Gender & Contact details',
      'Government-issued identity document (Aadhaar / Passport / Voter ID / Driving Licence) — front & back images',
      'Live photograph captured at check-in',
      'Address & stay details (Room number, Check-in/out times)',
    ],
  },
  purpose: {
    heading: 'Why we collect it',
    items: [
      'Legal compliance — Form C submission under the Foreigners Act & Registration of Foreigners Rules',
      'Guest identity verification for hotel safety & security',
      'Sharing verified records with law enforcement upon lawful request',
    ],
  },
  rights: {
    heading: 'Your rights under DPDP Act 2023',
    items: [
      'Right to access your personal data held by us',
      'Right to correction of inaccurate data',
      'Right to erasure (request deletion) of your data, subject to legal retention requirements',
      'Right to file a grievance with the hotel or the Data Protection Board of India',
    ],
  },
};

const CONSENT_NOTICE_HI = {
  title: 'अतिथि डेटा गोपनीयता सहमति',
  intro:
    'डिजिटल व्यक्तिगत डेटा संरक्षण (DPDP) अधिनियम, 2023 के तहत, इस होटल प्रवास के लिए आपका व्यक्तिगत डेटा एकत्र करने से पहले हमें आपकी सूचित सहमति आवश्यक है।',
  dataCollected: {
    heading: 'हम कौन सा डेटा एकत्र करते हैं',
    items: [
      'पूरा नाम, जन्म तिथि, लिंग और संपर्क विवरण',
      'सरकार द्वारा जारी पहचान दस्तावेज़ (आधार / पासपोर्ट / मतदाता पहचान पत्र / ड्राइविंग लाइसेंस) — आगे और पीछे की छवियाँ',
      'चेक-इन के समय लिया गया लाइव फोटोग्राफ',
      'पता और प्रवास विवरण (कमरा नंबर, चेक-इन/आउट समय)',
    ],
  },
  purpose: {
    heading: 'हम इसे क्यों एकत्र करते हैं',
    items: [
      'कानूनी अनुपालन — विदेशी अधिनियम और विदेशियों के पंजीकरण नियमों के तहत फॉर्म C जमा करना',
      'होटल सुरक्षा के लिए अतिथि पहचान सत्यापन',
      'कानूनी अनुरोध पर कानून प्रवर्तन के साथ सत्यापित रिकॉर्ड साझा करना',
    ],
  },
  rights: {
    heading: 'DPDP अधिनियम 2023 के तहत आपके अधिकार',
    items: [
      'हमारे पास रखे आपके व्यक्तिगत डेटा तक पहुँचने का अधिकार',
      'गलत डेटा के सुधार का अधिकार',
      'आपके डेटा की मिटाने (हटाने का अनुरोध) का अधिकार, कानूनी प्रतिधारण आवश्यकताओं के अधीन',
      'होटल या भारत के डेटा संरक्षण बोर्ड के पास शिकायत दर्ज करने का अधिकार',
    ],
  },
};

// ─── SHA-256 hashing using the Web Crypto API ──────────────────────
const generateSHA256 = async (message) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
};

// ─── Helper: count total points across all strokes ─────────────────
const countSignaturePoints = (canvasData) => {
  if (!canvasData || canvasData.length === 0) return 0;
  return canvasData.reduce((total, stroke) => total + (stroke.points?.length || stroke.length || 0), 0);
};

// ─── Consent Section Component ─────────────────────────────────────
const ConsentSection = ({ icon, heading, items, accentColor }) => (
  <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4">
    <h4 className={`mb-2.5 flex items-center gap-2 text-sm font-bold ${accentColor}`}>
      {icon}
      {heading}
    </h4>
    <ul className="space-y-1.5">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2 text-xs leading-relaxed text-slate-600">
          <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-slate-400" />
          {item}
        </li>
      ))}
    </ul>
  </div>
);

// ═══════════════════════════════════════════════════════════════════
// MAIN COMPONENT: ConsentModal
// ═══════════════════════════════════════════════════════════════════
const ConsentModal = ({ onConsent, onAbort }) => {
  const sigCanvasRef = useRef(null);
  const [hasValidSignature, setHasValidSignature] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAbortConfirm, setShowAbortConfirm] = useState(false);
  const [activeLanguage, setActiveLanguage] = useState('en');
  const navigate = useNavigate();

  const notice = activeLanguage === 'en' ? CONSENT_NOTICE_EN : CONSENT_NOTICE_HI;

  // ── Validate signature after each stroke ends ──────────────────
  const handleStrokeEnd = useCallback(() => {
    if (!sigCanvasRef.current) return;
    const canvasData = sigCanvasRef.current.toData();
    const totalPoints = countSignaturePoints(canvasData);
    setHasValidSignature(totalPoints >= MIN_SIGNATURE_POINTS);
  }, []);

  // ── Clear the signature pad ────────────────────────────────────
  const handleClear = useCallback(() => {
    if (!sigCanvasRef.current) return;
    sigCanvasRef.current.clear();
    setHasValidSignature(false);
  }, []);

  // ── Process consent: generate hash, build record, freeze ───────
  const handleAgree = useCallback(async () => {
    if (!hasValidSignature || !sigCanvasRef.current) return;

    setIsProcessing(true);
    try {
      const signedAt = new Date().toISOString();

      // Get the trimmed signature as base64 PNG
      const signatureImage = sigCanvasRef.current
        .getTrimmedCanvas()
        .toDataURL('image/png');

      // Generate SHA-256 hash of (consent version + timestamp)
      const hashInput = `${CONSENT_TEXT_VERSION}|${signedAt}`;
      const consentHash = await generateSHA256(hashInput);

      // Build the immutable consent record
      const consentRecord = Object.freeze({
        signatureImage,
        consentTextVersion: CONSENT_TEXT_VERSION,
        consentHash,
        signedAt,
        consentGranted: true,
      });

      onConsent(consentRecord);
    } catch (err) {
      console.error('Failed to process consent:', err);
      setIsProcessing(false);
    }
  }, [hasValidSignature, onConsent]);

  // ── Handle the "I Do Not Consent" flow ─────────────────────────
  const handleAbort = useCallback(() => {
    setShowAbortConfirm(true);
  }, []);

  const confirmAbort = useCallback(() => {
    if (onAbort) {
      onAbort();
    } else {
      navigate('/hotel/dashboard');
    }
  }, [onAbort, navigate]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-3 sm:p-6">
      <Motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="relative flex w-full max-w-2xl max-h-[94vh] flex-col rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200/50"
      >
        {/* ── Header ─────────────────────────────────────────────── */}
        <div className="flex flex-shrink-0 items-center justify-between gap-3 border-b border-slate-100 px-5 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <FaShieldAlt size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 sm:text-lg">{notice.title}</h2>
              <p className="text-xs text-slate-500">DPDP Act 2023 Compliance</p>
            </div>
          </div>

          {/* Language toggle */}
          <div className="flex items-center gap-1 rounded-lg border border-slate-200 p-0.5">
            <button
              type="button"
              onClick={() => setActiveLanguage('en')}
              className={`rounded-md px-2.5 py-1 text-xs font-bold transition-all ${
                activeLanguage === 'en'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setActiveLanguage('hi')}
              className={`rounded-md px-2.5 py-1 text-xs font-bold transition-all ${
                activeLanguage === 'hi'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              हिंदी
            </button>
          </div>
        </div>

        {/* ── Scrollable Content ─────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-5 py-4 sm:px-6 space-y-4">
          {/* Introduction */}
          <div className="flex items-start gap-3 rounded-xl border border-amber-100 bg-amber-50/60 p-3.5">
            <FaLock className="mt-0.5 flex-shrink-0 text-amber-600" size={14} />
            <p className="text-xs leading-relaxed text-amber-900">{notice.intro}</p>
          </div>

          {/* Data Collected */}
          <ConsentSection
            icon={<FaFingerprint size={14} />}
            heading={notice.dataCollected.heading}
            items={notice.dataCollected.items}
            accentColor="text-blue-700"
          />

          {/* Purpose */}
          <ConsentSection
            icon={<FaShieldAlt size={14} />}
            heading={notice.purpose.heading}
            items={notice.purpose.items}
            accentColor="text-emerald-700"
          />

          {/* Rights */}
          <ConsentSection
            icon={<FaLock size={14} />}
            heading={notice.rights.heading}
            items={notice.rights.items}
            accentColor="text-violet-700"
          />

          {/* ── Signature Pad ──────────────────────────────────── */}
          <div className="space-y-2.5 pt-1">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-slate-800">
                {activeLanguage === 'en'
                  ? 'Guest Signature (Sign below)'
                  : 'अतिथि हस्ताक्षर (नीचे हस्ताक्षर करें)'}
              </label>
              <button
                type="button"
                onClick={handleClear}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600"
              >
                <FaEraser size={11} />
                {activeLanguage === 'en' ? 'Clear' : 'मिटाएँ'}
              </button>
            </div>

            <div className="relative rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 transition-colors focus-within:border-blue-400">
              <SignatureCanvas
                ref={sigCanvasRef}
                penColor="#1e293b"
                canvasProps={{
                  className: 'w-full rounded-xl cursor-crosshair',
                  style: { height: '140px' },
                }}
                onEnd={handleStrokeEnd}
                dotSize={2}
                minWidth={1.5}
                maxWidth={3}
                velocityFilterWeight={0.7}
              />
              {!hasValidSignature && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <p className="text-xs text-slate-300 select-none">
                    {activeLanguage === 'en'
                      ? '↑ Draw your signature here ↑'
                      : '↑ यहाँ अपना हस्ताक्षर बनाएँ ↑'}
                  </p>
                </div>
              )}
            </div>

            {hasValidSignature && (
              <Motion.p
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-1.5 text-xs font-medium text-emerald-600"
              >
                <FaCheckCircle size={11} />
                {activeLanguage === 'en' ? 'Signature captured' : 'हस्ताक्षर कैप्चर किया गया'}
              </Motion.p>
            )}
          </div>
        </div>

        {/* ── Footer Actions ─────────────────────────────────────── */}
        <div className="flex flex-shrink-0 flex-col gap-2.5 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <button
            type="button"
            onClick={handleAbort}
            disabled={isProcessing}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 text-sm font-bold text-red-600 transition-all hover:bg-red-50 disabled:opacity-50 sm:order-1"
          >
            <FaTimesCircle size={14} />
            {activeLanguage === 'en' ? 'I Do Not Consent' : 'मैं सहमत नहीं हूँ'}
          </button>

          <button
            type="button"
            onClick={handleAgree}
            disabled={!hasValidSignature || isProcessing}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-bold text-white shadow-sm shadow-blue-600/15 transition-all hover:bg-blue-700 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 sm:order-2"
          >
            <FaCheckCircle size={14} />
            {isProcessing
              ? (activeLanguage === 'en' ? 'Processing...' : 'प्रक्रिया हो रही है...')
              : (activeLanguage === 'en' ? 'I Agree & Proceed' : 'मैं सहमत हूँ और आगे बढ़ें')}
          </button>
        </div>
      </Motion.div>

      {/* ── Abort Confirmation Sub-Modal ──────────────────────── */}
      <AnimatePresence>
        {showAbortConfirm && (
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/50 p-4"
          >
            <Motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-slate-200/50"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
                <FaTimesCircle size={22} />
              </div>
              <h3 className="mb-1.5 text-base font-bold text-slate-900">Abort Check-In?</h3>
              <p className="mb-5 text-sm leading-relaxed text-slate-500">
                Without consent, we cannot proceed with guest registration as per DPDP Act 2023.
                The check-in process will be cancelled.
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAbortConfirm(false)}
                  className="flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50"
                >
                  Go Back
                </button>
                <button
                  type="button"
                  onClick={confirmAbort}
                  className="flex-1 rounded-xl bg-red-600 py-2.5 text-sm font-bold text-white transition-colors hover:bg-red-700"
                >
                  Yes, Abort
                </button>
              </div>
            </Motion.div>
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ConsentModal;
