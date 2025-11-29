import React from "react"

type Props = {
  image: string
  frame: string
  onRetake: () => void
  onFinish: () => void
}

export default function Preview({ image, frame, onRetake, onFinish }: Props) {
  return (
    <div className="w-full h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="relative w-80 h-80">
        {/* Gambar hasil foto */}
        <img
          src={image}
          alt="Captured"
          className="w-full h-full object-cover rounded-xl"
        />

        {/* Frame */}
        <img
          src={frame}
          alt="Frame"
          className="absolute inset-0 w-full h-full object-contain pointer-events-none"
        />
      </div>

      <div className="flex gap-4 mt-6">
        <button
          onClick={onRetake}
          className="px-4 py-2 bg-yellow-500 text-white rounded-lg"
        >
          Retake
        </button>

        <button
          onClick={onFinish}
          className="px-4 py-2 bg-green-600 text-white rounded-lg"
        >
          Finish
        </button>
      </div>
    </div>
  )
}
