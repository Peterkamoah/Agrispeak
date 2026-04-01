import { ref, readonly } from 'vue';
import { transcribeAudio } from '@/api/asr';

/**
 * Composable that captures microphone audio via MediaRecorder and sends it
 * to the backend Khaya ASR endpoint for transcription.
 *
 * States: idle → recording → transcribing → idle
 */
export function useVoiceRecorder() {
  const state = ref('idle');       // 'idle' | 'recording' | 'transcribing'
  const transcript = ref('');
  const error = ref(null);

  let mediaRecorder = null;
  let audioChunks = [];
  let stream = null;

  function pickMimeType() {
    if (typeof MediaRecorder === 'undefined') return null;
    const candidates = ['audio/webm;codecs=opus', 'audio/webm', 'audio/ogg;codecs=opus', 'audio/mp4'];
    return candidates.find((t) => MediaRecorder.isTypeSupported(t)) || '';
  }

  async function startRecording() {
    error.value = null;
    transcript.value = '';

    if (typeof MediaRecorder === 'undefined') {
      error.value = 'Audio recording is not supported on this browser';
      return;
    }

    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (err) {
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        error.value = 'Microphone permission denied. Please allow access and try again.';
      } else {
        error.value = `Microphone error: ${err.message}`;
      }
      return;
    }

    audioChunks = [];
    const mimeType = pickMimeType();
    const options = mimeType ? { mimeType } : undefined;

    try {
      mediaRecorder = new MediaRecorder(stream, options);
    } catch {
      error.value = 'Could not start audio recorder';
      releaseStream();
      return;
    }

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) audioChunks.push(e.data);
    };

    mediaRecorder.start();
    state.value = 'recording';
  }

  function stopRecording(language = 'tw') {
    return new Promise((resolve) => {
      if (!mediaRecorder || mediaRecorder.state === 'inactive') {
        state.value = 'idle';
        resolve('');
        return;
      }

      mediaRecorder.onstop = async () => {
        releaseStream();
        const mimeType = mediaRecorder.mimeType || 'audio/webm';
        const blob = new Blob(audioChunks, { type: mimeType });
        audioChunks = [];

        if (blob.size === 0) {
          error.value = 'No audio was captured. Please try again.';
          state.value = 'idle';
          resolve('');
          return;
        }

        state.value = 'transcribing';

        try {
          const text = await transcribeAudio(blob, language);
          transcript.value = text;
          resolve(text);
        } catch (err) {
          error.value = `Transcription failed: ${err.message}`;
          resolve('');
        } finally {
          state.value = 'idle';
        }
      };

      mediaRecorder.stop();
    });
  }

  function cancelRecording() {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
    }
    releaseStream();
    audioChunks = [];
    state.value = 'idle';
  }

  function releaseStream() {
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
      stream = null;
    }
  }

  return {
    state: readonly(state),
    transcript: readonly(transcript),
    error: readonly(error),
    startRecording,
    stopRecording,
    cancelRecording,
  };
}
