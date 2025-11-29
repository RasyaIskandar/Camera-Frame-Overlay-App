import { useEffect, useRef } from "react"

type Props = {
  frame: string | null
  onCapture: (img: string) => void
  onBack: () => void
}

export default function CameraView({ frame, onCapture, onBack }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    })
  }, [])

  const takePhoto = () => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

    const data = canvas.toDataURL("image/png")
    onCapture(data)
  }

  // Mapping frame ke file PNG
  const frameUrl =
    frame === "portrait"
      ? "/assets/frame-portrait.png"
      : frame === "landscape"
      ? "/assets/frame-landscape.png"
      : null

  const isPortrait = frame === "portrait"

  return (
<div className="fixed inset-0 flex flex-col items-center justify-center bg-black z-50">
  <h2 className="text-white text-lg font-semibold mb-4">Ambil Foto</h2>

  <div
    className={`relative overflow-hidden ${
      isPortrait ? "w-[400px] aspect-[9/16]" : "w-[700px] aspect-[16/9]"
    }`}
  >
    <video
      ref={videoRef}
      autoPlay
      className="absolute inset-0 w-full h-full object-cover"
    />

    {frameUrl && (
      <img
        src={frameUrl}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      />
    )}
  </div>

  <canvas ref={canvasRef} className="hidden" />

  <div className="flex gap-3 mt-6">
    <button
      className="px-4 py-2 bg-gray-500 text-white rounded"
      onClick={onBack}
    >
      Kembali
    </button>
    <button
      className="px-4 py-2 bg-blue-600 text-white rounded"
      onClick={takePhoto}
    >
      Ambil Foto
    </button>
  </div>
</div>

  )
}
