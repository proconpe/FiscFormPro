"use client";

import { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import { Button } from "@/components/ui/button";
import { Eraser, Check } from "lucide-react";

import saveFile from "@/lib/actions/save-file";

interface SignaturePadProps {
  onSave: (signatureDataUrl: string) => void;
}

export function SignaturePad({ onSave }: SignaturePadProps) {
  const sigCanvas = useRef<SignatureCanvas>(null);
  const [isSigned, setIsSigned] = useState(false);

  const clear = () => {
    sigCanvas.current?.clear();
    setIsSigned(false);
  };

  const save = () => {
    if (sigCanvas.current && !sigCanvas.current.isEmpty()) {
      const dataUrl = sigCanvas.current.toDataURL("image/png");
      onSave(dataUrl);
      setIsSigned(true);
    }
  };

  const handleBegin = () => {
    setIsSigned(true);
  };

  return (
    <div className="space-y-4">
      <div className="border rounded-md p-2 bg-white">
        <SignatureCanvas
          dotSize={1}
          ref={sigCanvas}
          canvasProps={{
            className: "w-full h-40 cursor-crosshair",
          }}
          onBegin={handleBegin}
        />
      </div>
      <div className="flex gap-2 justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={clear}
          className="flex items-center gap-1"
        >
          <Eraser className="h-4 w-4" /> Limpar
        </Button>
        <Button
          type="button"
          onClick={save}
          disabled={!isSigned}
          className="flex items-center gap-1"
        >
          <Check className="h-4 w-4" /> Confirmar Assinatura
        </Button>
      </div>
    </div>
  );
}
