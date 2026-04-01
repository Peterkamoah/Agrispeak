const BASE = import.meta.env.VITE_API_URL || '/api';

/**
 * Send an audio blob to the backend ASR proxy, which forwards it to Khaya.
 *
 * @param {Blob}   audioBlob – recorded audio (webm, wav, etc.)
 * @param {string} language  – Khaya language code (tw, ee, gaa …)
 * @returns {Promise<string>} transcribed text
 */
export async function transcribeAudio(audioBlob, language) {
  const url = `${BASE}/asr/transcribe?language=${encodeURIComponent(language)}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': audioBlob.type || 'audio/webm' },
    body: audioBlob,
  });

  if (!response.ok) {
    let msg;
    try {
      const json = await response.json();
      msg = json?.message || json?.error || response.statusText;
    } catch {
      msg = response.statusText;
    }
    throw new Error(msg);
  }

  const json = await response.json();
  return json.data?.transcript ?? '';
}
