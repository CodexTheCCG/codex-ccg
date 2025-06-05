import { useEffect, useRef } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";

export default function Scanner({ onScan }) {
  const videoRef = useRef(null);
  const codeReaderRef = useRef(null);

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();
    codeReaderRef.current = codeReader;

    let isMounted = true;

    codeReader
      .decodeFromConstraints(
        {
          video: { facingMode: { ideal: "environment" } },
        },
        videoRef.current,
        (result, err) => {
          if (result && isMounted) {
            onScan(result.getText());
          }
        }
      )
      .catch((err) => {
        console.warn("Camera error:", err);
      });

    return () => {
      isMounted = false;
    };
  }, [onScan]);

  return (
    <video
      ref={videoRef}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        display: "block",
      }}
      muted
      autoPlay
      playsInline
    />
  );
}
