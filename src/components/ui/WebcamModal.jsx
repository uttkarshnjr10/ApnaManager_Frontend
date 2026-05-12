// src/components/ui/WebcamModal.jsx
import { useRef, useCallback, useState } from 'react';
import Webcam from 'react-webcam';
import Button from './Button';
import { FaSyncAlt } from 'react-icons/fa';

const WebcamModal = ({ onCapture, onCancel }) => {
  const webcamRef = useRef(null);
  const [facingMode, setFacingMode] = useState('user');

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    onCapture(imageSrc);
  }, [webcamRef, onCapture]);

  const toggleCamera = () => {
    setFacingMode((prevMode) => (prevMode === 'user' ? 'environment' : 'user'));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/75 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-4 shadow-lg md:p-6">
        <div className="relative overflow-hidden rounded-xl bg-black">
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width="100%"
            videoConstraints={{ facingMode }}
            className="w-full object-contain max-h-[60vh]"
          />
          <button
            type="button"
            onClick={toggleCamera}
            className="absolute right-4 top-4 z-10 rounded-full bg-black/50 p-3 text-white transition-colors hover:bg-black/75 focus:outline-none focus:ring-2 focus:ring-blue-500"
            title="Switch Camera"
          >
            <FaSyncAlt className="text-xl" />
          </button>
        </div>
        <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
          <Button onClick={capture} className="flex-1">Capture Photo</Button>
          <Button onClick={onCancel} variant="secondary" className="flex-1 max-w-xs">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WebcamModal;
