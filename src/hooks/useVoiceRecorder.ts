import { useState, useRef, useCallback } from 'react';

export interface VoiceRecorderState {
  isRecording: boolean;
  isPaused: boolean;
  recordingTime: number;
  formattedTime: string;
  audioLevel: number;
  error: string | null;
  startRecording: () => Promise<boolean>;
  stopRecording: () => Promise<Blob | null>;
  pauseRecording: () => void;
  resumeRecording: () => void;
  cancelRecording: () => void;
}

const formatSeconds = (sec: number): string => {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s < 10 ? '0' : ''}${s}`;
};

export const useVoiceRecorder = (): VoiceRecorderState => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const clearTimer = () => {
    if (timerIntervalRef.current !== null) {
      window.clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  };

  const startTimer = () => {
    clearTimer();
    timerIntervalRef.current = window.setInterval(() => {
      setRecordingTime((prev) => prev + 1);
    }, 1000);
  };

  const cleanupAudio = () => {
    if (animFrameRef.current !== null) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    analyserRef.current = null;
    setAudioLevel(0);
  };

  const stopTracks = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    cleanupAudio();
  };

  const startRecording = useCallback(async (): Promise<boolean> => {
    setError(null);
    audioChunksRef.current = [];

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError('El navegador no soporta grabación de voz.');
      return false;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mimeType = MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : MediaRecorder.isTypeSupported('audio/mp4')
        ? 'audio/mp4'
        : '';

      const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.start(100);
      setIsRecording(true);
      setIsPaused(false);
      setRecordingTime(0);
      startTimer();

      try {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtx) {
          const ctx = new AudioCtx();
          audioContextRef.current = ctx;
          const source = ctx.createMediaStreamSource(stream);
          const analyser = ctx.createAnalyser();
          analyser.fftSize = 64;
          source.connect(analyser);
          analyserRef.current = analyser;

          const data = new Uint8Array(analyser.frequencyBinCount);
          const tick = () => {
            if (!analyserRef.current || mediaRecorderRef.current?.state !== 'recording') {
              setAudioLevel(0);
              return;
            }
            analyserRef.current.getByteFrequencyData(data);
            let sum = 0;
            for (let i = 0; i < data.length; i++) sum += data[i];
            const avg = sum / data.length;
            setAudioLevel(Math.min(1, avg / 70));
            animFrameRef.current = requestAnimationFrame(tick);
          };
          animFrameRef.current = requestAnimationFrame(tick);
        }
      } catch {
        // Fallback silencioso
      }

      return true;
    } catch {
      setError('Permiso de micrófono denegado o no disponible.');
      stopTracks();
      return false;
    }
  }, []);

  const pauseRecording = useCallback(() => {
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state === 'recording') {
      try {
        recorder.pause();
      } catch {}
      setIsPaused(true);
      clearTimer();
      setAudioLevel(0);
    }
  }, []);

  const resumeRecording = useCallback(() => {
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state === 'paused') {
      try {
        recorder.resume();
      } catch {}
      setIsPaused(false);
      startTimer();

      if (analyserRef.current && streamRef.current) {
        const data = new Uint8Array(analyserRef.current.frequencyBinCount);
        const tick = () => {
          if (!analyserRef.current || mediaRecorderRef.current?.state !== 'recording') {
            setAudioLevel(0);
            return;
          }
          analyserRef.current.getByteFrequencyData(data);
          let sum = 0;
          for (let i = 0; i < data.length; i++) sum += data[i];
          const avg = sum / data.length;
          setAudioLevel(Math.min(1, avg / 70));
          animFrameRef.current = requestAnimationFrame(tick);
        };
        animFrameRef.current = requestAnimationFrame(tick);
      }
    }
  }, []);

  const stopRecording = useCallback((): Promise<Blob | null> => {
    return new Promise((resolve) => {
      clearTimer();
      cleanupAudio();
      const recorder = mediaRecorderRef.current;

      if (!recorder || recorder.state === 'inactive') {
        setIsRecording(false);
        setIsPaused(false);
        stopTracks();
        resolve(null);
        return;
      }

      recorder.onstop = () => {
        const mime = recorder.mimeType || 'audio/webm';
        const audioBlob = new Blob(audioChunksRef.current, { type: mime });
        audioChunksRef.current = [];
        setIsRecording(false);
        setIsPaused(false);
        stopTracks();
        resolve(audioBlob.size > 0 ? audioBlob : null);
      };

      recorder.stop();
    });
  }, []);

  const cancelRecording = useCallback(() => {
    clearTimer();
    cleanupAudio();
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== 'inactive') {
      try {
        recorder.stop();
      } catch {}
    }
    audioChunksRef.current = [];
    setIsRecording(false);
    setIsPaused(false);
    stopTracks();
  }, []);

  return {
    isRecording,
    isPaused,
    recordingTime,
    formattedTime: formatSeconds(recordingTime),
    audioLevel,
    error,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    cancelRecording,
  };
};
