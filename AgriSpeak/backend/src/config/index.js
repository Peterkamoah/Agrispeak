import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const backendRoot = path.resolve(__dirname, '../..');
const projectRoot = path.resolve(__dirname, '../../..');

dotenv.config({ path: path.join(projectRoot, '.env') });
dotenv.config({ path: path.join(backendRoot, '.env') });

function str(v, fallback = '') {
  return v != null && v !== '' ? String(v).trim() : fallback;
}

const legacyKey = str(process.env.KHAYA_API_KEY) || str(process.env.GHANANLP_API_KEY);

export default {
  env: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 3000,
  projectName: str(process.env.PROJECT_NAME, 'Agrispeak'),
  defaultLanguage: str(process.env.DEFAULT_LANGUAGE, 'twi'),

  googleApiKey: str(process.env.GOOGLE_API_KEY) || str(process.env.OPENAI_API_KEY),
  geminiModel: str(process.env.GEMINI_MODEL, 'gemini-2.5-flash'),

  // Khaya Translation — distinct key + URL
  khayaTranslationKey: str(process.env.KHAYA_TRANSLATION_KEY) || legacyKey,
  khayaTranslationUrl: str(
    process.env.KHAYA_TRANSLATION_URL,
    'https://translation-api.ghananlp.org/v1/translate'
  ),

  // Khaya ASR — distinct key + URL
  khayaAsrKey: str(process.env.KHAYA_ASR_KEY) || legacyKey,
  khayaAsrUrl: str(
    process.env.KHAYA_ASR_URL,
    'https://translation-api.ghananlp.org/asr/v1/transcribe'
  ),
};
