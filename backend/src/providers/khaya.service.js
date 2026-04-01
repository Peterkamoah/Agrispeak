import config from '../config/index.js';
import AppError from '../core/errors/AppError.js';

// ─── Constants ───────────────────────────────────────────────────────────────

const TRANSLATION_TIMEOUT_MS = 10_000;
const ASR_TIMEOUT_MS = 30_000;

const VALID_ASR_LANGS = new Set([
  'tw', 'gaa', 'dag', 'ee', 'dga', 'fat', 'gur', 'nzi', 'kpo', 'yo', 'ki',
]);

const MOCK_KEYS = new Set(['', 'mock_ghananlp_key', 'mock_khaya_key']);

// ─── Helpers ─────────────────────────────────────────────────────────────────

function isMock(key) {
  return MOCK_KEYS.has(key ?? '');
}

function authError(service, status, detail) {
  const hint = service === 'Translation'
    ? 'Check KHAYA_TRANSLATION_KEY (Translation API subscription)'
    : 'Check KHAYA_ASR_KEY (Speech API subscription)';
  return new AppError(`${service} Auth Failed (${status}): ${hint} — ${detail}`, status);
}

function httpError(service, url, status, statusText, data) {
  const detail = JSON.stringify(data, null, 2);
  console.error(
    `[KhayaService:${service}] HTTP ${status} ${statusText}\n  URL : ${url}\n  Body: ${detail}`
  );

  const msg = data?.message || data?.error || statusText;

  if (status === 401 || status === 403) {
    throw authError(service, status, msg);
  }

  throw new AppError(`Khaya ${service} error: ${msg || `HTTP ${status}`}`, 502);
}

// ─── Translation ─────────────────────────────────────────────────────────────

/**
 * Translate text via the Khaya Translation API.
 *
 * @param {string} text       – source text to translate
 * @param {string} targetLang – Khaya language-pair string (e.g. "en-tw", "tw-en")
 * @returns {Promise<string>}
 */
export async function translateText(text, targetLang) {
  const key = config.khayaTranslationKey;
  const url = config.khayaTranslationUrl;

  if (isMock(key)) {
    console.log(`[KhayaService] MOCK translate: ${targetLang}`);
    return targetLang.startsWith('tw')
      ? `[Translated to English] ${text}`
      : `[Translated to Twi] ${text}`;
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': key,
      },
      body: JSON.stringify({ in: text, lang: targetLang }),
      signal: AbortSignal.timeout(TRANSLATION_TIMEOUT_MS),
    });

    let data;
    try { data = await response.json(); } catch { data = {}; }

    if (!response.ok) {
      httpError('Translation', url, response.status, response.statusText, data);
    }

    const out = data?.translatedText ?? data?.translated_text ?? data?.translation ?? data;
    if (out == null || out === '') throw new Error('Translation response missing text');
    return typeof out === 'string' ? out : String(out);
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(`Failed to fetch from Khaya Translation: ${error.message}`, 502);
  }
}

// ─── ASR (Automatic Speech Recognition) ─────────────────────────────────────

/**
 * Transcribe audio via the Khaya ASR API.
 *
 * @param {Buffer|Uint8Array} audioData  – raw audio bytes
 * @param {string}            sourceLang – language code (e.g. "tw", "ee", "gaa")
 * @param {string}            [contentType='audio/webm']
 * @returns {Promise<string>}
 */
export async function transcribeAudio(audioData, sourceLang, contentType = 'audio/webm') {
  if (!VALID_ASR_LANGS.has(sourceLang)) {
    throw new AppError(
      `Unsupported ASR language "${sourceLang}". Supported: ${[...VALID_ASR_LANGS].join(', ')}`,
      400
    );
  }

  const key = config.khayaAsrKey;
  const baseUrl = config.khayaAsrUrl;

  if (isMock(key)) {
    console.log(`[KhayaService] MOCK ASR: ${sourceLang}`);
    return '[Mock transcription] Mepɛ sɛ mehu wo';
  }

  const url = `${baseUrl}?language=${encodeURIComponent(sourceLang)}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': contentType,
        'Ocp-Apim-Subscription-Key': key,
      },
      body: audioData,
      signal: AbortSignal.timeout(ASR_TIMEOUT_MS),
    });

    const text = await response.text();

    if (!response.ok) {
      let parsed;
      try { parsed = JSON.parse(text); } catch { parsed = { message: text }; }
      httpError('ASR', url, response.status, response.statusText, parsed);
    }

    if (!text || text.trim() === '') {
      throw new Error('ASR returned empty transcription');
    }

    return text.trim();
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(`Failed to transcribe via Khaya ASR: ${error.message}`, 502);
  }
}

// ─── Dynamic Router ──────────────────────────────────────────────────────────

/**
 * Smart router that inspects the input type and delegates to the correct
 * Khaya service.
 *
 * - **String** input  → `translateText(input, langOrPair)`
 * - **Buffer / Uint8Array** input → `transcribeAudio(input, langOrPair)`
 *
 * @param {string|Buffer|Uint8Array} input       – text or audio data
 * @param {string}                   langOrPair  – language pair for translation ("en-tw")
 *                                                  or language code for ASR ("tw")
 * @param {object}                   [opts]       – optional overrides
 * @param {string}                   [opts.contentType] – audio MIME type (ASR only)
 * @returns {Promise<string>}
 */
export async function processKhayaInput(input, langOrPair, opts = {}) {
  if (typeof input === 'string') {
    return translateText(input, langOrPair);
  }

  if (Buffer.isBuffer(input) || input instanceof Uint8Array) {
    return transcribeAudio(input, langOrPair, opts.contentType);
  }

  throw new AppError(
    'processKhayaInput: input must be a string (translation) or Buffer/Uint8Array (ASR)',
    400
  );
}

export default { translateText, transcribeAudio, processKhayaInput };
