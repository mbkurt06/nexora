import type { Article } from './types';

// These are deliberately timeless explainers, NOT invented news from the last 24 hours.
export const demoArticles: Article[] = [
  {
    id: 'demo-ai-agents', slug: 'ai-ajanlari-nasil-calisir', title: 'Yapay zekâ ajanları yazılım geliştirme sürecini nasıl değiştiriyor?',
    summary: 'Kod yazma, test, kod incelemesi ve planlama görevlerinin ajanlar arasında dağıtıldığı iş akışlarını tanıyalım.',
    body: [
      'Yapay zekâ ajanı, bir hedef doğrultusunda araç kullanan ve görevlerini adımlara ayırabilen bir yazılım bileşenidir. Birden fazla ajanın birlikte çalışması, özellikle geliştirme süreçlerinde yeni imkânlar sağlar.',
      'Örneğin bir ajan kullanıcı isteğini görevlere böler, ikinci ajan kod üretir, üçüncü ajan otomatik testleri çalıştırır ve son bir inceleme aşaması sonuçları kontrol eder. Bu akış tek başına kalite garantisi değildir.',
      'Üretim ortamında değişiklik yetkileri, bütçe sınırları, doğrulanabilir testler ve insan onayı önemli güvenlik noktalarıdır. Özellikle otomatik dağıtım sistemlerinde bu kontroller tasarımın merkezinde olmalıdır.'
    ], category: 'technology', subcategory: 'Yapay zekâ', publishedAt: null, sourceName: null, sourceUrl: null, importance: 'high', readTime: 3, coverTone: 'blue', isDemo: true
  },
  {
    id: 'demo-products', slug: 'akilli-gozluk-teknolojileri', title: 'Akıllı gözlüklerde hangi teknolojiler önem kazanıyor?',
    summary: 'Kameralar, artırılmış gerçeklik, yapay zekâ ve pil ömrü gibi özelliklerin neden belirleyici olduğuna bakalım.',
    body: [
      'Akıllı gözlükler, sesli asistanlar ve kameralar gibi özellikleri günlük kullanıma taşırken bazı tasarımlar gerçek artırılmış gerçeklik ekranları sunmayı hedefliyor.',
      'Ekran kalitesi, ağırlık, batarya ve mahremiyet temel sınırlar arasında. Kamera taşıyan ürünlerde çevredeki kişilerin bilgilendirilmesi ve veri güvenliği önemli.',
      'Yeni bir ürün haberi geldiğinde, duyurulan özelliklerle gerçekten piyasaya çıkan işlevleri birbirinden ayırmak gerekir.'
    ], category: 'technology', subcategory: 'Yeni ürünler', publishedAt: null, sourceName: null, sourceUrl: null, importance: 'normal', readTime: 2, coverTone: 'peach', isDemo: true
  },
  {
    id: 'demo-security', slug: 'passkeys-ve-hesap-guvenligi', title: 'Passkey, parolalara göre neden daha güvenli olabilir?',
    summary: 'Kimlik avına dayanıklı oturum açmanın temelini ve önemli sınırlarını öğrenelim.',
    body: [
      'Passkey, genel anahtar kriptografisini kullanarak bir hizmete giriş yapmayı sağlar. Özel anahtar cihazda saklanır; hizmete şifrenin kendisi gönderilmez.',
      'Bu yaklaşım geleneksel parola tabanlı kimlik avını önemli ölçüde azaltabilir. Ancak cihaz hesabının ele geçirilmesi ve kurtarma süreçleri yine de dikkat ister.',
      'İş ortamında dağıtımdan önce cihaz kaybı, erişim kurtarma ve kurumsal politika senaryoları değerlendirilmelidir.'
    ], category: 'technology', subcategory: 'Siber güvenlik', publishedAt: null, sourceName: 'FIDO Alliance', sourceUrl: 'https://fidoalliance.org/passkeys/', importance: 'high', readTime: 3, coverTone: 'red', isDemo: true
  },
  {
    id: 'demo-devops', slug: 'platform-engineering-temelleri', title: 'Platform engineering ile DevOps arasındaki ilişki nedir?',
    summary: 'Geliştirici platformlarının dağıtım ve altyapı karmaşıklığını nasıl azalttığını inceleyelim.',
    body: [
      'Platform engineering, yazılım ekiplerine tekrar kullanılabilir altyapı ve geliştirme hizmetleri sunan iç platformlar oluşturmayı amaçlar.',
      'DevOps yaklaşımını ortadan kaldırmaz; geliştiricilerin dağıtım, gözlemlenebilirlik ve altyapı yönetimi süreçlerinde daha az sürtünme yaşamasını destekler.',
      'İyi bir platform, güvenli varsayılanlar, anlaşılır dokümantasyon ve ekiplerin gerçekten kullandığı self-servis akışlarla değer üretir.'
    ], category: 'technology', subcategory: 'Yazılım ve DevOps', publishedAt: null, sourceName: null, sourceUrl: null, importance: 'normal', readTime: 3, coverTone: 'sage', isDemo: true
  },
  {
    id: 'demo-space', slug: 'otegezegenler-nasil-bulunuyor', title: 'Gökbilimciler uzak yıldızların gezegenlerini nasıl tespit ediyor?',
    summary: 'Geçiş yöntemi ve radyal hız ölçümleriyle görünmeyen dünyaları bulmanın mantığını keşfedelim.',
    body: [
      'Bir gezegen yıldızının önünden geçtiğinde, yıldızdan gelen ışık çok küçük miktarda azalabilir. Bu düzenli azalma, geçiş yöntemiyle bir gezegen adayını ortaya çıkarır.',
      'Radyal hız yönteminde gezegenin kütleçekim etkisiyle yıldızın hareketinde oluşan küçük değişimler ölçülür.',
      'Bir sinyalin gezegen olduğunun doğrulanması, yıldız etkinliği ve cihaz kaynaklı hata olasılıklarının incelenmesini gerektirir.'
    ], category: 'science', subcategory: 'Astronomi', publishedAt: null, sourceName: 'NASA Exoplanet Exploration', sourceUrl: 'https://science.nasa.gov/exoplanets/', importance: 'normal', readTime: 3, coverTone: 'indigo', isDemo: true
  },
  {
    id: 'demo-physics', slug: 'kuantum-bilgisayar-gercekte-nedir', title: 'Kuantum bilgisayarlar hangi problemlerde avantaj sağlayabilir?',
    summary: 'Kübit, süperpozisyon ve hata düzeltmeyi abartılı iddialardan ayırarak ele alıyoruz.',
    body: [
      'Kuantum bilgisayarlar bilgiyi kübitlerle işler. Süperpozisyon ve dolaşıklık gibi kuantum özelliklerinden yararlanarak belirli algoritmaları farklı şekilde gerçekleştirebilirler.',
      'Bu durum her hesaplamanın klasik bilgisayarlardan daha hızlı yapılacağı anlamına gelmez. Hatalar, ölçeklenebilirlik ve kullanılabilir algoritmalar büyük teknik sınırlardır.',
      'Bir kuantum üstünlüğü iddiası değerlendirirken problemin türü, karşılaştırılan klasik yöntem ve deneyin tekrarlanabilirliği önemlidir.'
    ], category: 'science', subcategory: 'Fizik ve matematik', publishedAt: null, sourceName: null, sourceUrl: null, importance: 'high', readTime: 4, coverTone: 'violet', isDemo: true
  },
  {
    id: 'demo-biology', slug: 'crispr-gen-duzenleme', title: 'CRISPR gen düzenleme teknolojisi ne yapabiliyor?',
    summary: 'Gen düzenlemenin kullanım alanları, araştırma sınırları ve etik sorularına giriş.',
    body: [
      'CRISPR sistemleri, DNA dizilerinde belirli hedeflere yönelmek için kullanılan moleküler araçlardan biridir. Araştırma laboratuvarlarında ve bazı tedavi geliştirme süreçlerinde kullanılır.',
      'Hedef dışı değişiklik riski, hücrelere ulaştırma yöntemleri ve uzun vadeli güvenlik önemli araştırma konularıdır.',
      'Bir klinik gelişmenin deney aşamasında mı, düzenleyici onay almış mı, yoksa rutin tedaviye dönüşmüş mü olduğuna özellikle dikkat edilmelidir.'
    ], category: 'science', subcategory: 'Biyoloji ve sağlık', publishedAt: null, sourceName: null, sourceUrl: null, importance: 'normal', readTime: 3, coverTone: 'green', isDemo: true
  },
  {
    id: 'demo-policy', slug: 'yapay-zeka-duzenlemelerini-okumak', title: 'Büyük ülkelerin yapay zekâ kararları nasıl değerlendirilmeli?',
    summary: 'Yasalaşmış karar, taslak düzenleme ve siyasi açıklama arasındaki farkları ayıralım.',
    body: [
      'Dünya gündeminde yapay zekâ düzenlemeleri sıkça tartışılıyor. Bir ülkenin yayımladığı basın açıklaması, yürürlüğe girmiş bir kanunla aynı hukuki ağırlıkta değildir.',
      'Sağlıklı bir haberde hangi kurumun karar aldığı, düzenlemenin kapsamı, yürürlük tarihi ve kimleri etkilediği açıkça belirtilmelidir.',
      'Küresel etkiler açısından da şirketlerin uyum maliyetleri, ticaret ilişkileri ve bireylerin hakları ayrı ayrı incelenmelidir.'
    ], category: 'world', subcategory: 'Küresel kararlar', publishedAt: null, sourceName: null, sourceUrl: null, importance: 'high', readTime: 3, coverTone: 'gold', isDemo: true
  },
  {
    id: 'demo-social', slug: 'viral-teknoloji-iddialari', title: 'X üzerinde yayılan teknoloji iddiaları nasıl doğrulanır?',
    summary: 'Viral bir gönderinin gerçekten haber olup olmadığını anlamak için pratik kontrol noktaları.',
    body: [
      'Bir paylaşımın hızla yayılması doğru olduğunu göstermez. Özellikle yeni ürün, büyük keşif veya şirket açıklaması iddialarında özgün kaynağa gitmek gerekir.',
      'Paylaşımın tarihi, ekran görüntüsünün bağlamı, resmî duyuru ve bağımsız kaynakların doğrulaması birlikte incelenmelidir.',
      'Nexora sosyal gündemde doğrulanmış bilgiler ile henüz doğrulanamayan iddiaları ayrı etiketlemeyi hedefler.'
    ], category: 'social', subcategory: 'X gündemi', publishedAt: null, sourceName: null, sourceUrl: null, importance: 'normal', readTime: 2, coverTone: 'slate', isDemo: true
  }
];
