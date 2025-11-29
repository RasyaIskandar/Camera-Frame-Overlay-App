import { useState } from "react";
import ChooseFrame from "./components/ChooseFrame";
import CameraView from "./components/CameraView";
import Preview from "./components/Preview";

type Step = "choose" | "camera" | "preview";

function App() {
  const [step, setStep] = useState<Step>("choose");
  const [selectedFrame, setSelectedFrame] = useState<string | null>(null);
  const [captured, setCaptured] = useState<string | null>(null);

  const goCamera = (frame: string) => {
    setSelectedFrame(frame);
    setStep("camera");
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 flex items-center justify-center p-4">
      {step === "choose" && (
        <div className="fade-enter fade-enter-active w-full h-full">
          <ChooseFrame onSelect={goCamera} />
        </div>
      )}

      {step === "camera" && (
        <div className="fade-enter fade-enter-active w-full h-full">
          <CameraView
            frame={selectedFrame}
            onCapture={(img: string) => {
              setCaptured(img);
              setStep("preview");
            }}
            onBack={() => setStep("choose")}
          />
        </div>
      )}

      {step === "preview" && captured && selectedFrame && (
        <div className="fade-enter fade-enter-active w-full h-full">
          <Preview
            image={captured}
            frame={selectedFrame}
            onRetake={() => setStep("camera")}
            onFinish={() => {
              setCaptured(null);
              setSelectedFrame(null);
              setStep("choose");
            }}
          />
        </div>
      )}
    </div>
  );
}

export default App;
