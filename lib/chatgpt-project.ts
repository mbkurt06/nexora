/** ChatGPT consumer Projects do not expose a public API for creating personal project chats.
 * We only store an existing project URL, never credentials or access tokens.
 */
export const CHATGPT_PROJECT_KEY = 'nexora:chatgpt-project';

export function normalizeChatGPTProjectUrl(input: string): string | null {
  try {
    const url = new URL(input.trim());
    if (url.protocol !== 'https:' || url.hostname !== 'chatgpt.com') return null;
    if (!/^\/g\/g-p-[a-zA-Z0-9-]+\/project\/?$/.test(url.pathname)) return null;
    return url.origin + url.pathname.replace(/\/$/, '');
  } catch {
    return null;
  }
}

export function getChatGPTProjectUrl(): string | null {
  try { return normalizeChatGPTProjectUrl(localStorage.getItem(CHATGPT_PROJECT_KEY) || ''); }
  catch { return null; }
}

export function saveChatGPTProjectUrl(input: string): string | null {
  const valid = normalizeChatGPTProjectUrl(input);
  if (!valid) return null;
  try { localStorage.setItem(CHATGPT_PROJECT_KEY, valid); return valid; }
  catch { return null; }
}

export function clearChatGPTProjectUrl(): void {
  try { localStorage.removeItem(CHATGPT_PROJECT_KEY); } catch { /* Storage unavailable */ }
}

export const CHATGPT_PROJECT_INSTRUCTIONS =
  'Bu proje Nexora Günlük haberlerini değerlendirmek içindir. ' +
  'Her haber için ayrı bir sohbet açacağım. Konuyu kısa ve tarafsız açıkla; ' +
  'olay tarihi ile yayın tarihini ayır, kaynakları sorgula, iddiaları doğrulanmış olgulardan ayır. ' +
  'Gerektiğinde güncel kaynakları kontrol et. Türkçe, net ve analitik yanıt ver. ' +
  'Sesli konuşmaya geçtiğimde aynı haber bağlamıyla devam et.';
