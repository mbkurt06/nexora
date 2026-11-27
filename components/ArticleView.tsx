'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Bookmark, Clock3, ExternalLink, Info, Share2, X } from 'lucide-react';
import type { Article } from '@/lib/types';
import { CATEGORIES, CATEGORY_LABELS } from '@/lib/types';
import { SiteMenu } from '@/components/SiteMenu';
import { ChatGPTAction } from '@/components/ChatGPTAction';

function getSaved(): Set<string> {
  try { return new Set(JSON.parse(localStorage.getItem('nexora:saved') || '[]') as string[]); }
  catch { return new Set(); }
}


const GLOSSARY: Record<string, { title: string; explanation: string }> = {
  esa: { title: 'ESA — Avrupa Uzay Ajansı', explanation: 'Avrupa ülkelerinin ortak uzay araştırmaları kurumudur. Bilimsel uydular, gezegen keşif araçları ve uzay güvenliği görevleri geliştirir. NASA’dan ayrı bir kuruluştur.' },
  hera: { title: 'Hera uzay görevi', explanation: 'ESA’nın Didymos ve Dimorphos adlı çift asteroit sistemini inceleyen uzay aracıdır. NASA’nın 2022’de gerçekleştirdiği DART çarpışmasının asteroidi nasıl etkilediğini yerinde ölçmek için gönderildi.' },
  dimorphos: { title: 'Dimorphos nedir?', explanation: 'Didymos adlı daha büyük asteroidin çevresinde dolanan yaklaşık 160 metre çapındaki küçük asteroittir. NASA’nın DART uzay aracı 2022’de kasıtlı olarak Dimorphos’a çarptı.' },
  didymos: { title: 'Didymos nedir?', explanation: 'Dimorphos’un çevresinde dolandığı daha büyük asteroittir. İkili sistem, gezegen savunmasında bir asteroidin yörüngesinin değiştirilebilirliğini ölçmek için inceleniyor.' },
  dart: { title: 'DART — Çift Asteroit Yönlendirme Testi', explanation: 'NASA’nın 2022’de bir uzay aracını Dimorphos’a çarptırarak gökcisminin yörüngesini değiştirmeyi sınadığı gezegen savunması görevidir. Açılımı Double Asteroid Redirection Test’tir.' },
  nasa: { title: 'NASA — ABD Uzay Ajansı', explanation: 'Amerika Birleşik Devletleri’nin sivil uzay araştırmaları kurumudur. Uzay araçları, bilimsel görevler ve Dünya gözlemleri yürütür.' },
  cern: { title: 'CERN — Avrupa Nükleer Araştırma Merkezi', explanation: 'Parçacık fiziği araştırmalarının yürütüldüğü uluslararası bilim merkezidir. Büyük Hadron Çarpıştırıcısı da burada bulunur.' },
  who: { title: 'WHO — Dünya Sağlık Örgütü', explanation: 'Birleşmiş Milletler bünyesinde uluslararası halk sağlığını koordine eden kurumdur. Türkçe kısaltması DSÖ’dür.' },
  'dsö': { title: 'DSÖ — Dünya Sağlık Örgütü', explanation: 'Ülkelerin sağlık sistemleri arasında iş birliğini destekleyen ve küresel sağlık rehberleri yayımlayan Birleşmiş Milletler kuruluşudur.' },
  unesco: { title: 'UNESCO', explanation: 'Birleşmiş Milletler Eğitim, Bilim ve Kültür Örgütüdür. Eğitim, bilim, kültürel miras ve bilgiye erişim alanlarında çalışır.' },
  fcc: { title: 'FCC — ABD Federal İletişim Komisyonu', explanation: 'ABD’de radyo, televizyon, telekomünikasyon ve bazı uydu iletişim faaliyetlerini düzenleyen federal kurumdur.' },
  ai: { title: 'AI — Yapay Zekâ', explanation: 'Artificial Intelligence sözcüklerinin kısaltmasıdır. Verilerden örüntü öğrenebilen veya çeşitli görevleri gerçekleştirebilen bilgisayar sistemlerini kapsar.' },
  llm: { title: 'LLM — Büyük Dil Modeli', explanation: 'Large Language Model kısaltmasıdır. Büyük miktarda metinle eğitilmiş, dil anlama ve üretme görevlerinde kullanılan yapay zekâ modelidir.' },
  pfas: { title: 'PFAS — Kalıcı kimyasallar', explanation: 'Per- ve polifloroalkil maddelerdir. Bazıları çevrede çok yavaş parçalandığı için kalıcı kimyasallar olarak anılır.' },
  ab: { title: 'AB — Avrupa Birliği', explanation: 'Avrupa ülkelerinin siyasi ve ekonomik iş birliği topluluğudur. Avrupa Komisyonu, Parlamento ve Konsey gibi kurumları vardır.' },
  fmri: { title: 'fMRI — İşlevsel manyetik rezonans', explanation: 'Beyindeki kan oksijenlenmesi değişimlerini izleyerek beyin etkinliğiyle ilişkili sinyalleri ölçen görüntüleme yöntemidir.' },
  "acm": { title: "ACM — Bilgisayar Bilimleri Derneği", explanation: "Association for Computing Machinery. Bilgisayar bilimi alanındaki araştırmaları, bilimsel dergileri ve konferansları destekleyen uluslararası meslek kuruluşudur." },
  "k-server": { title: "k-server problemi", explanation: "Bilgisayar biliminde çevrimiçi karar verme problemidir: Elimizde farklı konumlarda k adet hizmet aracı (örneğin taksi veya teknisyen) bulunur. İstekler sırayla gelir; sonraki isteği bilmeden hangi aracı göndereceğimize karar veririz. Amaç araçların toplam hareket maliyetini düşük tutmaktır. İnternet sunucusunun türü değil, matematiksel bir modeldir." },
  "çevrimiçi algoritma": { title: "Çevrimiçi algoritma", explanation: "Verilerin veya isteklerin tamamını baştan görmeden, bilgiler geldikçe karar vermek zorunda olan algoritmadır. Geleceği bilmeyen taksi yönlendirme sistemi buna örnek olabilir." },
  "rastgeleleştirilmiş": { title: "Rastgeleleştirilmiş algoritma", explanation: "Aynı girdide her seferinde aynı seçimi yapmak yerine belirli olasılıklarla farklı kararlar verebilen algoritma yaklaşımıdır. Amaç bazı zor durumlarda daha iyi ortalama performans elde etmektir." },
  "rekabet oranı": { title: "Rekabet oranı", explanation: "Bir çevrimiçi algoritmanın maliyetinin, gelecekteki bütün istekleri baştan bilen ideal algoritmanın maliyetine göre ne kadar arttığını ölçer. Oran küçüldükçe performans garantisi iyileşir." },
  "alt sınır": { title: "Matematiksel alt sınır", explanation: "Bir problemde hiçbir yöntemin belirli bir performans eşiğinden daha iyi olamayacağını gösteren kanıtlanmış sınırdır." },
  "varsayım": { title: "Bilimsel / matematiksel varsayım", explanation: "Doğruluğu henüz kesin kanıtlanmamış, ancak matematikçilerin doğru olabileceğini düşündüğü önermedir. Karşı örnek bulunduğunda genel iddia çürütülür." },
  "arxiv": { title: "arXiv", explanation: "Araştırmacıların bilimsel çalışmalarını dergi hakemliği tamamlanmadan da paylaşabildiği açık ön baskı arşividir. Bir çalışma arXiv’de yer aldığı için hakemli sayılmaz." },
  "ön baskı": { title: "Ön baskı (preprint)", explanation: "Bilimsel makalenin hakem değerlendirmesinden önce çevrimiçi yayımlanan sürümüdür; bulgular henüz bağımsız uzman kontrolünden geçmemiş olabilir." },
  "hakem değerlendirmesi": { title: "Hakem değerlendirmesi", explanation: "Bir araştırmanın alan uzmanlarınca yöntem, veri ve çıkarımlar bakımından eleştirel biçimde incelenmesi sürecidir. Hatasızlık garantisi değildir." },
  "riemann hipotezi": { title: "Riemann hipotezi", explanation: "Asal sayıların dağılımıyla ilişkili Riemann zeta fonksiyonunun sıfırları hakkında 1859’dan beri çözülememiş önemli bir matematik varsayımıdır." },
  "kuantum": { title: "Kuantum", explanation: "Atom ve atomaltı ölçekte madde ile enerjinin davranışını açıklayan fiziğe ilişkin terimdir. Günlük nesnelerin sezgisel davranışından farklı olgular içerebilir." },
  "kübit": { title: "Kübit (qubit)", explanation: "Kuantum bilgisayarındaki temel bilgi birimidir. Klasik bitin 0/1 değerlerinden farklı olarak ölçüm öncesinde kuantum durumlarının birleşimini temsil edebilir." },
  "kuantum dolanıklık": { title: "Kuantum dolanıklık", explanation: "İki veya daha çok kuantum sisteminin ölçüm sonuçları arasında klasik açıklamayla elde edilemeyen güçlü ilişkiler bulunmasıdır. Işıktan hızlı mesajlaşma sağlamaz." },
  "süperiletken": { title: "Süperiletken", explanation: "Uygun koşullarda elektrik direnci sıfıra yaklaşan ve manyetik alanı belirli biçimde dışlayan malzemedir. Genellikle çok düşük sıcaklıklar gerekir." },
  "füzyon": { title: "Nükleer füzyon", explanation: "Hafif atom çekirdeklerinin birleşerek daha ağır çekirdek oluşturmasıdır. Güneş’in enerji kaynağıdır; yeryüzünde sürekli ve ekonomik elektrik üretimi ayrı bir mühendislik sorunudur." },
  "grafen": { title: "Grafen", explanation: "Karbon atomlarının tek atom kalınlığında altıgen ağ oluşturduğu, elektriksel ve mekanik özellikleri araştırılan malzemedir." },
  "kuasar": { title: "Kuasar", explanation: "Uzak bir galaksinin merkezindeki çok büyük kütleli kara deliğe düşen maddeden kaynaklanan son derece parlak çekirdektir." },
  "kırmızıya kayma": { title: "Kırmızıya kayma", explanation: "Bir ışık kaynağından gelen dalga boylarının daha uzun, kırmızı tarafa kaymasıdır. Evrenin genişlemesi gibi nedenlerle oluşabilir; astronomide uzaklık ve hareketi araştırmak için kullanılır." },
  "kara delik": { title: "Kara delik", explanation: "Kütleçekimi çok güçlü olduğu için olay ufkunun içinden ışığın bile kaçamadığı uzay bölgesidir." },
  "asteroit": { title: "Asteroit", explanation: "Güneş çevresinde dolanan, gezegenlerden küçük çoğu kayalık gökcismidir." },
  "yörünge": { title: "Yörünge", explanation: "Bir cismin başka bir cismin kütleçekiminden etkilenerek izlediği hareket yoludur." },
  "jaxa": { title: "JAXA — Japon Uzay Ajansı", explanation: "Japonya’nın uzay ve havacılık araştırmaları kurumudur. Bilimsel uydular ve keşif görevleri yürütür." },
  "iss": { title: "ISS — Uluslararası Uzay İstasyonu", explanation: "Dünya yörüngesinde çeşitli ülkelerin ortak kullandığı, insanların uzun süreli araştırmalar yaptığı uzay laboratuvarıdır." },
  "alma": { title: "ALMA teleskop dizisi", explanation: "Şili’de yüksek irtifada bulunan, çok sayıda radyo antenini birlikte kullanan astronomi gözlemevidir. Özellikle soğuk gaz ve toz bölgelerini inceler." },
  "spherex": { title: "SPHEREx", explanation: "NASA’nın gökyüzünü yakın kızılötesi dalga boylarında taramak üzere tasarlanmış uzay teleskobu görevidir." },
  "nif": { title: "NIF — National Ignition Facility", explanation: "ABD’de lazerlerle çok küçük füzyon hedeflerini sıkıştıran deney tesisidir; deneysel ateşleme başarısı ticari füzyon santraliyle aynı şey değildir." },
  "dna": { title: "DNA", explanation: "Canlıların kalıtsal bilgisini taşıyan moleküldür. Genlerde biyolojik yapıları ve işlevleri etkileyen bilgiler yer alır." },
  "rna": { title: "RNA", explanation: "Genetik bilginin okunması, taşınması ve protein üretimi gibi süreçlerde görev alan nükleik asittir." },
  "mrna": { title: "mRNA — Mesajcı RNA", explanation: "Hücrenin protein üretim mekanizmasına hangi proteinin yapılacağını bildiren RNA türüdür." },
  "genom": { title: "Genom", explanation: "Bir canlının sahip olduğu genetik materyalin bütünüdür." },
  "mikrobiyota": { title: "Mikrobiyota", explanation: "Bağırsak veya cilt gibi belirli bir ortamda yaşayan mikroorganizmaların tümüdür; tek başına hastalık tanısı anlamına gelmez." },
  "bütirat": { title: "Bütirat", explanation: "Bağırsak bakterilerinin bazı lifleri fermente etmesiyle oluşabilen kısa zincirli yağ asididir; bağırsak hücreleri için enerji kaynağı olabilir." },
  "peptit": { title: "Peptit", explanation: "İki veya daha fazla amino asidin zincir halinde bağlanmasıyla oluşan moleküldür; bazıları vücutta sinyal işlevi görür." },
  "mr": { title: "MR — Manyetik rezonans", explanation: "Güçlü manyetik alan ve radyo dalgalarıyla vücudun iç yapılarının görüntülerini üreten yöntemdir; iyonlaştırıcı X ışını kullanmaz." },
  "ekg": { title: "EKG — Elektrokardiyografi", explanation: "Kalbin elektriksel etkinliğini cilt üzerindeki elektrotlarla kaydeden testtir." },
  "vagus siniri": { title: "Vagus siniri", explanation: "Beyinden göğüs ve karın bölgesindeki pek çok organa uzanan, kalp atımı ve sindirim gibi otomatik işlevlerle ilişkili sinirdir." },
  "ebpf": { title: "eBPF", explanation: "Linux çekirdeğinde belirli olaylar sırasında güvenli biçimde denetlenmiş küçük programlar çalıştırılmasını sağlayan teknolojidir. İzleme, ağ ve güvenlik için kullanılır." },
  "linux": { title: "Linux", explanation: "Sunucular, telefonlar ve gömülü cihazlar dahil birçok sistemin temelini oluşturan açık kaynaklı işletim sistemi çekirdeğidir." },
  "api": { title: "API — Uygulama Programlama Arayüzü", explanation: "İki yazılımın belirlenmiş kurallar üzerinden veri veya işlem alışverişi yapmasını sağlayan arayüzdür." },
  "gpu": { title: "GPU — Grafik İşlem Birimi", explanation: "Çok sayıda hesaplamayı paralel işlemek için tasarlanmış çiptir; grafiklerin yanı sıra yapay zekâ eğitiminde de kullanılır." },
  "cpu": { title: "CPU — Merkezi İşlem Birimi", explanation: "Bilgisayarın genel amaçlı komutlarını çalıştıran ana işlemcisidir." },
  "ram": { title: "RAM — Bellek", explanation: "Bilgisayarın çalışırken ihtiyaç duyduğu verileri geçici olarak sakladığı hızlı bellek türüdür; güç kesilince içerik genellikle kaybolur." },
  "veri merkezi": { title: "Veri merkezi", explanation: "Sunucuların, depolama cihazlarının, ağ ve soğutma altyapısının toplandığı tesistir." },
  "bulut bilişim": { title: "Bulut bilişim", explanation: "Hesaplama, depolama ve yazılım hizmetlerinin uzaktaki veri merkezlerinden internet üzerinden sunulmasıdır." },
  "sıfır gün": { title: "Sıfır gün açığı", explanation: "Yazılım üreticisinin henüz yama hazırlamadığı veya yeni öğrendiği güvenlik açığıdır; saldırganlar tarafından kullanılıyorsa risk yüksektir." },
  "fidye yazılımı": { title: "Fidye yazılımı", explanation: "Dosyaları şifreleyerek veya veri sızdırmakla tehdit ederek para isteyen kötü amaçlı yazılım ya da saldırı türüdür." },
  "pwa": { title: "PWA — İlerici Web Uygulaması", explanation: "Web sitesi olarak çalışan ancak ana ekrana eklenebilen, uygun koşullarda çevrimdışı özellikler sunabilen uygulama yaklaşımıdır." },
  "açık kaynak": { title: "Açık kaynak yazılım", explanation: "Kaynak kodu belirli bir lisansla incelenebilen, değiştirilebilen ve paylaşılabilen yazılımdır; tüm kullanım biçimleri otomatik olarak ücretsiz değildir." },
  "telif hakkı": { title: "Telif hakkı", explanation: "Eser sahibinin yaratıcılık ürünü üzerindeki çoğaltma, dağıtma ve uyarlama gibi haklarını düzenleyen hukuki korumadır." },
  "eurostat": { title: "Eurostat", explanation: "Avrupa Birliği’nin resmi istatistik kurumudur; üye ülkelerden karşılaştırılabilir ekonomik ve toplumsal veriler yayımlar." },
  "enflasyon": { title: "Enflasyon", explanation: "Mal ve hizmet fiyatlarının genel düzeyinde zaman içinde görülen artıştır. Tek bir ürünün fiyat artışıyla aynı şey değildir." },
  "faiz oranı": { title: "Faiz oranı", explanation: "Borç alınan para için ödenen ya da birikime sağlanan getirinin anapara oranıdır; merkez bankası politika faizi piyasa koşullarını etkileyebilir." },
  "gümrük tarifesi": { title: "Gümrük tarifesi", explanation: "Bir ülkeye ithal edilen ürünlere uygulanan vergi oranı veya vergi düzenlemesidir; maliyeti tüketici ve şirketlere yansıyabilir." },
  "ticaret açığı": { title: "Dış ticaret açığı", explanation: "Belirli dönemde mal ithalatının mal ihracatından fazla olmasıdır. Kamu bütçe açığıyla karıştırılmamalıdır." },
  "gsyh": { title: "GSYH — Gayrisafi Yurt İçi Hasıla", explanation: "Bir ülke sınırları içinde belirli dönemde üretilen nihai mal ve hizmetlerin toplam parasal değeridir." },
  "cop": { title: "COP — Taraflar Konferansı", explanation: "İklim değişikliği anlaşmalarına taraf ülkelerin yıllık müzakere toplantıları için kullanılan kısaltmadır; COP sayısı toplantı sırasını gösterir." },
  "unfccc": { title: "UNFCCC — BM İklim Değişikliği Çerçeve Sözleşmesi", explanation: "Ülkelerin iklim değişikliğiyle mücadele konusunda birlikte çalışmasını sağlayan uluslararası sözleşmedir." },
  "karbon nötr": { title: "Karbon nötr", explanation: "Belirli sınırlar içinde salınan karbon miktarının azaltımlar ve kalan kısmı dengeleme uygulamalarıyla net sıfıra indirilmesidir." },
  "mikroplastik": { title: "Mikroplastik", explanation: "Genellikle 5 milimetreden küçük plastik parçacıklarıdır. Çevrede ve canlılarda bulunabilir; her maruziyetin etkisi aynı düzeyde bilinmez." },
  "algoritma": { title: "Algoritma", explanation: "Bir problemi çözmek veya bir işi yapmak için izlenen açık ve sonlu adımlar dizisidir." },
  "makine öğrenmesi": { title: "Makine öğrenmesi", explanation: "Bilgisayarların verilerden istatistiksel ilişkiler öğrenerek tahmin veya sınıflandırma yapmasını sağlayan yöntemlerdir." },
  "derin öğrenme": { title: "Derin öğrenme", explanation: "Çok katmanlı yapay sinir ağlarını kullanarak görüntü, ses ve metin gibi verilerde örüntü öğrenen makine öğrenmesi yaklaşımıdır." },
  "halüsinasyon": { title: "Yapay zekâ halüsinasyonu", explanation: "Bir yapay zekâ modelinin doğruymuş gibi sunduğu fakat kaynaklar veya gerçeklerle desteklenmeyen içerik üretmesidir." },
  "openai": { title: "OpenAI", explanation: "ChatGPT gibi yapay zekâ sistemlerini geliştiren teknoloji şirketidir." },
  "chatgpt": { title: "ChatGPT", explanation: "Metin ve ses üzerinden soruları yanıtlayabilen, yazı üretimi ve analiz gibi görevlerde kullanılan yapay zekâ asistanıdır." },
  "gemini": { title: "Gemini", explanation: "Google’ın yapay zekâ model ve asistan ailesinin adıdır; sürümlere göre yetenekler değişir." },
  "claude": { title: "Claude", explanation: "Anthropic tarafından geliştirilen yapay zekâ asistanı ve dil modeli ailesidir." },
  "alphafold": { title: "AlphaFold", explanation: "Proteinlerin üç boyutlu yapısını tahmin etmek için geliştirilen yapay zekâ sistemleri ailesidir; deneysel doğrulamayı tümüyle ortadan kaldırmaz." },
  "çip": { title: "Çip", explanation: "Elektronik devrelerin çok küçük bir yarı iletken malzeme üzerine yerleştirildiği bileşendir." },
  "yarı iletken": { title: "Yarı iletken", explanation: "Elektriksel iletkenliği belirli koşullarla kontrol edilebilen ve bilgisayar çiplerinin temelini oluşturan malzeme türüdür." },
  "biyobelirteç": { title: "Biyobelirteç", explanation: "Bir hastalığı, biyolojik süreci ya da tedaviye yanıtı değerlendirmek için ölçülen biyolojik göstergedir." },
  "klinik çalışma": { title: "Klinik çalışma", explanation: "Bir tedavi veya yöntemin insanlarda güvenlilik ve etkililiğini belirli araştırma kurallarıyla değerlendiren çalışmadır." },
};

const GLOSSARY_REGEX = new RegExp(
  '(?<![\\p{L}\\p{N}])(' + Object.keys(GLOSSARY)
    .sort((a, b) => b.length - a.length)
    .join('|') + ')(?![\\p{L}\\p{N}])',
  'giu'
);
function GlossaryText({ text, onExplain }: { text: string; onExplain: (key: string) => void }) {
  return <>{text.split(GLOSSARY_REGEX).map((part, index) => {
    const term = GLOSSARY[part.toLowerCase()];
    return term ? <button type="button" key={index} className="glossary-term" onClick={() => onExplain(part.toLowerCase())} aria-label={part + ' terimini açıkla'}>{part}<Info size={13} aria-hidden="true"/></button> : part;
  })}</>;
}

export function ArticleView({ article }: {article: Article}) {
  const [saved, setSaved] = useState(false);
  const [shareNotice, setShareNotice] = useState('');
  const [activeTerm, setActiveTerm] = useState<string | null>(null);

  useEffect(() => {
    if (!activeTerm) return;
    const onEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') setActiveTerm(null); };
    window.addEventListener('keydown', onEscape);
    return () => window.removeEventListener('keydown', onEscape);
  }, [activeTerm]);

  useEffect(() => {
    try {
      const read = new Set(JSON.parse(localStorage.getItem('nexora:read') || '[]') as string[]);
      read.add(article.id);
      localStorage.setItem('nexora:read', JSON.stringify([...read]));
    } catch { /* Storage is optional */ }
    setSaved(getSaved().has(article.id));
  }, [article.id]);

  const toggleSaved = () => {
    try {
      const next = getSaved();
      if (next.has(article.id)) next.delete(article.id);
      else next.add(article.id);
      localStorage.setItem('nexora:saved', JSON.stringify([...next]));
      setSaved(next.has(article.id));
    } catch {
      setShareNotice('Bu tarayıcı kaydetme özelliğini engelliyor.');
    }
  };

  const share = async () => {
    const payload = { title: article.title, text: article.summary, url: window.location.href };
    try {
      if (navigator.share) await navigator.share(payload);
      else {
        await navigator.clipboard.writeText(window.location.href);
        setShareNotice('Haber bağlantısı kopyalandı.');
      }
    } catch { /* Share dialog may be cancelled */ }
  };

  const issueQuery = article.issueDate ? `&date=${encodeURIComponent(article.issueDate)}` : '';
  const categoryHref = `/?category=${article.category}${issueQuery}#haberler`;
  const subcategoryHref = `/?category=${article.category}&subcategory=${encodeURIComponent(article.subcategory)}${issueQuery}#haberler`;

  return (
    <div className="app-shell article-shell">
      <header className="article-header">
        <SiteMenu/>
        <Link href="/" className="back-link"><ArrowLeft size={19}/> <span>Gazeteye dön</span></Link>
        <Link href="/" className="brand small-brand">NEXORA<span className="brand-dot">.</span></Link>
        <div className="article-header-actions">
          <ChatGPTAction article={article} placement="header"/>
        </div>
      </header>

      <main className="story-layout">
        <div className="story-head">
          <nav className="story-eyebrow" aria-label="Haber konumu">
            <Link href="/?category=all">NEXORA GÜNLÜK</Link>
            <span aria-hidden="true">/</span>
            <Link href={categoryHref}>{CATEGORY_LABELS[article.category]}</Link>
            <span aria-hidden="true">/</span>
            <Link href={subcategoryHref}>{article.subcategory}</Link>
          </nav>
          <h1>{article.title}</h1>
          <p className="story-deck"><GlossaryText text={article.summary} onExplain={setActiveTerm}/></p>
          <div className="story-metadata">
            <span><Clock3 size={15}/>{article.readTime} dk okuma</span>
            <span>{article.isDemo ? 'Örnek içerik • Güncel haber değil'
              : article.publishedAt
              ? new Intl.DateTimeFormat('tr-TR', {dateStyle:'long'}).format(new Date(article.publishedAt))
              : article.issueDate
              ? new Intl.DateTimeFormat('tr-TR', {dateStyle:'long', timeZone:'UTC'}).format(new Date(article.issueDate + 'T12:00:00Z'))
              : 'Tarih belirtilmedi'}</span>
          </div>
          {article.isDemo && <div className="demo-banner">Bu yazı arayüzü denemek içindir. Güncel haber olarak sunulmuyor.</div>}
        </div>
        <div className={'story-hero tone-'+article.coverTone} aria-hidden="true">
          <span>{CATEGORIES.find(c => c.id === article.category)?.icon || '✦'}</span>
        </div>
        <div className="story-body">
          {article.body.map((paragraph, i) => <p key={i}><GlossaryText text={paragraph} onExplain={setActiveTerm}/></p>)}
        </div>
        <div className="sources-block">
          <h2>Kaynak ve doğrulama</h2>
          {article.sourceUrl
            ? <a target="_blank" rel="noopener noreferrer" href={article.sourceUrl}>
                {article.sourceName || 'Orijinal kaynak'} <ExternalLink size={15}/>
              </a>
            : <p>Bu içerik için doğrudan haber kaynağı verilmedi.</p>}
        </div>
        <div className="story-bottom">
          <button onClick={toggleSaved}><Bookmark size={18} fill={saved ? 'currentColor' : 'none'}/>{saved ? 'Kaydedildi' : 'Sonra okumak için kaydet'}</button>
          <button onClick={share}><Share2 size={18}/>Paylaş</button>
        </div>
        {shareNotice && <p className="toast-inline">{shareNotice}</p>}
      </main>
      {activeTerm && GLOSSARY[activeTerm] && <div className="glossary-backdrop" onClick={() => setActiveTerm(null)}>
        <div className="glossary-dialog" role="dialog" aria-modal="true" aria-labelledby="glossary-title" onClick={event => event.stopPropagation()}>
          <button className="glossary-close" type="button" onClick={() => setActiveTerm(null)} aria-label="Açıklamayı kapat"><X size={22}/></button>
          <span className="glossary-eyebrow"><Info size={16}/> TERİM AÇIKLAMASI</span>
          <h2 id="glossary-title">{GLOSSARY[activeTerm].title}</h2>
          <p>{GLOSSARY[activeTerm].explanation}</p>
          <button className="glossary-done" onClick={() => setActiveTerm(null)}>Okumaya devam et</button>
        </div>
      </div>}
      <footer className="footer">
        <span>NEXORA<span className="brand-dot">.</span></span>
        <small>Merakla oku. Kaynağı kontrol et. Birlikte düşün.</small>
      </footer>
    </div>
  );
}
