import type { Article } from './types';
import { CATEGORY_LABELS } from './types';

/** A complete, self-contained copy of Nexora's own reporting, not the external publisher's article. */
export function formatArticleForChatGPT(article: Article): string {
  return [
    'NEXORA GÜNLÜK — HABER DEĞERLENDİRMESİ',
    'Haber başlığı: ' + article.title,
    'Kategori: ' + CATEGORY_LABELS[article.category] + ' / ' + article.subcategory,
    'Kaynak yayını: ' + (article.sourceName || 'Belirtilmemiş'),
    'Kaynak bağlantısı: ' + (article.sourceUrl || 'Belirtilmemiş'),
    'Yayın tarihi: ' + (article.publishedAt || 'Belirtilmemiş'),
    'Nexora günlük sayı tarihi: ' + (article.issueDate || 'Belirtilmemiş'),
    article.isDemo ? 'DİKKAT: Bu yazı güncel haber değil, örnek içeriktir.' : '',
    'Haber özeti:\n' + article.summary,
    'Nexora haber metni:\n' + article.body.join('\n\n'),
    'Bu haberin önemini Türkçe ve tarafsız değerlendir. Olay tarihini yayın tarihinden ayır, ' +
      'kanıtlanmış olgularla iddiaları ayır, gerekirse kaynakların güncelliğini yeniden doğrula. ' +
      'Bu sohbet içinde haberle ilgili sorularımı yanıtla. Dilersem sesli sohbete geçeceğim.'
  ].filter(Boolean).join('\n\n');
}
