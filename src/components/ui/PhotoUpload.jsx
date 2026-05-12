// src/components/ui/PhotoUpload.jsx
import { FaCamera } from 'react-icons/fa';

const PhotoUpload = ({ label, onCaptureClick, imageSrc, error }) => {
  return (
    <div>
      <button
        type="button"
        onClick={onCaptureClick}
        className={`group relative flex h-36 w-full flex-col items-center justify-center gap-2 overflow-hidden rounded-xl border-2 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 ${
          imageSrc
            ? 'border-blue-500 bg-white'
            : 'border-dashed border-slate-200 bg-slate-50 hover:border-blue-300 hover:bg-blue-50/40'
        }`}
      >
        {imageSrc ? (
          <>
            <img src={imageSrc} alt={`${label} preview`} className="h-full w-full object-cover" />
            <span className="absolute bottom-2 right-2 rounded-lg bg-slate-900/70 px-2.5 py-1.5 text-xs font-medium text-white backdrop-blur">
              Retake
            </span>
          </>
        ) : (
          <>
            <FaCamera className="text-3xl text-slate-300 transition-colors group-hover:text-blue-400" />
            <span className="px-3 text-center text-xs font-medium text-slate-400">{label}</span>
          </>
        )}
      </button>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default PhotoUpload;
