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
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl">
        <div className="relative rounded-md overflow-hidden bg-black">
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
            className="absolute top-4 right-4 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-3 rounded-full transition-all z-10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            title="Switch Camera"
          >
            <FaSyncAlt className="text-xl" />
          </button>
        </div>
        <div className="mt-6 flex justify-center gap-4">
          <Button onClick={capture} className="flex-1 max-w-xs">Capture Photo</Button>
          <Button onClick={onCancel} variant="secondary" className="flex-1 max-w-xs">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WebcamModal;