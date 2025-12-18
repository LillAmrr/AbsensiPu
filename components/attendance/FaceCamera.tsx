"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import { Camera, RefreshCw, AlertTriangle } from 'lucide-react';

interface FaceCameraProps {
  onCapture: (imageDataUrl: string) => void;
  onCancel: () => void;
}

export default function FaceCamera({ onCapture, onCancel }: FaceCameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startCamera = useCallback(async () => {
    setError(null);
    try {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user',
        },
      });
      setStream(newStream);
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
    } catch (err) {
      console.error("Camera Error:", err);
      setError("Could not access camera. Please check permissions and ensure your camera is not in use by another application.");
    }
  }, [stream]);

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [startCamera]);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current && stream) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      const context = canvas.getContext('2d');
      if (context) {
        // Set canvas dimensions to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Flip the context horizontally for a mirror effect
        context.translate(canvas.width, 0);
        context.scale(-1, 1);
        
        // Draw the current video frame onto the canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Restore the context to its original state
        context.setTransform(1, 0, 0, 1, 0, 0);

        const imageDataUrl = canvas.toDataURL('image/jpeg', 0.9);
        onCapture(imageDataUrl);
        stream.getTracks().forEach(track => track.stop());
      }
    }
  };
  
  if (error) {
    return (
      <div className="w-full max-w-md mx-auto p-4 text-center">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p className="text-red-700 bg-red-100 p-3 rounded-lg">{error}</p>
        <button
          onClick={startCamera}
          className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <div className="relative w-full aspect-[4/3] bg-gray-900 rounded-lg overflow-hidden shadow-lg">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover transform scale-x-[-1]" // Mirror effect
        />
        <div className="absolute inset-0 border-4 border-blue-500/50 rounded-lg pointer-events-none"></div>
      </div>
      <div className="mt-4 flex flex-col gap-3">
        <button
          onClick={handleCapture}
          className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all"
        >
          <Camera className="w-6 h-6 mr-3" />
          Capture Photo
        </button>
        <button
          onClick={onCancel}
          className="w-full px-6 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300"
        >
          Cancel
        </button>
      </div>
      <canvas ref={canvasRef} className="hidden"></canvas>
    </div>
  );
}
