import React from "react"

type Props = {
  onSelect: (frame: "landscape" | "portrait") => void
}

const frames = [
  {
    id: "landscape",
    name: "Frame Landscape",
    url: "/assets/frame-landscape.png",
  },
  {
    id: "portrait",
    name: "Frame Portrait",
    url: "/assets/frame-portrait.png",
  }
]

export default function ChooseFrame({ onSelect }: Props) {
  return (
    <div className="w-full max-w-md bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Pilih Frame</h2>

      <div className="grid grid-cols-1 gap-4">
        {frames.map((f) => (
          <button
            key={f.id}
            onClick={() => onSelect(f.id as "landscape" | "portrait")}
            className="border rounded-lg overflow-hidden hover:opacity-80 transition"
          >
            <img src={f.url} className="w-full" />
            <div className="p-3 bg-gray-100 text-center font-medium">
              {f.name}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
