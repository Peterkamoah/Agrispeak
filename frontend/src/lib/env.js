/**
 * Default chat language for the UI (`en` | `tw`), aligned with backend chat API.
 * Reads VITE_DEFAULT_LANGUAGE from env (e.g. tw, twi → Twi).
 */
export function getDefaultChatLanguage() {
  const raw = (import.meta.env.VITE_DEFAULT_LANGUAGE || 'tw').toString().toLowerCase();
  if (raw === 'en' || raw === 'english') return 'en';
  return 'tw';
}

export function getProjectDisplayName() {
  return import.meta.env.VITE_PROJECT_NAME || 'AgriSpeak';
}
