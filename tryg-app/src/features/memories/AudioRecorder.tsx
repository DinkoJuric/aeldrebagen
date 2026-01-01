import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Trash2, Check, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface AudioRecorderProps {
    onRecordingComplete: (blob: Blob) => void;
    onReset?: () => void;
    placeholder?: string;
    maxLengthSeconds?: number;
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({
    onRecordingComplete,
    onReset,
    placeholder,
    maxLengthSeconds = 300 // Default 5 minutes
}) => {
    const { t } = useTranslation();
    const [isRecording, setIsRecording] = useState(false);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [duration, setDuration] = useState(0);
    const [error, setError] = useState<string | null>(null);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
            if (audioUrl) URL.revokeObjectURL(audioUrl);
        };
    }, [audioUrl]);

    const startRecording = async () => {
        try {
            setError(null);
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            // Check if MediaRecorder is supported
            if (!window.MediaRecorder) {
                setError(t('audio_recorder_not_supported'));
                return;
            }

            mediaRecorderRef.current = new MediaRecorder(stream);
            chunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (e) => {
                if (e.data.size > 0) chunksRef.current.push(e.data);
            };

            mediaRecorderRef.current.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
                const url = URL.createObjectURL(blob);
                setAudioUrl(url);
                onRecordingComplete(blob);

                // Stop all tracks to release the microphone
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
            setDuration(0);

            // Timer for duration and max length
            timerRef.current = setInterval(() => {
                setDuration(prev => {
                    if (prev >= maxLengthSeconds) {
                        stopRecording();
                        return prev;
                    }
                    return prev + 1;
                });
            }, 1000);

        } catch (err: unknown) {
            console.error('Recording error:', err);
            const error = err as Error;
            if (error.name === 'NotAllowedError') {
                setError(t('mic_permission_denied'));
            } else {
                setError(t('mic_access_error'));
            }
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        }
    };

    const handleReset = () => {
        setAudioUrl(null);
        setDuration(0);
        setError(null);
        if (onReset) onReset();
    };

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="flex flex-col items-center gap-4 p-6 bg-stone-50 rounded-3xl border-2 border-dashed border-stone-200 transition-all">
            {error && (
                <div className="flex items-center gap-2 text-rose-600 bg-rose-50 px-4 py-2 rounded-xl text-sm font-medium animate-fade-in">
                    <AlertCircle className="w-4 h-4" />
                    <span>{error}</span>
                </div>
            )}

            {!audioUrl ? (
                <div className="flex flex-col items-center gap-4">
                    <button
                        onClick={isRecording ? stopRecording : startRecording}
                        className={`
                            w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300
                            ${isRecording
                                ? 'bg-rose-500 scale-110 shadow-[0_0_20px_rgba(244,63,94,0.4)] animate-pulse'
                                : 'bg-teal-500 shadow-[0_10px_20px_rgba(20,184,166,0.3)] hover:scale-105 active:scale-95'
                            }
                        `}
                        aria-label={isRecording ? t('stop_recording') : t('start_recording')}
                    >
                        {isRecording ? <Square className="text-white fill-white w-8 h-8" /> : <Mic className="text-white w-8 h-8" />}
                    </button>

                    <div className="text-center">
                        <p className={`font-bold transition-colors ${isRecording ? 'text-rose-600' : 'text-stone-600'}`}>
                            {isRecording ? t('recording_active') : placeholder || t('press_to_tell_story')}
                        </p>
                        {isRecording && (
                            <p className="text-rose-400 font-mono text-xl mt-1">{formatDuration(duration)}</p>
                        )}
                    </div>
                </div>
            ) : (
                <div className="w-full space-y-4 animate-fade-in">
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-stone-100 flex items-center gap-4">
                        <button
                            onClick={() => new Audio(audioUrl).play()}
                            className="w-12 h-12 bg-teal-100 flex items-center justify-center rounded-full hover:bg-teal-200 transition-colors group"
                            aria-label={t('play_recording')}
                        >
                            <Play className="w-6 h-6 text-teal-700 fill-teal-700 group-hover:scale-110 transition-transform" />
                        </button>

                        <div className="flex-1 h-2 bg-stone-100 rounded-full overflow-hidden">
                            <div className="h-full bg-teal-500 w-full opacity-30" />
                        </div>

                        <span className="text-sm font-mono text-stone-400">{formatDuration(duration)}</span>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={handleReset}
                            className="flex-1 flex items-center justify-center gap-2 p-3 bg-stone-100 text-stone-600 font-bold rounded-2xl hover:bg-stone-200 transition-colors active:scale-95"
                        >
                            <Trash2 className="w-5 h-5" />
                            {t('delete_and_retry')}
                        </button>
                        <div className="flex-[0.3] p-3 bg-teal-50 text-teal-600 flex items-center justify-center rounded-2xl">
                            <Check className="w-6 h-6" />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
