import { useState, useEffect, useRef } from "react";

// ── Nöromit Veritabanı ────────────────────────────────────────────────────────
const BASLANGIC_MITLER = [
  { id:1, baslik:"%10 Beyin Teorisi", kategori:"Beyin Kullanımı", emoji:"🧠", mit:"İnsanlar beyninin yalnızca %10'unu kullanır; geri kalan %90'ı atıl durumdadır.", bilim:"Beyin görüntüleme çalışmaları, günlük aktiviteler sırasında beynin tamamının kullanıldığını göstermektedir.", fenBaglantisi:"Fen derslerinde her öğrencinin tam kapasitede öğrenebileceği mesajı verilmelidir.", alternatif:"Öğrencilerin farklı beyin bölgelerini aktive eden çeşitli öğrenme aktiviteleri sunun.", kaynaklar:["Beyerstein, B.L. (1999). Whence cometh the myth that we only use 10% of our brains?"], anahtar_kelimeler:["%10 beyin","beynin onda biri","beyin kapasitesi","kullanılmayan beyin"] },
  { id:2, baslik:"Öğrenme Stilleri (VAK)", kategori:"Öğrenme", emoji:"👁️", mit:"Her öğrencinin görsel, işitsel veya kinestetik gibi belirli bir öğrenme stili vardır.", bilim:"Pashler ve ark. (2008) öğrenme stillerinin öğrenme çıktısını etkilediğine dair güvenilir kanıt bulunmadığını ortaya koymuştur.", fenBaglantisi:"Fen derslerinde 'görsel öğrenci' veya 'kinestetik öğrenci' etiketlemesi yapılmamalıdır.", alternatif:"Tüm öğrencilere çoklu temsil biçimleri sunun: deney + grafik + açıklama.", kaynaklar:["Pashler et al. (2008). Learning Styles: Concepts and Evidence."], anahtar_kelimeler:["görsel öğrenci","işitsel öğrenci","kinestetik","öğrenme stili","VAK"] },
  { id:3, baslik:"Sol Beyin / Sağ Beyin", kategori:"Beyin Lateralizasyonu", emoji:"🔀", mit:"İnsanlar ya sol beyin (mantıksal) ya da sağ beyin (yaratıcı) baskın olarak düşünür.", bilim:"fMRI çalışmaları her iki yarıkürenin de çoğu görevde birlikte çalıştığını göstermektedir.", fenBaglantisi:"Fen öğretiminde 'bu aktivite sağ beyin öğrencileri için' gibi etiketlemelerden kaçının.", alternatif:"Fen derslerinde yaratıcı ve analitik düşünmeyi bir arada kullanın.", kaynaklar:["Nielsen et al. (2013). PLOS ONE - An Evaluation of the Left-Brain vs. Right-Brain Hypothesis"], anahtar_kelimeler:["sol beyin","sağ beyin","sol beyinli","sağ beyinli"] },
  { id:4, baslik:"Çoklu Zeka Kuramı", kategori:"Çoklu Zeka", emoji:"🎯", mit:"Her öğrencinin belirli bir zeka tipi vardır ve öğretim bu zeka tipine göre tasarlanmalıdır.", bilim:"Gardner'ın kuramı teorik bir çerçevedir; belirli zeka tipine göre öğretimin başarıyı artırdığına dair ampirik kanıt yetersizdir.", fenBaglantisi:"Fen derslerinde yalnızca bir zeka tipine göre etkinlik sunmak tüm öğrencilere hizmet etmez.", alternatif:"Zengin öğrenme ortamları yaratın: görsel, işitsel, hareket temelli aktiviteleri birlikte sunun.", kaynaklar:["Waterhouse (2006). Multiple Intelligences, the Mozart Effect... Educational Psychologist."], anahtar_kelimeler:["çoklu zeka","müzikal zeka","bedensel zeka","Gardner","zeka tipi"] },
  { id:5, baslik:"Beyin Jimnastiği (Brain Gym)", kategori:"Öğrenme Aktivasyonu", emoji:"🤸", mit:"Belirli fiziksel hareketler nöral bağlantıları güçlendirerek öğrenmeyi doğrudan artırır.", bilim:"Brain Gym'in etkinliğini destekleyen bağımsız, hakemli araştırma bulunmamaktadır.", fenBaglantisi:"Fen derslerinde kısa molalar faydalıdır — nedeni 'nöral bağlantı' değil, dikkat yenilemedir.", alternatif:"Ders aralarında kısa fiziksel molalar verin, bunu 'dikkat yenileme' olarak açıklayın.", kaynaklar:["Hyatt (2007). Brain Gym: Building Stronger Brains or Wishful Thinking?"], anahtar_kelimeler:["brain gym","beyin jimnastiği","beyin aktivasyonu","nöral egzersiz"] },
  { id:6, baslik:"Kritik Dönem Mitosu", kategori:"Beyin Gelişimi", emoji:"⏰", mit:"Beyin gelişimi için kritik dönemler vardır ve bu dönemler kaçırılırsa öğrenme kalıcı olarak zorlaşır.", bilim:"Beyin plastisite özelliğini yaşam boyu korur. Beyin hiçbir zaman öğrenmeye kapanmaz.", fenBaglantisi:"'Bu konuyu ilkokulda öğrenmeliydi, artık zor' gibi düşüncelerden kaçınılmalıdır.", alternatif:"Tüm yaş gruplarına bilimsel düşünme becerisi kazandırılabilir.", kaynaklar:["Blakemore & Frith (2005). The Learning Brain: Lessons for Education."], anahtar_kelimeler:["kritik dönem","hassas dönem","erken öğrenme","beyin kapanır"] }
];

// ── Güncel Araştırmalar Veritabanı ───────────────────────────────────────────
const BASLANGIC_ARASTIRMALAR = [
  { id:1, baslik:"Türk Fen Öğretmenlerinde Nöromit Yaygınlığı", ozet:"Ortaokul fen bilimleri öğretmenlerinin %76'sının öğrenme stilleri mitine inandığı, %61'inin sol/sağ beyin teorisini geçerli saydığı tespit edilmiştir. Araştırma 340 öğretmen ile yürütülmüştür.", kaynak:"Dündar & Çakıroğlu (2024). Fen Bilimleri Eğitimi Dergisi, 12(1), 45-67.", yil:"2024", etiket:"Türkiye", renk:"#4fc3f7" },
  { id:2, baslik:"Nöromit Eğitiminin Öğretmen İnançlarına Etkisi", ozet:"8 haftalık nöromit farkındalık eğitimi alan fen öğretmenlerinin mit inançlarında %43 oranında azalma gözlemlenmiştir. Mobil tabanlı müdahalelerin yüz yüze eğitimle benzer etkinlik gösterdiği bulunmuştur.", kaynak:"Howard-Jones et al. (2024). Mind, Brain & Education, 18(2), 112-128.", yil:"2024", etiket:"Meta-Analiz", renk:"#9c64f0" },
  { id:3, baslik:"Çoklu Zeka ve Fen Başarısı İlişkisi", ozet:"Gardner'ın çoklu zeka kuramına göre tasarlanan fen etkinliklerinin kontrol grubuna kıyasla anlamlı bir akademik üstünlük sağlamadığı randomize kontrollü çalışmada ortaya konmuştur.", kaynak:"Rogowsky & Calhoun (2023). Science Education, 107(4), 890-912.", yil:"2023", etiket:"RKÇ", renk:"#66bb6a" }
];

// ── Sabitler ──────────────────────────────────────────────────────────────────
const EMOJILER = ["🧠","👁️","🔀","🎯","🤸","⏰","💡","🔬","📚","🎓","⚡","🌱","🔑","💭","🧩","🎨","📖","🔍","🧬","🔭"];
const ARASTIRMA_RENKLERI = ["#4fc3f7","#9c64f0","#66bb6a","#f06292","#ffb74d","#80cbc4"];
const BOŞ_FORM = { baslik:"", kategori:"", yeniKategori:"", emoji:"🧠", mit:"", bilim:"", fenBaglantisi:"", alternatif:"", kaynaklar:"", anahtar_kelimeler:"" };
const BOŞ_ARASTIRMA = { baslik:"", ozet:"", kaynak:"", yil:"", etiket:"", renk:"#4fc3f7" };

// ── Yardımcı ──────────────────────────────────────────────────────────────────
function tespit_et(metin, mitler) {
  const metinKucuk = metin.toLowerCase();
  return mitler.filter(mit => mit.anahtar_kelimeler.some(k => metinKucuk.includes(k.toLowerCase())))
    .map(mit => ({ ...mit, eslesen_kelimeler: mit.anahtar_kelimeler.filter(k => metinKucuk.includes(k.toLowerCase())) }));
}

function Alan({ label, zorunlu, hata, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ fontSize: 11, color: hata ? "#f06292" : "#7986a3", fontFamily: "monospace", letterSpacing: "0.5px", display: "block", marginBottom: 5 }}>
        {label} {zorunlu && <span style={{ color: "#f06292" }}>*</span>}
      </label>
      {children}
      {hata && <div style={{ fontSize: 11, color: "#f06292", marginTop: 4 }}>⚠ {hata}</div>}
    </div>
  );
}

const inputStil = (hata) => ({
  width: "100%", background: "rgba(255,255,255,0.05)", border: `1px solid ${hata ? "rgba(240,98,146,0.5)" : "rgba(255,255,255,0.1)"}`,
  borderRadius: 10, padding: "10px 12px", color: "#e8eaf0", fontSize: 13, fontFamily: "inherit",
  outline: "none", boxSizing: "border-box", lineHeight: 1.6
});

// ── Ana Uygulama ──────────────────────────────────────────────────────────────
export default function App() {
  // Nöromit state
  const [mitler, setMitler] = useState(BASLANGIC_MITLER);
  const [aktifEkran, setAktifEkran] = useState("ana");
  const [secilenMit, setSecilenMit] = useState(null);
  const [oncekiEkran, setOncekiEkran] = useState("kutuphane");
  const [kategori, setKategori] = useState("Tümü");
  const [analiz, setAnaliz] = useState({ metin: "", sonuclar: [], yapildi: false, aiSonuc: null });
  const [chatMesajlar, setChatMesajlar] = useState([
    { rol: "ai", icerik: "Merhaba! Ben NöroFen asistanınım 🧠 Ders planlarınızdaki nöromitleri tespit etmeme yardımcı olabilirim!" }
  ]);
  const [chatGirdi, setChatGirdi] = useState("");
  const [chatYukleniyor, setChatYukleniyor] = useState(false);
  const [analizYukleniyor, setAnalizYukleniyor] = useState(false);
  const [rozetler, setRozetler] = useState([]);
  const [form, setForm] = useState(BOŞ_FORM);
  const [duzenlemId, setDuzenlemId] = useState(null);
  const [formHata, setFormHata] = useState({});
  const [silOnay, setSilOnay] = useState(null);
  const [basariMesaj, setBasariMesaj] = useState("");
  const [emojiSecici, setEmojiSecici] = useState(false);
  const [akkordeon, setAkkordeon] = useState(null);
  const [adminGiris, setAdminGiris] = useState(false);
  const [adminSifreGirdi, setAdminSifreGirdi] = useState("");
  const [adminHata, setAdminHata] = useState(false);
  const ADMIN_SIFRE = "neurofen2026";
  // Araştırma state
  const [arastirmalar, setArastirmalar] = useState(BASLANGIC_ARASTIRMALAR);
  const [arastirmaForm, setArastirmaForm] = useState(BOŞ_ARASTIRMA);
  const [arastirmaFormHata, setArastirmaFormHata] = useState({});
  const [arastirmaDuzenlemId, setArastirmaDuzenlemId] = useState(null);
  const [arastirmaDetay, setArastirmaDetay] = useState(null);
  const [arasSilOnay, setArasSilOnay] = useState(null);
  const chatSonRef = useRef(null);

  useEffect(() => {
    if (chatSonRef.current) chatSonRef.current.scrollIntoView({ behavior: "smooth" });
  }, [chatMesajlar]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("admin") !== null) setAktifEkran("adminGiris");
  }, []);

  useEffect(() => {
    if (basariMesaj) { const t = setTimeout(() => setBasariMesaj(""), 3000); return () => clearTimeout(t); }
  }, [basariMesaj]);

  const kategoriler = ["Tümü", ...new Set(mitler.map(n => n.kategori))];
  const filtreliMitler = kategori === "Tümü" ? mitler : mitler.filter(m => m.kategori === kategori);
  const mevcutKategoriler = [...new Set(mitler.map(n => n.kategori))];

  // ── Nöromit işlevleri ────────────────────────────────────────────────────
  function detayGit(mit, kaynak = "kutuphane") { setSecilenMit(mit); setOncekiEkran(kaynak); setAktifEkran("detay"); }
  function formGuncelle(alan, deger) { setForm(p => ({ ...p, [alan]: deger })); if (formHata[alan]) setFormHata(p => ({ ...p, [alan]: "" })); }

  function formDogrula() {
    const h = {};
    if (!form.baslik.trim()) h.baslik = "Başlık zorunlu";
    if (!form.kategori && !form.yeniKategori.trim()) h.kategori = "Kategori seçin veya yeni girin";
    if (!form.mit.trim()) h.mit = "Mit açıklaması zorunlu";
    if (!form.bilim.trim()) h.bilim = "Bilimsel açıklama zorunlu";
    if (!form.alternatif.trim()) h.alternatif = "Alternatif strateji zorunlu";
    if (!form.anahtar_kelimeler.trim()) h.anahtar_kelimeler = "En az bir anahtar kelime girin";
    setFormHata(h); return Object.keys(h).length === 0;
  }

  function mitKaydet() {
    if (!formDogrula()) return;
    const kat = form.yeniKategori.trim() || form.kategori;
    const yeni = { id: duzenlemId || Date.now(), baslik:form.baslik.trim(), kategori:kat, emoji:form.emoji, mit:form.mit.trim(), bilim:form.bilim.trim(), fenBaglantisi:form.fenBaglantisi.trim(), alternatif:form.alternatif.trim(), kaynaklar:form.kaynaklar.split("\n").map(k=>k.trim()).filter(Boolean), anahtar_kelimeler:form.anahtar_kelimeler.split(",").map(k=>k.trim()).filter(Boolean) };
    if (duzenlemId) { setMitler(p => p.map(m => m.id === duzenlemId ? yeni : m)); setBasariMesaj("✅ Nöromit güncellendi!"); }
    else { setMitler(p => [...p, yeni]); setBasariMesaj("✅ Yeni nöromit eklendi!"); }
    setForm(BOŞ_FORM); setDuzenlemId(null); setFormHata({}); setAktifEkran("kutuphane");
  }

  function duzenlemeBaslat(mit) {
    setForm({ baslik:mit.baslik, kategori:mit.kategori, yeniKategori:"", emoji:mit.emoji, mit:mit.mit, bilim:mit.bilim, fenBaglantisi:mit.fenBaglantisi||"", alternatif:mit.alternatif, kaynaklar:mit.kaynaklar.join("\n"), anahtar_kelimeler:mit.anahtar_kelimeler.join(", ") });
    setDuzenlemId(mit.id); setFormHata({}); setAktifEkran("mitEkle");
  }

  function mitSil(id) { setMitler(p => p.filter(m => m.id !== id)); setSilOnay(null); setBasariMesaj("🗑️ Nöromit silindi."); setAktifEkran("kutuphane"); }

  // ── Araştırma işlevleri ──────────────────────────────────────────────────
  function arastirmaFormGuncelle(alan, deger) { setArastirmaForm(p => ({ ...p, [alan]: deger })); if (arastirmaFormHata[alan]) setArastirmaFormHata(p => ({ ...p, [alan]: "" })); }

  function arastirmaDogrula() {
    const h = {};
    if (!arastirmaForm.baslik.trim()) h.baslik = "Başlık zorunlu";
    if (!arastirmaForm.ozet.trim()) h.ozet = "Özet zorunlu";
    if (!arastirmaForm.kaynak.trim()) h.kaynak = "Kaynak zorunlu";
    if (!arastirmaForm.yil.trim()) h.yil = "Yıl zorunlu";
    setArastirmaFormHata(h); return Object.keys(h).length === 0;
  }

  function arastirmaKaydet() {
    if (!arastirmaDogrula()) return;
    const yeni = { id: arastirmaDuzenlemId || Date.now(), baslik:arastirmaForm.baslik.trim(), ozet:arastirmaForm.ozet.trim(), kaynak:arastirmaForm.kaynak.trim(), yil:arastirmaForm.yil.trim(), etiket:arastirmaForm.etiket.trim()||"Araştırma", renk:arastirmaForm.renk };
    if (arastirmaDuzenlemId) { setArastirmalar(p => p.map(a => a.id === arastirmaDuzenlemId ? yeni : a)); setBasariMesaj("✅ Araştırma güncellendi!"); }
    else { setArastirmalar(p => [yeni, ...p]); setBasariMesaj("✅ Yeni araştırma eklendi!"); }
    setArastirmaForm(BOŞ_ARASTIRMA); setArastirmaDuzenlemId(null); setArastirmaFormHata({}); setAktifEkran("yonetici");
  }

  function arastirmaDuzenlemeBaslat(a) {
    setArastirmaForm({ baslik:a.baslik, ozet:a.ozet, kaynak:a.kaynak, yil:a.yil, etiket:a.etiket, renk:a.renk });
    setArastirmaDuzenlemId(a.id); setArastirmaFormHata({}); setAktifEkran("arastirmaEkle");
  }

  function arastirmaSil(id) { setArastirmalar(p => p.filter(a => a.id !== id)); setArasSilOnay(null); setArastirmaDetay(null); setBasariMesaj("🗑️ Araştırma silindi."); }

  // ── Analiz ──────────────────────────────────────────────────────────────
  async function analizEt() {
    if (!analiz.metin.trim()) return;
    setAnalizYukleniyor(true);
    const yerel = tespit_et(analiz.metin, mitler);
    await new Promise(r => setTimeout(r, 600));
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:1000,
          system:`Sen fen bilimleri eğitiminde uzman bir nöromit tespit asistanısın. Türkçe yanıt ver. Yalnızca JSON döndür: {"ozet":"kısa değerlendirme","temiz":true/false}`,
          messages:[{role:"user",content:`Bu ders planını nöromit açısından değerlendir:\n\n${analiz.metin}`}] })
      });
      const veri = await res.json();
      const txt = veri.content?.map(b=>b.text||"").join("") || "";
      let aiSonuc = null;
      try { aiSonuc = JSON.parse(txt.replace(/```json|```/g,"").trim()); } catch(_) {}
      setAnaliz(p => ({ ...p, sonuclar:yerel, aiSonuc, yapildi:true }));
      if (yerel.length === 0) setRozetler(p => p.includes("temiz") ? p : [...p,"temiz"]);
    } catch(_) { setAnaliz(p => ({ ...p, sonuclar:yerel, yapildi:true })); }
    setAnalizYukleniyor(false);
  }

  async function chatGonder() {
    if (!chatGirdi.trim() || chatYukleniyor) return;
    const mesaj = chatGirdi; setChatGirdi("");
    setChatMesajlar(p => [...p,{rol:"kullanici",icerik:mesaj}]);
    setChatYukleniyor(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:1000,
          system:`Sen NöroFen uygulamasının Türkçe konuşan AI asistanısın. Fen bilimleri öğretmenlerine nöromitler konusunda yardım ediyorsun. Kısa, bilimsel yanıtlar ver.`,
          messages:[{role:"user",content:mesaj}] })
      });
      const veri = await res.json();
      const yanit = veri.content?.map(b=>b.text||"").join("") || "Üzgünüm, bir sorun oluştu.";
      setChatMesajlar(p => [...p,{rol:"ai",icerik:yanit}]);
    } catch(_) { setChatMesajlar(p => [...p,{rol:"ai",icerik:"Bağlantı sorunu. Lütfen tekrar deneyin."}]); }
    setChatYukleniyor(false);
  }

  // ── RENDER ────────────────────────────────────────────────────────────────
  const S = { // ortak stiller
    kart: { background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:13, padding:14, marginBottom:9 },
    btn: (renk) => ({ background:`rgba(${renk},0.12)`, border:`1px solid rgba(${renk},0.25)`, borderRadius:8, padding:"6px 12px", fontSize:12, cursor:"pointer" }),
  };

  return (
    <div style={{ fontFamily:"'Georgia',serif", background:"#0a0e1a", minHeight:"100vh", color:"#e8eaf0", maxWidth:430, margin:"0 auto", position:"relative" }}>
      <div style={{ position:"fixed", inset:0, background:"radial-gradient(ellipse at 20% 20%,rgba(99,179,237,0.07) 0%,transparent 50%),radial-gradient(ellipse at 80% 80%,rgba(154,117,241,0.07) 0%,transparent 50%)", pointerEvents:"none", zIndex:0 }} />

      {/* Toast */}
      {basariMesaj && (
        <div style={{ position:"fixed", top:20, left:"50%", transform:"translateX(-50%)", background:"rgba(30,40,60,0.98)", border:"1px solid rgba(79,195,247,0.4)", borderRadius:12, padding:"10px 20px", fontSize:13, color:"#4fc3f7", zIndex:9999, whiteSpace:"nowrap", boxShadow:"0 8px 32px rgba(0,0,0,0.4)" }}>
          {basariMesaj}
        </div>
      )}

      {/* Silme Modal - Nöromit */}
      {silOnay && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.7)", zIndex:9000, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
          <div style={{ background:"#141826", border:"1px solid rgba(240,98,146,0.3)", borderRadius:16, padding:24, maxWidth:300, width:"100%" }}>
            <div style={{ fontSize:26, textAlign:"center", marginBottom:10 }}>🗑️</div>
            <div style={{ fontSize:14, fontWeight:600, color:"#fff", textAlign:"center", marginBottom:6 }}>Nöromiti Sil</div>
            <div style={{ fontSize:12, color:"#9aa5be", textAlign:"center", marginBottom:18 }}><strong style={{color:"#f06292"}}>{mitler.find(m=>m.id===silOnay)?.baslik}</strong> silinecek.</div>
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={()=>setSilOnay(null)} style={{ flex:1, background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:10, padding:"9px", color:"#9aa5be", fontSize:13, cursor:"pointer" }}>İptal</button>
              <button onClick={()=>mitSil(silOnay)} style={{ flex:1, background:"rgba(240,98,146,0.18)", border:"1px solid rgba(240,98,146,0.35)", borderRadius:10, padding:"9px", color:"#f06292", fontSize:13, cursor:"pointer", fontWeight:600 }}>Evet, Sil</button>
            </div>
          </div>
        </div>
      )}

      {/* Silme Modal - Araştırma */}
      {arasSilOnay && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.7)", zIndex:9000, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
          <div style={{ background:"#141826", border:"1px solid rgba(240,98,146,0.3)", borderRadius:16, padding:24, maxWidth:300, width:"100%" }}>
            <div style={{ fontSize:26, textAlign:"center", marginBottom:10 }}>🗑️</div>
            <div style={{ fontSize:14, fontWeight:600, color:"#fff", textAlign:"center", marginBottom:6 }}>Araştırmayı Sil</div>
            <div style={{ fontSize:12, color:"#9aa5be", textAlign:"center", marginBottom:18 }}><strong style={{color:"#f06292"}}>{arastirmalar.find(a=>a.id===arasSilOnay)?.baslik}</strong> silinecek.</div>
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={()=>setArasSilOnay(null)} style={{ flex:1, background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:10, padding:"9px", color:"#9aa5be", fontSize:13, cursor:"pointer" }}>İptal</button>
              <button onClick={()=>arastirmaSil(arasSilOnay)} style={{ flex:1, background:"rgba(240,98,146,0.18)", border:"1px solid rgba(240,98,146,0.35)", borderRadius:10, padding:"9px", color:"#f06292", fontSize:13, cursor:"pointer", fontWeight:600 }}>Evet, Sil</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ position:"relative", zIndex:1, paddingBottom:80 }}>

        {/* HEADER */}
        <div style={{ padding:"18px 20px 14px", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <img src="/logo.png" alt="NöroFen Logo" style={{ width:42, height:42, borderRadius:10, objectFit:"cover" }}/>
            <div>
              <div style={{ fontSize:19, fontWeight:700, color:"#fff", letterSpacing:"-0.5px" }}>NöroFen</div>
              <div style={{ fontSize:10, color:"#7986a3", fontFamily:"monospace" }}>Nöromitten Arın · Bilimle Öğret</div>
            </div>
            <div style={{ marginLeft:"auto", fontSize:11, color:"#7986a3", fontFamily:"monospace" }}>{mitler.length} mit</div>
          </div>
        </div>

        {/* ── ANA SAYFA ──────────────────────────────────────────────── */}
        {aktifEkran === "ana" && (
          <div style={{ padding:"18px 16px" }}>
            {/* Günün mitosu */}
            <div style={{ background:"linear-gradient(135deg,rgba(79,195,247,0.1),rgba(156,100,240,0.1))", border:"1px solid rgba(79,195,247,0.18)", borderRadius:16, padding:18, marginBottom:16 }}>
              <div style={{ fontSize:10, color:"#4fc3f7", fontFamily:"monospace", letterSpacing:"1px", marginBottom:6 }}>✦ GÜNÜN NÖROMİTİ</div>
              <div style={{ fontSize:15, fontWeight:600, color:"#fff", marginBottom:6 }}>{mitler[0]?.emoji} {mitler[0]?.baslik}</div>
              <div style={{ fontSize:12, color:"#9aa5be", lineHeight:1.6 }}>{mitler[0]?.mit.substring(0,100)}...</div>
              <button onClick={()=>detayGit(mitler[0],"ana")} style={{ marginTop:10, background:"rgba(79,195,247,0.12)", border:"1px solid rgba(79,195,247,0.25)", color:"#4fc3f7", borderRadius:8, padding:"6px 14px", fontSize:11, cursor:"pointer", fontFamily:"monospace" }}>Detayları Gör →</button>
            </div>

            {/* Son araştırma önizleme */}
            {arastirmalar.length > 0 && (
              <div onClick={()=>setAktifEkran("arastirmalar")} style={{ background:`linear-gradient(135deg,${arastirmalar[0].renk}18,rgba(255,255,255,0.02))`, border:`1px solid ${arastirmalar[0].renk}30`, borderRadius:14, padding:14, marginBottom:16, cursor:"pointer" }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                  <span style={{ fontSize:10, color:arastirmalar[0].renk, fontFamily:"monospace", letterSpacing:"1px" }}>🔬 GÜNCEL ARAŞTIRMA</span>
                  <span style={{ marginLeft:"auto", background:`${arastirmalar[0].renk}22`, color:arastirmalar[0].renk, borderRadius:6, padding:"2px 8px", fontSize:10, fontFamily:"monospace" }}>{arastirmalar[0].yil}</span>
                </div>
                <div style={{ fontSize:13, fontWeight:600, color:"#fff", marginBottom:4 }}>{arastirmalar[0].baslik}</div>
                <div style={{ fontSize:12, color:"#9aa5be", lineHeight:1.5 }}>{arastirmalar[0].ozet.substring(0,90)}...</div>
                <div style={{ fontSize:11, color:arastirmalar[0].renk, marginTop:8, fontFamily:"monospace" }}>Tüm araştırmaları gör ({arastirmalar.length}) →</div>
              </div>
            )}

            {/* Hızlı erişim */}
            <div style={{ fontSize:10, color:"#7986a3", fontFamily:"monospace", letterSpacing:"1px", marginBottom:10 }}>HIZLI ERİŞİM</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:16 }}>
              {[
                {ikon:"🔍",baslik:"Metin Analizi",alt:"Ders planını tara",ekran:"analiz"},
                {ikon:"📚",baslik:"Kütüphane",alt:`${mitler.length} nöromit`,ekran:"kutuphane"},
                {ikon:"🔬",baslik:"Araştırmalar",alt:`${arastirmalar.length} güncel çalışma`,ekran:"arastirmalar"},
                {ikon:"💬",baslik:"AI Asistan",alt:"Soru sor",ekran:"chat"},
              ].map(k => (
                <button key={k.ekran} onClick={()=>setAktifEkran(k.ekran)}
                  style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:13, padding:"13px 11px", textAlign:"left", cursor:"pointer" }}>
                  <div style={{ fontSize:22, marginBottom:5 }}>{k.ikon}</div>
                  <div style={{ fontSize:13, fontWeight:600, color:"#fff", marginBottom:2 }}>{k.baslik}</div>
                  <div style={{ fontSize:11, color:"#7986a3" }}>{k.alt}</div>
                </button>
              ))}
            </div>

            {/* ── HAKKINDA ACCORDION ── */}
            <div style={{ marginBottom:16 }}>
              <button onClick={()=>setAkkordeon(akkordeon?"":"acik")}
                style={{ width:"100%", background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:13, padding:"13px 16px", display:"flex", alignItems:"center", cursor:"pointer" }}>
                <span style={{ fontSize:16, marginRight:8 }}>ℹ️</span>
                <span style={{ fontSize:13, fontWeight:600, color:"#fff", flex:1, textAlign:"left" }}>Uygulama Hakkında</span>
                <span style={{ color:"#7986a3", fontSize:14, transition:"transform 0.3s", transform:akkordeon?"rotate(180deg)":"rotate(0deg)" }}>▾</span>
              </button>

              {akkordeon && (
                <div style={{ marginTop:8, display:"flex", flexDirection:"column", gap:8 }}>

                  {/* Vizyon */}
                  {[
                    { id:"vizyon", ikon:"🧠", baslik:"Amaç & Vizyon", renk:"#4fc3f7",
                      icerik: <div style={{ fontSize:12, color:"#9aa5be", lineHeight:1.7, borderLeft:"2px solid rgba(79,195,247,0.3)", paddingLeft:10 }}>NöroFen, fen bilimleri öğretmenlerinin ders planlarında farkında olmadan kullandığı nörobilimsel mitleri tespit etmek ve bilimsel alternatifler sunmak amacıyla geliştirilmiş AI destekli bir rehber uygulamadır.<br/><br/><span style={{color:"#4fc3f7",fontFamily:"monospace",fontSize:10}}>v1.0.0 · Mart 2026</span></div>
                    },
                    { id:"gelistirici", ikon:"👤", baslik:"Geliştirici / Akademisyen", renk:"#9c64f0",
                      icerik: <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                        <div style={{ width:44, height:44, borderRadius:"50%", background:"linear-gradient(135deg,#9c64f0,#f06292)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>🎓</div>
                        <div>
                          <div style={{ fontSize:13, fontWeight:600, color:"#fff" }}>Mustafa Yapayzeka</div>
                          <div style={{ fontSize:11, color:"#9aa5be", marginTop:2 }}>Fen Bilimleri Eğitimi Araştırmacısı</div>
                          <div style={{ fontSize:11, color:"#7986a3", marginTop:2, fontFamily:"monospace" }}>Nöroeğitim · Öğretmen Eğitimi</div>
                        </div>
                      </div>
                    },
                    { id:"kilavuz", ikon:"📖", baslik:"Nasıl Kullanılır?", renk:"#66bb6a",
                      icerik: <div>{[
                        {no:"1",ikon:"🔍",baslik:"Metin Analizi",aciklama:"Ders planınızı yapıştırın, AI nöromitleri tespit etsin."},
                        {no:"2",ikon:"📚",baslik:"Kütüphane",aciklama:"Nöromitleri inceleyin, bilimsel alternatifleri öğrenin."},
                        {no:"3",ikon:"🔬",baslik:"Araştırmalar",aciklama:"Güncel çalışma bulgularını takip edin."},
                        {no:"4",ikon:"💬",baslik:"AI Asistan",aciklama:"Aklınıza takılan soruları AI'a sorun."},
                      ].map(a => (
                        <div key={a.no} style={{ display:"flex", gap:10, marginBottom:8, alignItems:"flex-start" }}>
                          <div style={{ width:20, height:20, borderRadius:"50%", background:"rgba(102,187,106,0.15)", border:"1px solid rgba(102,187,106,0.3)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, color:"#66bb6a", fontFamily:"monospace", flexShrink:0, marginTop:1 }}>{a.no}</div>
                          <div>
                            <div style={{ fontSize:12, fontWeight:600, color:"#fff" }}>{a.ikon} {a.baslik}</div>
                            <div style={{ fontSize:11, color:"#9aa5be", lineHeight:1.5, marginTop:1 }}>{a.aciklama}</div>
                          </div>
                        </div>
                      ))}</div>
                    },
                    { id:"versiyon", ikon:"🕐", baslik:"Versiyon Geçmişi", renk:"#ffb74d",
                      icerik: <div style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
                        <span style={{ background:"rgba(255,183,77,0.15)", color:"#ffb74d", borderRadius:6, padding:"2px 8px", fontSize:10, fontFamily:"monospace", flexShrink:0 }}>v1.0.0</span>
                        <div>
                          <div style={{ fontSize:11, color:"#7986a3", fontFamily:"monospace" }}>Mart 2026</div>
                          <div style={{ fontSize:12, color:"#c5cee0", marginTop:2 }}>İlk yayın — 6 nöromit, AI analiz, araştırma modülü</div>
                        </div>
                      </div>
                    },
                    { id:"iletisim", ikon:"✉️", baslik:"İletişim & Geri Bildirim", renk:"#f06292",
                      icerik: <div>
                        <div style={{ fontSize:12, color:"#9aa5be", lineHeight:1.6, marginBottom:10 }}>Öneri, hata bildirimi veya iş birliği için iletişime geçebilirsiniz.</div>
                        {[{ikon:"📧",etiket:"E-posta",deger:"iletisim@neurofen.app"},{ikon:"🌐",etiket:"Web",deger:"neurofen.vercel.app"}].map(k=>(
                          <div key={k.etiket} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:5 }}>
                            <span style={{ fontSize:13 }}>{k.ikon}</span>
                            <span style={{ fontSize:11, color:"#7986a3", width:52 }}>{k.etiket}:</span>
                            <span style={{ fontSize:12, color:"#4fc3f7", fontFamily:"monospace" }}>{k.deger}</span>
                          </div>
                        ))}
                      </div>
                    },
                  ].map(b => (
                    <div key={b.id} style={{ background:"rgba(255,255,255,0.02)", border:`1px solid ${b.renk}22`, borderLeft:`3px solid ${b.renk}55`, borderRadius:12, overflow:"hidden" }}>
                      <button onClick={()=>setAkkordeon(akkordeon===b.id?null:b.id)}
                        style={{ width:"100%", background:"none", border:"none", padding:"11px 14px", display:"flex", alignItems:"center", gap:8, cursor:"pointer" }}>
                        <span style={{ fontSize:14 }}>{b.ikon}</span>
                        <span style={{ fontSize:12, fontWeight:600, color:"#fff", flex:1, textAlign:"left" }}>{b.baslik}</span>
                        <span style={{ color:b.renk, fontSize:12, transition:"transform 0.2s", transform:akkordeon===b.id?"rotate(180deg)":"rotate(0deg)" }}>▾</span>
                      </button>
                      {akkordeon === b.id && (
                        <div style={{ padding:"0 14px 13px" }}>{b.icerik}</div>
                      )}
                    </div>
                  ))}

                  <div style={{ textAlign:"center", padding:"8px 0 4px" }}>
                    <div style={{ fontSize:10, color:"#4a5568", fontFamily:"monospace" }}>© 2026 NöroFen · Tüm hakları saklıdır</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── GÜNCEL ARAŞTIRMALAR (kullanıcı görünümü) ───────────────── */}
        {aktifEkran === "arastirmalar" && (
          <div style={{ padding:"18px 16px" }}>
            <div style={{ fontSize:17, fontWeight:700, color:"#fff", marginBottom:4 }}>🔬 Güncel Araştırmalar</div>
            <div style={{ fontSize:12, color:"#7986a3", marginBottom:18 }}>Nöroeğitim alanındaki son çalışmalar</div>

            {arastirmalar.length === 0 ? (
              <div style={{ textAlign:"center", padding:"40px 20px", color:"#7986a3" }}>
                <div style={{ fontSize:32, marginBottom:12 }}>🔬</div>
                <div style={{ fontSize:14 }}>Henüz araştırma eklenmemiş.</div>
              </div>
            ) : (
              arastirmalar.map(a => (
                <button key={a.id} onClick={()=>setArastirmaDetay(a)}
                  style={{ width:"100%", ...S.kart, textAlign:"left", cursor:"pointer", borderLeft:`3px solid ${a.renk}`, display:"block" }}>
                  <div style={{ display:"flex", alignItems:"flex-start", gap:10, marginBottom:8 }}>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:13, fontWeight:600, color:"#fff", marginBottom:4, lineHeight:1.4 }}>{a.baslik}</div>
                      <div style={{ display:"flex", gap:6 }}>
                        <span style={{ background:`${a.renk}20`, color:a.renk, borderRadius:6, padding:"2px 8px", fontSize:10, fontFamily:"monospace" }}>{a.yil}</span>
                        {a.etiket && <span style={{ background:"rgba(255,255,255,0.06)", color:"#9aa5be", borderRadius:6, padding:"2px 8px", fontSize:10, fontFamily:"monospace" }}>{a.etiket}</span>}
                      </div>
                    </div>
                    <span style={{ color:a.renk, fontSize:16, marginTop:2 }}>›</span>
                  </div>
                  <div style={{ fontSize:12, color:"#9aa5be", lineHeight:1.6 }}>{a.ozet.substring(0,110)}{a.ozet.length>110?"...":""}</div>
                </button>
              ))
            )}

            {/* Araştırma detay popup */}
            {arastirmaDetay && (
              <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.75)", zIndex:8000, display:"flex", alignItems:"flex-end", justifyContent:"center" }} onClick={()=>setArastirmaDetay(null)}>
                <div style={{ background:"#141826", border:`1px solid ${arastirmaDetay.renk}40`, borderRadius:"20px 20px 0 0", padding:24, width:"100%", maxWidth:430, maxHeight:"80vh", overflowY:"auto" }} onClick={e=>e.stopPropagation()}>
                  <div style={{ width:40, height:4, background:"rgba(255,255,255,0.15)", borderRadius:2, margin:"0 auto 20px" }} />
                  <div style={{ display:"flex", gap:8, marginBottom:12 }}>
                    <span style={{ background:`${arastirmaDetay.renk}22`, color:arastirmaDetay.renk, borderRadius:6, padding:"3px 10px", fontSize:11, fontFamily:"monospace" }}>{arastirmaDetay.yil}</span>
                    {arastirmaDetay.etiket && <span style={{ background:"rgba(255,255,255,0.06)", color:"#9aa5be", borderRadius:6, padding:"3px 10px", fontSize:11, fontFamily:"monospace" }}>{arastirmaDetay.etiket}</span>}
                  </div>
                  <div style={{ fontSize:16, fontWeight:700, color:"#fff", marginBottom:14, lineHeight:1.4 }}>{arastirmaDetay.baslik}</div>
                  <div style={{ background:`${arastirmaDetay.renk}12`, borderLeft:`3px solid ${arastirmaDetay.renk}`, borderRadius:10, padding:14, marginBottom:14 }}>
                    <div style={{ fontSize:10, color:arastirmaDetay.renk, fontFamily:"monospace", letterSpacing:"0.5px", marginBottom:6 }}>ARAŞTIRMA ÖZETİ</div>
                    <div style={{ fontSize:13, color:"#c5cee0", lineHeight:1.7 }}>{arastirmaDetay.ozet}</div>
                  </div>
                  <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:10, padding:12 }}>
                    <div style={{ fontSize:10, color:"#7986a3", fontFamily:"monospace", marginBottom:6 }}>📖 KAYNAK</div>
                    <div style={{ fontSize:12, color:"#9aa5be", lineHeight:1.6, fontStyle:"italic" }}>{arastirmaDetay.kaynak}</div>
                  </div>
                  <button onClick={()=>setArastirmaDetay(null)} style={{ width:"100%", marginTop:16, background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:10, padding:"11px", color:"#9aa5be", fontSize:13, cursor:"pointer" }}>Kapat</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── ANALİZ ─────────────────────────────────────────────────── */}
        {aktifEkran === "analiz" && (
          <div style={{ padding:"18px 16px" }}>
            <div style={{ fontSize:17, fontWeight:700, color:"#fff", marginBottom:4 }}>🔍 Metin Analizi</div>
            <div style={{ fontSize:12, color:"#7986a3", marginBottom:14 }}>Ders planınızı yapıştırın, AI nöromitleri tespit etsin</div>
            <textarea value={analiz.metin} onChange={e=>setAnaliz({metin:e.target.value,sonuclar:[],yapildi:false,aiSonuc:null})}
              placeholder="Ders planınızı buraya yazın veya yapıştırın..."
              style={{...inputStil(false), minHeight:130, resize:"vertical"}} />
            <button onClick={analizEt} disabled={analizYukleniyor||!analiz.metin.trim()}
              style={{ width:"100%", marginTop:10, background:analizYukleniyor?"rgba(79,195,247,0.25)":"linear-gradient(135deg,#4fc3f7,#9c64f0)", border:"none", borderRadius:11, padding:"13px", color:"#fff", fontSize:13, fontWeight:600, cursor:analizYukleniyor?"not-allowed":"pointer" }}>
              {analizYukleniyor?"⏳ Analiz ediliyor...":"✦ Analiz Et"}
            </button>
            {analiz.yapildi && (
              <div style={{ marginTop:18 }}>
                {analiz.sonuclar.length === 0 ? (
                  <div style={{ background:"rgba(102,187,106,0.08)", border:"1px solid rgba(102,187,106,0.25)", borderRadius:12, padding:16, textAlign:"center" }}>
                    <div style={{ fontSize:26, marginBottom:6 }}>✅</div>
                    <div style={{ color:"#66bb6a", fontWeight:600 }}>Nöromit tespit edilmedi!</div>
                    <div style={{ fontSize:12, color:"#7986a3", marginTop:4 }}>Ders planınız bilimsel görünüyor.</div>
                  </div>
                ) : (
                  <>
                    <div style={{ background:"rgba(240,98,146,0.08)", border:"1px solid rgba(240,98,146,0.25)", borderRadius:12, padding:13, marginBottom:10 }}>
                      <div style={{ color:"#f06292", fontWeight:600, fontSize:13, marginBottom:4 }}>⚠️ {analiz.sonuclar.length} nöromit tespit edildi</div>
                      {analiz.aiSonuc?.ozet && <div style={{ fontSize:12, color:"#9aa5be", lineHeight:1.6 }}>{analiz.aiSonuc.ozet}</div>}
                    </div>
                    {analiz.sonuclar.map(mit => (
                      <div key={mit.id} style={{ ...S.kart, borderLeft:"3px solid rgba(240,98,146,0.5)" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:7 }}>
                          <span style={{ fontSize:18 }}>{mit.emoji}</span>
                          <span style={{ fontWeight:600, color:"#fff", fontSize:13 }}>{mit.baslik}</span>
                        </div>
                        <div style={{ fontSize:12, color:"#66bb6a", lineHeight:1.5, marginBottom:7 }}>✅ {mit.alternatif}</div>
                        <button onClick={()=>detayGit(mit,"analiz")} style={{ background:"rgba(79,195,247,0.08)", border:"1px solid rgba(79,195,247,0.18)", color:"#4fc3f7", borderRadius:7, padding:"5px 11px", fontSize:11, cursor:"pointer", fontFamily:"monospace" }}>Detaylı İncele →</button>
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── KÜTÜPHANE ──────────────────────────────────────────────── */}
        {aktifEkran === "kutuphane" && (
          <div style={{ padding:"18px 16px" }}>
            <div style={{ display:"flex", alignItems:"center", marginBottom:4 }}>
              <div style={{ fontSize:17, fontWeight:700, color:"#fff" }}>📚 Nöromit Kütüphanesi</div>
              <button onClick={()=>{setForm(BOŞ_FORM);setDuzenlemId(null);setFormHata({});setAktifEkran("mitEkle");}}
                style={{ marginLeft:"auto", background:"rgba(79,195,247,0.12)", border:"1px solid rgba(79,195,247,0.25)", color:"#4fc3f7", borderRadius:8, padding:"6px 12px", fontSize:12, cursor:"pointer", fontWeight:600 }}>+ Yeni Mit</button>
            </div>
            <div style={{ fontSize:12, color:"#7986a3", marginBottom:12 }}>{mitler.length} nöromit · {new Set(mitler.map(m=>m.kategori)).size} kategori</div>
            <div style={{ display:"flex", gap:7, overflowX:"auto", paddingBottom:8, marginBottom:12 }}>
              {kategoriler.map(k => (
                <button key={k} onClick={()=>setKategori(k)} style={{ whiteSpace:"nowrap", padding:"5px 12px", borderRadius:18, border:"1px solid", borderColor:kategori===k?"#4fc3f7":"rgba(255,255,255,0.1)", background:kategori===k?"rgba(79,195,247,0.12)":"transparent", color:kategori===k?"#4fc3f7":"#7986a3", fontSize:11, cursor:"pointer" }}>{k}</button>
              ))}
            </div>
            {filtreliMitler.map(mit => (
              <div key={mit.id} style={{ ...S.kart, display:"flex", alignItems:"center", gap:10 }}>
                <button onClick={()=>detayGit(mit,"kutuphane")} style={{ flex:1, background:"none", border:"none", textAlign:"left", cursor:"pointer", padding:0, display:"flex", alignItems:"center", gap:10 }}>
                  <span style={{ fontSize:20 }}>{mit.emoji}</span>
                  <div>
                    <div style={{ fontWeight:600, color:"#fff", fontSize:13 }}>{mit.baslik}</div>
                    <div style={{ fontSize:10, color:"#7986a3", fontFamily:"monospace", marginTop:2 }}>{mit.kategori}</div>
                  </div>
                </button>
                <div style={{ display:"flex", gap:6, flexShrink:0 }}>
                  <button onClick={()=>duzenlemeBaslat(mit)} style={{ background:"rgba(79,195,247,0.1)", border:"1px solid rgba(79,195,247,0.2)", color:"#4fc3f7", borderRadius:7, padding:"5px 9px", fontSize:12, cursor:"pointer" }}>✏️</button>
                  <button onClick={()=>setSilOnay(mit.id)} style={{ background:"rgba(240,98,146,0.1)", border:"1px solid rgba(240,98,146,0.2)", color:"#f06292", borderRadius:7, padding:"5px 9px", fontSize:12, cursor:"pointer" }}>🗑️</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── DETAY ──────────────────────────────────────────────────── */}
        {aktifEkran === "detay" && secilenMit && (
          <div style={{ padding:"18px 16px" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
              <button onClick={()=>setAktifEkran(oncekiEkran)} style={{ background:"none", border:"none", color:"#4fc3f7", cursor:"pointer", fontSize:12, padding:0, fontFamily:"monospace" }}>← Geri</button>
              <div style={{ marginLeft:"auto", display:"flex", gap:8 }}>
                <button onClick={()=>duzenlemeBaslat(secilenMit)} style={{ background:"rgba(79,195,247,0.1)", border:"1px solid rgba(79,195,247,0.2)", color:"#4fc3f7", borderRadius:7, padding:"5px 10px", fontSize:11, cursor:"pointer" }}>✏️ Düzenle</button>
                <button onClick={()=>setSilOnay(secilenMit.id)} style={{ background:"rgba(240,98,146,0.1)", border:"1px solid rgba(240,98,146,0.2)", color:"#f06292", borderRadius:7, padding:"5px 10px", fontSize:11, cursor:"pointer" }}>🗑️ Sil</button>
              </div>
            </div>
            <div style={{ fontSize:28, marginBottom:4 }}>{secilenMit.emoji}</div>
            <div style={{ fontSize:19, fontWeight:700, color:"#fff", marginBottom:4 }}>{secilenMit.baslik}</div>
            <div style={{ fontSize:10, color:"#7986a3", fontFamily:"monospace", marginBottom:18 }}>{secilenMit.kategori}</div>
            {[
              {renk:"#f06292",baslik:"🔴 NÖROMİT NEDİR?",icerik:secilenMit.mit},
              {renk:"#4fc3f7",baslik:"🔵 BİLİM NE DİYOR?",icerik:secilenMit.bilim},
              secilenMit.fenBaglantisi&&{renk:"#9c64f0",baslik:"🟣 FEN DERSİNDEKİ YANSIMASI",icerik:secilenMit.fenBaglantisi},
              {renk:"#66bb6a",baslik:"🟢 DOĞRU ALTERNATİF STRATEJİ",icerik:secilenMit.alternatif},
            ].filter(Boolean).map(b => (
              <div key={b.baslik} style={{ background:"rgba(255,255,255,0.02)", borderLeft:`3px solid ${b.renk}`, borderRadius:10, padding:13, marginBottom:10 }}>
                <div style={{ fontSize:10, color:b.renk, fontFamily:"monospace", letterSpacing:"0.5px", marginBottom:6 }}>{b.baslik}</div>
                <div style={{ fontSize:13, color:"#c5cee0", lineHeight:1.7 }}>{b.icerik}</div>
              </div>
            ))}
            {secilenMit.kaynaklar.length > 0 && (
              <div style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.05)", borderRadius:10, padding:13 }}>
                <div style={{ fontSize:10, color:"#7986a3", fontFamily:"monospace", marginBottom:8 }}>📖 BİLİMSEL KAYNAKLAR</div>
                {secilenMit.kaynaklar.map((k,i) => <div key={i} style={{ fontSize:12, color:"#9aa5be", lineHeight:1.6, paddingLeft:8, borderLeft:"1px solid rgba(255,255,255,0.08)", marginBottom:5 }}>{k}</div>)}
              </div>
            )}
          </div>
        )}

        {/* ── NÖROMİT EKLE/DÜZENLE ───────────────────────────────────── */}
        {aktifEkran === "mitEkle" && (
          <div style={{ padding:"18px 16px" }}>
            <div style={{ display:"flex", alignItems:"center", marginBottom:18 }}>
              <button onClick={()=>{setAktifEkran("kutuphane");setForm(BOŞ_FORM);setDuzenlemId(null);setFormHata({});}} style={{ background:"none", border:"none", color:"#4fc3f7", cursor:"pointer", fontSize:12, padding:0, fontFamily:"monospace" }}>← İptal</button>
              <div style={{ fontSize:15, fontWeight:700, color:"#fff", marginLeft:12 }}>{duzenlemId?"✏️ Nöromiti Düzenle":"➕ Yeni Nöromit Ekle"}</div>
            </div>
            <Alan label="EMOJİ">
              <button onClick={()=>setEmojiSecici(!emojiSecici)} style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:10, padding:"8px 16px", fontSize:22, cursor:"pointer" }}>{form.emoji}</button>
              {emojiSecici && (
                <div style={{ background:"#141826", border:"1px solid rgba(255,255,255,0.1)", borderRadius:12, padding:10, marginTop:8, display:"flex", flexWrap:"wrap", gap:4 }}>
                  {EMOJILER.map(e => <button key={e} onClick={()=>{formGuncelle("emoji",e);setEmojiSecici(false);}} style={{ background:form.emoji===e?"rgba(79,195,247,0.2)":"transparent", border:"none", borderRadius:8, padding:"6px 8px", fontSize:20, cursor:"pointer" }}>{e}</button>)}
                </div>
              )}
            </Alan>
            <Alan label="NÖROMİT BAŞLIĞI" zorunlu hata={formHata.baslik}>
              <input value={form.baslik} onChange={e=>formGuncelle("baslik",e.target.value)} placeholder="Örn: %10 Beyin Teorisi" style={inputStil(formHata.baslik)} />
            </Alan>
            <Alan label="KATEGORİ" zorunlu hata={formHata.kategori}>
              <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:8 }}>
                {mevcutKategoriler.map(k => (
                  <button key={k} onClick={()=>{formGuncelle("kategori",k);formGuncelle("yeniKategori","");}} style={{ padding:"5px 11px", borderRadius:16, border:"1px solid", borderColor:form.kategori===k&&!form.yeniKategori?"#4fc3f7":"rgba(255,255,255,0.1)", background:form.kategori===k&&!form.yeniKategori?"rgba(79,195,247,0.15)":"transparent", color:form.kategori===k&&!form.yeniKategori?"#4fc3f7":"#9aa5be", fontSize:12, cursor:"pointer" }}>{k}</button>
                ))}
              </div>
              <input value={form.yeniKategori} onChange={e=>{formGuncelle("yeniKategori",e.target.value);if(e.target.value)formGuncelle("kategori","");}} placeholder="Yeni kategori yaz (isteğe bağlı)" style={inputStil(formHata.kategori&&!form.kategori&&!form.yeniKategori)} />
            </Alan>
            <Alan label="NÖROMİT NE İDDİA EDİYOR?" zorunlu hata={formHata.mit}>
              <textarea value={form.mit} onChange={e=>formGuncelle("mit",e.target.value)} placeholder="Bu nöromit ne iddia ediyor?" style={{...inputStil(formHata.mit),minHeight:75,resize:"vertical"}} />
            </Alan>
            <Alan label="BİLİM NE DİYOR?" zorunlu hata={formHata.bilim}>
              <textarea value={form.bilim} onChange={e=>formGuncelle("bilim",e.target.value)} placeholder="Araştırmalar ne gösteriyor?" style={{...inputStil(formHata.bilim),minHeight:75,resize:"vertical"}} />
            </Alan>
            <Alan label="FEN DERSİNDE NASIL KARŞIMIZA ÇIKAR?">
              <textarea value={form.fenBaglantisi} onChange={e=>formGuncelle("fenBaglantisi",e.target.value)} placeholder="Bu mit fen derslerinde nasıl kullanılıyor?" style={{...inputStil(false),minHeight:65,resize:"vertical"}} />
            </Alan>
            <Alan label="DOĞRU ALTERNATİF STRATEJİ" zorunlu hata={formHata.alternatif}>
              <textarea value={form.alternatif} onChange={e=>formGuncelle("alternatif",e.target.value)} placeholder="Bunun yerine ne yapılmalı?" style={{...inputStil(formHata.alternatif),minHeight:65,resize:"vertical"}} />
            </Alan>
            <Alan label="BİLİMSEL KAYNAKLAR (her satıra bir kaynak)">
              <textarea value={form.kaynaklar} onChange={e=>formGuncelle("kaynaklar",e.target.value)} placeholder={"Yazar (Yıl). Makale adı. Dergi.\nYazar2 (Yıl). Kitap adı."} style={{...inputStil(false),minHeight:65,resize:"vertical",fontFamily:"monospace",fontSize:12}} />
            </Alan>
            <Alan label="ANAHTAR KELİMELER (virgülle ayırın)" zorunlu hata={formHata.anahtar_kelimeler}>
              <input value={form.anahtar_kelimeler} onChange={e=>formGuncelle("anahtar_kelimeler",e.target.value)} placeholder="görsel öğrenci, işitsel öğrenci, öğrenme stili" style={inputStil(formHata.anahtar_kelimeler)} />
              <div style={{ fontSize:11, color:"#7986a3", marginTop:4 }}>Bu kelimeler ders planı analizinde kullanılır</div>
            </Alan>
            <button onClick={mitKaydet} style={{ width:"100%", marginTop:8, background:"linear-gradient(135deg,#4fc3f7,#9c64f0)", border:"none", borderRadius:12, padding:"14px", color:"#fff", fontSize:14, fontWeight:700, cursor:"pointer" }}>
              {duzenlemId?"✅ Güncelle":"✅ Kütüphaneye Ekle"}
            </button>
          </div>
        )}

        {/* ── ARAŞTIRMA EKLE/DÜZENLE (sadece yönetici) ───────────────── */}
        {aktifEkran === "arastirmaEkle" && (
          <div style={{ padding:"18px 16px" }}>
            <div style={{ display:"flex", alignItems:"center", marginBottom:18 }}>
              <button onClick={()=>{setAktifEkran("yonetici");setArastirmaForm(BOŞ_ARASTIRMA);setArastirmaDuzenlemId(null);setArastirmaFormHata({});}} style={{ background:"none", border:"none", color:"#4fc3f7", cursor:"pointer", fontSize:12, padding:0, fontFamily:"monospace" }}>← İptal</button>
              <div style={{ fontSize:15, fontWeight:700, color:"#fff", marginLeft:12 }}>{arastirmaDuzenlemId?"✏️ Araştırmayı Düzenle":"🔬 Yeni Araştırma Ekle"}</div>
            </div>

            <Alan label="ARAŞTIRMA BAŞLIĞI" zorunlu hata={arastirmaFormHata.baslik}>
              <input value={arastirmaForm.baslik} onChange={e=>arastirmaFormGuncelle("baslik",e.target.value)} placeholder="Örn: Türk Fen Öğretmenlerinde Nöromit Yaygınlığı" style={inputStil(arastirmaFormHata.baslik)} />
            </Alan>

            <Alan label="ARAŞTIRMA ÖZETİ" zorunlu hata={arastirmaFormHata.ozet}>
              <textarea value={arastirmaForm.ozet} onChange={e=>arastirmaFormGuncelle("ozet",e.target.value)} placeholder="Araştırmanın temel bulguları ve önemi..." style={{...inputStil(arastirmaFormHata.ozet),minHeight:100,resize:"vertical"}} />
            </Alan>

            <Alan label="KAYNAK (APA formatı)" zorunlu hata={arastirmaFormHata.kaynak}>
              <input value={arastirmaForm.kaynak} onChange={e=>arastirmaFormGuncelle("kaynak",e.target.value)} placeholder="Yazar, A. (2024). Makale adı. Dergi, cilt(sayı), sayfalar." style={inputStil(arastirmaFormHata.kaynak)} />
            </Alan>

            <div style={{ display:"flex", gap:10 }}>
              <div style={{ flex:1 }}>
                <Alan label="YIL" zorunlu hata={arastirmaFormHata.yil}>
                  <input value={arastirmaForm.yil} onChange={e=>arastirmaFormGuncelle("yil",e.target.value)} placeholder="2024" style={inputStil(arastirmaFormHata.yil)} />
                </Alan>
              </div>
              <div style={{ flex:1 }}>
                <Alan label="ETİKET">
                  <input value={arastirmaForm.etiket} onChange={e=>arastirmaFormGuncelle("etiket",e.target.value)} placeholder="Türkiye / Meta-Analiz / RKÇ" style={inputStil(false)} />
                </Alan>
              </div>
            </div>

            <Alan label="RENK ETİKETİ">
              <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                {ARASTIRMA_RENKLERI.map(r => (
                  <button key={r} onClick={()=>arastirmaFormGuncelle("renk",r)}
                    style={{ width:32, height:32, borderRadius:"50%", background:r, border:arastirmaForm.renk===r?"3px solid #fff":"3px solid transparent", cursor:"pointer", outline:"none" }} />
                ))}
              </div>
            </Alan>

            <button onClick={arastirmaKaydet} style={{ width:"100%", marginTop:8, background:"linear-gradient(135deg,#4fc3f7,#9c64f0)", border:"none", borderRadius:12, padding:"14px", color:"#fff", fontSize:14, fontWeight:700, cursor:"pointer" }}>
              {arastirmaDuzenlemId?"✅ Güncelle":"✅ Araştırmayı Ekle"}
            </button>
          </div>
        )}

        {/* ── ADMIN GİRİŞ EKRANI ─────────────────────────────────────── */}
        {aktifEkran === "adminGiris" && !adminGiris && (
          <div style={{ padding:"40px 24px", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:"60vh" }}>
            <div style={{ width:64, height:64, borderRadius:16, background:"linear-gradient(135deg,#4fc3f7,#9c64f0)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:28, marginBottom:20 }}>⚙️</div>
            <div style={{ fontSize:18, fontWeight:700, color:"#fff", marginBottom:6 }}>Yönetici Girişi</div>
            <div style={{ fontSize:12, color:"#7986a3", marginBottom:28, textAlign:"center" }}>Bu alan yalnızca yöneticilere özeldir.</div>
            <input
              type="password"
              value={adminSifreGirdi}
              onChange={e=>{setAdminSifreGirdi(e.target.value);setAdminHata(false);}}
              onKeyDown={e=>{if(e.key==="Enter"){if(adminSifreGirdi===ADMIN_SIFRE){setAdminGiris(true);setAktifEkran("yonetici");}else{setAdminHata(true);}}}}
              placeholder="Şifre giriniz..."
              style={{ width:"100%", maxWidth:280, background:"rgba(255,255,255,0.06)", border:`1px solid ${adminHata?"rgba(240,98,146,0.6)":"rgba(255,255,255,0.15)"}`, borderRadius:12, padding:"12px 16px", color:"#e8eaf0", fontSize:14, outline:"none", textAlign:"center", letterSpacing:"3px", marginBottom:8, boxSizing:"border-box" }}
            />
            {adminHata && <div style={{ fontSize:12, color:"#f06292", marginBottom:12 }}>⚠ Yanlış şifre</div>}
            <button onClick={()=>{if(adminSifreGirdi===ADMIN_SIFRE){setAdminGiris(true);setAktifEkran("yonetici");}else{setAdminHata(true);}}}
              style={{ width:"100%", maxWidth:280, background:"linear-gradient(135deg,#4fc3f7,#9c64f0)", border:"none", borderRadius:12, padding:"13px", color:"#fff", fontSize:14, fontWeight:600, cursor:"pointer", marginTop:4 }}>
              Giriş Yap
            </button>
            <button onClick={()=>setAktifEkran("ana")} style={{ marginTop:12, background:"none", border:"none", color:"#7986a3", fontSize:12, cursor:"pointer" }}>← Ana Sayfaya Dön</button>
          </div>
        )}

        {/* ── YÖNETİCİ PANELİ ────────────────────────────────────────── */}
        {aktifEkran === "yonetici" && (
          <div style={{ padding:"18px 16px" }}>
            <div style={{ fontSize:17, fontWeight:700, color:"#fff", marginBottom:4 }}>⚙️ Yönetici Paneli</div>
            <div style={{ fontSize:12, color:"#7986a3", marginBottom:18 }}>Kütüphane ve araştırmaları yönetin</div>

            {/* Nöromit bölümü */}
            <div style={{ fontSize:10, color:"#7986a3", fontFamily:"monospace", letterSpacing:"1px", marginBottom:10 }}>NÖROMİT KÜTÜPHANESİ</div>
            <button onClick={()=>{setForm(BOŞ_FORM);setDuzenlemId(null);setFormHata({});setAktifEkran("mitEkle");}}
              style={{ width:"100%", background:"rgba(79,195,247,0.08)", border:"1px solid rgba(79,195,247,0.2)", borderRadius:12, padding:"13px", color:"#4fc3f7", fontSize:13, fontWeight:600, cursor:"pointer", marginBottom:10, textAlign:"left" }}>
              ➕ Yeni Nöromit Ekle <span style={{ float:"right", opacity:0.6 }}>{mitler.length} kayıt</span>
            </button>

            {/* Araştırma bölümü */}
            <div style={{ fontSize:10, color:"#7986a3", fontFamily:"monospace", letterSpacing:"1px", marginBottom:10, marginTop:20 }}>GÜNCEL ARAŞTIRMALAR</div>
            <button onClick={()=>{setArastirmaForm(BOŞ_ARASTIRMA);setArastirmaDuzenlemId(null);setArastirmaFormHata({});setAktifEkran("arastirmaEkle");}}
              style={{ width:"100%", background:"rgba(156,100,240,0.08)", border:"1px solid rgba(156,100,240,0.2)", borderRadius:12, padding:"13px", color:"#9c64f0", fontSize:13, fontWeight:600, cursor:"pointer", marginBottom:10, textAlign:"left" }}>
              🔬 Yeni Araştırma Ekle <span style={{ float:"right", opacity:0.6 }}>{arastirmalar.length} kayıt</span>
            </button>

            <div style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.05)", borderRadius:13, padding:14 }}>
              <div style={{ fontSize:10, color:"#7986a3", fontFamily:"monospace", marginBottom:12 }}>MEVCUT ARAŞTIRMALAR</div>
              {arastirmalar.length === 0 ? (
                <div style={{ fontSize:12, color:"#7986a3", textAlign:"center", padding:"12px 0" }}>Henüz araştırma eklenmemiş</div>
              ) : (
                arastirmalar.map(a => (
                  <div key={a.id} style={{ display:"flex", alignItems:"center", gap:8, padding:"9px 0", borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
                    <div style={{ width:8, height:8, borderRadius:"50%", background:a.renk, flexShrink:0 }} />
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:12, color:"#fff", fontWeight:600, lineHeight:1.3 }}>{a.baslik}</div>
                      <div style={{ fontSize:10, color:"#7986a3" }}>{a.yil} · {a.etiket}</div>
                    </div>
                    <button onClick={()=>arastirmaDuzenlemeBaslat(a)} style={{ background:"rgba(79,195,247,0.1)", border:"1px solid rgba(79,195,247,0.2)", color:"#4fc3f7", borderRadius:6, padding:"4px 8px", fontSize:11, cursor:"pointer" }}>✏️</button>
                    <button onClick={()=>setArasSilOnay(a.id)} style={{ background:"rgba(240,98,146,0.1)", border:"1px solid rgba(240,98,146,0.2)", color:"#f06292", borderRadius:6, padding:"4px 8px", fontSize:11, cursor:"pointer" }}>🗑️</button>
                  </div>
                ))
              )}
            </div>

            <div style={{ background:"rgba(255,165,0,0.05)", border:"1px solid rgba(255,165,0,0.18)", borderRadius:12, padding:13, marginTop:14 }}>
              <div style={{ fontSize:11, color:"#ffb74d", fontFamily:"monospace", marginBottom:5 }}>💡 NOT</div>
              <div style={{ fontSize:12, color:"#9aa5be", lineHeight:1.6 }}>Veriler yalnızca bu oturumda saklanıyor. Kalıcı kayıt için Firebase entegrasyonu önerilir.</div>
            </div>
          </div>
        )}

        {/* ── CHAT ────────────────────────────────────────────────────── */}
        {aktifEkran === "chat" && (
          <div style={{ padding:"18px 16px", display:"flex", flexDirection:"column", height:"calc(100vh - 160px)" }}>
            <div style={{ fontSize:17, fontWeight:700, color:"#fff", marginBottom:4 }}>💬 AI Asistan</div>
            <div style={{ fontSize:12, color:"#7986a3", marginBottom:14 }}>Nöromitler hakkında soru sorun</div>
            <div style={{ flex:1, overflowY:"auto", marginBottom:10, display:"flex", flexDirection:"column", gap:10 }}>
              {chatMesajlar.map((m,i) => (
                <div key={i} style={{ display:"flex", justifyContent:m.rol==="kullanici"?"flex-end":"flex-start" }}>
                  <div style={{ maxWidth:"85%", background:m.rol==="kullanici"?"rgba(79,195,247,0.15)":"rgba(255,255,255,0.04)", border:`1px solid ${m.rol==="kullanici"?"rgba(79,195,247,0.25)":"rgba(255,255,255,0.07)"}`, borderRadius:13, padding:"9px 13px", fontSize:13, color:"#e0e0e0", lineHeight:1.6 }}>
                    {m.icerik}
                  </div>
                </div>
              ))}
              {chatYukleniyor && (
                <div style={{ display:"flex", gap:4, padding:"9px 13px", background:"rgba(255,255,255,0.04)", borderRadius:13, width:"fit-content" }}>
                  {[0,1,2].map(i=><div key={i} style={{ width:5, height:5, borderRadius:"50%", background:"#4fc3f7", animation:"pulse 1s infinite", animationDelay:`${i*0.2}s` }} />)}
                </div>
              )}
              <div ref={chatSonRef} />
            </div>
            <div style={{ display:"flex", gap:8 }}>
              <input value={chatGirdi} onChange={e=>setChatGirdi(e.target.value)} onKeyDown={e=>e.key==="Enter"&&chatGonder()} placeholder="Soru yazın..." style={{ flex:1, ...inputStil(false) }} />
              <button onClick={chatGonder} disabled={chatYukleniyor||!chatGirdi.trim()} style={{ background:"linear-gradient(135deg,#4fc3f7,#9c64f0)", border:"none", borderRadius:11, width:44, cursor:"pointer", fontSize:16, opacity:chatYukleniyor?0.5:1 }}>→</button>
            </div>
          </div>
        )}
      </div>

      {/* ALT NAVİGASYON */}
      <div style={{ position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:430, background:"rgba(10,14,26,0.96)", backdropFilter:"blur(20px)", borderTop:"1px solid rgba(255,255,255,0.07)", display:"flex", zIndex:100 }}>
        {[
          {id:"ana",ikon:"⊞",etiket:"Ana"},
          {id:"analiz",ikon:"⌖",etiket:"Analiz"},
          {id:"kutuphane",ikon:"◫",etiket:"Kütüphane"},
          {id:"arastirmalar",ikon:"🔬",etiket:"Araştırma"},
          {id:"chat",ikon:"◉",etiket:"Asistan"},
        ].map(tab => (
          <button key={tab.id} onClick={()=>setAktifEkran(tab.id)}
            style={{ flex:1, background:"none", border:"none", padding:"10px 2px 8px", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:2 }}>
            <span style={{ fontSize:tab.id==="arastirmalar"?14:16, color:aktifEkran===tab.id?"#4fc3f7":"#fff", opacity:aktifEkran===tab.id?1:0.35 }}>{tab.ikon}</span>
            <span style={{ fontSize:8, color:aktifEkran===tab.id?"#4fc3f7":"#7986a3", fontFamily:"monospace" }}>{tab.etiket}</span>
          </button>
        ))}
      </div>

      <style>{`
        @keyframes pulse{0%,100%{opacity:0.3;transform:scale(0.8)}50%{opacity:1;transform:scale(1.1)}}
        button:active{transform:scale(0.97)}
        ::-webkit-scrollbar{width:3px}
        ::-webkit-scrollbar-thumb{background:rgba(79,195,247,0.2);border-radius:2px}
        textarea:focus,input:focus{border-color:rgba(79,195,247,0.4)!important;box-shadow:0 0 0 3px rgba(79,195,247,0.07)}
      `}</style>
    </div>
  );
}
