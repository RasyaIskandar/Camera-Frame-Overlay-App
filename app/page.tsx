"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Download, RefreshCw, ChevronLeft, Image as ImageIcon, Smartphone, Monitor } from "lucide-react";

// =================== TYPES ===================
type FrameType = "portrait" | "landscape";

type FrameOption = {
  id: FrameType;
  label: string;
  subLabel: string;
  icon: React.ReactNode;
  ratioValue: number;
};

// ================= CONSTANTS & ASSETS ==================
// Ganti URL ini dengan path gambar frame Anda yang sebenarnya
const FRAMES = {
  portrait: "/frames/frame-portrait.png",
  landscape: "/frames/frame-landscape.png",
};

// ================= COMPONENTS ==================

// --- 1. Frame Selector (Halaman Depan) ---
const FrameSelector: React.FC<{ onSelect: (frameId: FrameType) => void }> = ({ onSelect }) => {
  const options: FrameOption[] = [
    { 
      id: "portrait", 
      label: "Potret", 
      subLabel: "Rasio 2:3 (Story/Phone)", 
      icon: <Smartphone className="w-8 h-8 text-purple-500" />,
      ratioValue: 2/3 
    },
    { 
      id: "landscape", 
      label: "Lanskap", 
      subLabel: "Rasio 3:2 (Post/Web)", 
      icon: <Monitor className="w-8 h-8 text-blue-500" />,
      ratioValue: 3/2 
    },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center justify-center w-full max-w-2xl px-6"
    >
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500 mb-4">
          Photobooth Pro
        </h1>
        <p className="text-gray-500 text-lg">Pilih bingkai untuk memulai momen seru Anda</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {options.map((f, i) => (
          <motion.button
            key={f.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(f.id)}
            className="group relative overflow-hidden bg-white/80 backdrop-blur-lg border border-white/20 shadow-xl rounded-3xl p-6 flex flex-col items-center transition-all hover:shadow-2xl hover:border-purple-300"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="w-24 h-24 mb-6 rounded-2xl bg-gray-50 shadow-inner flex items-center justify-center group-hover:bg-white transition-colors">
              {f.icon}
            </div>
            
            <h3 className="text-xl font-bold text-gray-800 mb-1">{f.label}</h3>
            <p className="text-sm text-gray-400">{f.subLabel}</p>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

// --- 2. Camera View (Kamera) ---
const CameraView: React.FC<{
  frame: FrameType;
  onCapture: (imgData: string) => void;
  onBack: () => void;
}> = ({ frame, onCapture, onBack }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const frameImgRef = useRef<HTMLImageElement | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [overlayLoaded, setOverlayLoaded] = useState(false);
  const [flash, setFlash] = useState(false);

  // Rasio
  const FRAME_RATIO = frame === "portrait" ? 2/3 : 3/2;
  const frameURL = FRAMES[frame];

  // Load Overlay
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = frameURL;
    img.onload = () => {
      frameImgRef.current = img;
      setOverlayLoaded(true);
    };
    img.onerror = () => {
      console.warn("Failed overlay load");
      // Tetap lanjut meski gagal load overlay (fallback)
      setOverlayLoaded(true); 
    };
  }, [frameURL]);

  // Start Camera
  useEffect(() => {
    let stream: MediaStream | null = null;
    
    const startCamera = async () => {
      try {
        setLoading(true);
        const constraints = {
          video: {
            facingMode: "user",
            aspectRatio: FRAME_RATIO,
            width: { ideal: 1920 }, // Minta resolusi tinggi
          },
          audio: false,
        };
        stream = await navigator.mediaDevices.getUserMedia(constraints);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => setLoading(false);
        }
      } catch (err) {
        console.error("Camera Error:", err);
        setLoading(false);
        alert("Gagal akses kamera. Pastikan izin diberikan.");
      }
    };

    startCamera();
    return () => stream?.getTracks().forEach(t => t.stop());
  }, [FRAME_RATIO]);

  const handleCapture = async () => {
    setFlash(true);
    setTimeout(() => setFlash(false), 200); // Durasi flash

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const overlay = frameImgRef.current;

    if (!video || !canvas) return;

    // Set resolusi canvas sesuai kualitas video asli (agar HD)
    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;
    canvas.width = videoWidth;
    canvas.height = videoHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Flip horizontal (mirror effect) karena kamera depan biasanya mirroring
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    // Reset transform untuk overlay
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    // Draw Overlay
    if (overlay && overlayLoaded) {
      ctx.drawImage(overlay, 0, 0, canvas.width, canvas.height);
    }

    const data = canvas.toDataURL("image/png", 1.0); // High quality
    
    // Sedikit delay agar user melihat flash
    setTimeout(() => onCapture(data), 300);
  };

  return (
    <motion.div 
      className="fixed inset-0 bg-black flex flex-col"
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
    >
      {/* Header */}
      <div className="absolute top-0 w-full p-4 z-20 flex justify-between items-center bg-gradient-to-b from-black/60 to-transparent">
        <button 
          onClick={onBack} 
          className="p-3 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all"
        >
          <ChevronLeft />
        </button>
        <span className="text-white font-medium bg-black/30 px-4 py-1 rounded-full text-sm backdrop-blur-md border border-white/10">
          Mode: {frame === 'portrait' ? 'Portrait' : 'Landscape'}
        </span>
        <div className="w-10" /> {/* Spacer */}
      </div>

      {/* Main Viewfinder Area */}
      <div className="flex-1 relative flex items-center justify-center overflow-hidden bg-gray-900">
        
        {/* Flash Effect */}
        <div className={`absolute inset-0 bg-white z-50 pointer-events-none transition-opacity duration-200 ${flash ? 'opacity-100' : 'opacity-0'}`} />

        {/* Loading Spinner */}
        {(loading || !overlayLoaded) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 text-white gap-2">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm font-light tracking-wider">MEMUAT KAMERA...</p>
          </div>
        )}

        {/* Video & Overlay Container */}
        {/* Menggunakan aspect-ratio CSS agar container sesuai frame */}
        <div 
          className="relative shadow-2xl overflow-hidden bg-black"
          style={{
            aspectRatio: frame === 'portrait' ? '2/3' : '3/2',
            height: frame === 'portrait' ? 'min(80vh, 100%)' : 'auto',
            width: frame === 'landscape' ? 'min(95vw, 1000px)' : 'auto',
          }}
        >
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted 
            className="w-full h-full object-cover transform scale-x-[-1]" // Mirror preview
          />
          {overlayLoaded && (
            <img 
              src={frameURL} 
              alt="overlay" 
              className="absolute inset-0 w-full h-full object-cover pointer-events-none z-10"
            />
          )}
        </div>
      </div>

      {/* Controls Bar */}
      <div className="h-32 bg-black/80 backdrop-blur-md flex items-center justify-center gap-10 pb-4 pt-2">
        <canvas ref={canvasRef} className="hidden" />
        
        {/* Capture Button */}
        <motion.button
          onClick={handleCapture}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="relative w-20 h-20 rounded-full border-4 border-white flex items-center justify-center group"
        >
          <div className="w-16 h-16 bg-white rounded-full group-hover:bg-red-500 transition-colors duration-300" />
        </motion.button>
      </div>
    </motion.div>
  );
};

// --- 3. Preview (Hasil) ---
const Preview: React.FC<{ 
  image: string; 
  onRetry: () => void; 
  frame: FrameType 
}> = ({ image, onRetry }) => {

  const handleDownload = () => {
    const filename = `photo-${Date.now()}.png`; // dibuat di event handler

    const link = document.createElement("a");
    link.href = image;
    link.download = filename;
    link.click();
  };

  return (
    <motion.div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <div className="max-w-4xl w-full flex flex-col items-center gap-6">
        <h2 className="text-white text-2xl font-bold tracking-wider">HASIL FOTO</h2>
        
        {/* Image Display */}
        <motion.div 
          className="relative rounded-lg overflow-hidden shadow-2xl border border-white/10"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <img 
            src={image} 
            alt="Captured" 
            className="max-h-[70vh] w-auto object-contain bg-gray-800"
          />
        </motion.div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onRetry}
            className="flex items-center gap-2 px-6 py-3 bg-gray-700 text-white rounded-full font-medium hover:bg-gray-600 transition-colors shadow-lg"
          >
            <RefreshCw size={20} />
            Ulangi
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDownload}
            className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full font-bold shadow-lg hover:shadow-blue-500/30 transition-all"
          >
            <Download size={20} />
            Simpan Foto
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};


// ================= MAIN APP ==================
export default function Page() {
  const [view, setView] = useState<"SELECT" | "CAMERA" | "PREVIEW">("SELECT");
  const [selectedFrame, setSelectedFrame] = useState<FrameType | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#f3f4f6] text-gray-800 font-sans selection:bg-purple-200">
      {/* Background decoration */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-32 left-20 w-[500px] h-[500px] bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000" />
      </div>

      <div className="relative z-10 w-full min-h-screen flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          {view === "SELECT" && (
            <FrameSelector 
              key="select"
              onSelect={(f) => {
                setSelectedFrame(f);
                setView("CAMERA");
              }} 
            />
          )}

          {view === "CAMERA" && selectedFrame && (
            <CameraView
              key="camera"
              frame={selectedFrame}
              onCapture={(img) => {
                setCapturedImage(img);
                setView("PREVIEW");
              }}
              onBack={() => setView("SELECT")}
            />
          )}

          {view === "PREVIEW" && capturedImage && selectedFrame && (
            <Preview 
              key="preview"
              image={capturedImage}
              frame={selectedFrame}
              onRetry={() => setView("CAMERA")}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Style tambahan untuk animasi blob background */}
      <style jsx global>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}