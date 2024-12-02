"use client";

import { MicIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";

type Props = {
  uploadAudio: (blob: Blob) => void;
};

export const mimeType = "audio/webm";

export default function Recorder({ uploadAudio }: Props) {
  const [permission, setPermission] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [recordingStatus, setRecordingStatus] = useState("inactive");
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const mediaRecorder = useRef<MediaRecorder | null>(null);

  useEffect(() => {
    getMicrophonePermission();
  }, []);
  const getMicrophonePermission = async () => {
    if ("MediaRecorder" in window) {
      try {
        const streamData = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });
        setPermission(true);
        setStream(streamData);
      } catch (error: any) {
        alert(error.message);
      }
    }
  };

  async function startRecording() {
    if (stream === null) return;
    setRecordingStatus("recording");

    const media = new MediaRecorder(stream, { mimeType });
    mediaRecorder.current = media;
    mediaRecorder.current.start();

    let localAudioChunks: Blob[] = [];

    mediaRecorder.current.ondataavailable = (e) => {
      if (typeof e.data === "undefined") return;
      if (e.data.size === 0) return;
      localAudioChunks.push(e.data);
    };
    setAudioChunks(localAudioChunks);
  }

  async function stopRecording() {
    if (mediaRecorder.current === null) return;

    setRecordingStatus("inactive");
    mediaRecorder.current.stop();

    mediaRecorder.current.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: mimeType });
      uploadAudio(audioBlob);
      setAudioChunks([]);
    };
  }

  return (
    <div
      className={`flex items-center group text-blue-500 cursor-pointer border rounded-md w-fit px-3 py-2 mb-5 ${
        recordingStatus === "recording"
          ? "bg-red-500 text-white"
          : "hover:bg-[#e7f0fe]"
      }`}
    >
      <MicIcon size={20} className="group-hover:underline" />
      {!permission && (
        <button onClick={getMicrophonePermission}>Get Microphone</button>
      )}

      {permission && recordingStatus === "inactive" && (
        <button
          onClick={startRecording}
          className="text-sm font-medium group-hover:underline ml-2 mt-1"
        >
          Speak
        </button>
      )}
      {recordingStatus === "recording" && (
        <button
          onClick={stopRecording}
          className="text-sm font-medium group-hover:underline ml-2 mt-1"
        >
          Stop
        </button>
      )}
    </div>
  );
}
