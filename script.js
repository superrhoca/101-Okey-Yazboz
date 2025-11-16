// HTML elementlerini seç
const imageUpload = document.getElementById('image-upload');
const calculateBtn = document.getElementById('calculate-btn');
const statusDiv = document.getElementById('status');
const totalM = document.getElementById('total-m');
const totalF = document.getElementById('total-f');
const totalH = document.getElementById('total-h');
const totalN = document.getElementById('total-n');

// "Hesapla" butonuna tıklandığında
calculateBtn.addEventListener('click', () => {
    const file = imageUpload.files[0];
    if (!file) {
        statusDiv.innerText = 'Hata: Lütfen önce bir resim dosyası seçin.';
        return;
    }

    statusDiv.innerText = 'Resim analiz ediliyor... Bu işlem biraz zaman alabilir.';

    // Tesseract.js ile OCR işlemini başlat
    Tesseract.recognize(
        file,
        'tur', // Türkçe dilini kullanmayı dene (sayılar için 'eng' de olur)
        {
            logger: m => {
                // Analiz sürecini kullanıcıya göster
                if (m.status === 'recognizing text') {
                   statusDiv.innerText = `Metin okunuyor... (%${(m.progress * 100).toFixed(0)})`;
                } else {
                   statusDiv.innerText = `${m.status}...`;
                }
                console.log(m);
            }
        }
    ).then(({ data: { text } }) => {
        // OCR işlemi bittiğinde burası çalışır
        statusDiv.innerText = 'Analiz tamamlandı. Puanlar hesaplanıyor...';
        console.log("--- OCR Sonucu Ham Metin ---");
        console.log(text);
        console.log("----------------------------");
        
        // Gelen metni işle ve puanları hesapla
        calculateScoresFromText(text);

    }).catch(err => {
        statusDiv.innerText = 'Hata: OCR işlemi başarısız oldu.';
        console.error(err);
    });
});

/**
 * Bu fonksiyon, OCR'dan gelen ham metni analiz eder ve puanları hesaplar.
 * NOT: Bu en zor kısımdır ve sizin kağıt düzeninize göre özelleştirilmelidir.
 * Bu sadece basit bir ÖRNEKTİR.
 */
function calculateScoresFromText(text) {
    let totals = { M: 0, F: 0, H: 0, N: 0 };
    
    // Gelen metni satırlara ayır
    const lines = text.split('\n');
    
    // Her bir satır için döngü başlat
    for (const line of lines) {
        // Satırı boşluklara göre ayırarak sayıları bul
        const parts = line.trim().split(/\s+/); // Tüm boşluklara göre ayır
        
        // Eğer satırda tam 4 öğe varsa (M, F, H, N olduğunu varsayıyoruz)
        if (parts.length === 4) { 
            let m_val = parseScore(parts[0]);
            let f_val = parseScore(parts[1]);
            let h_val = parseScore(parts[2]);
            let n_val = parseScore(parts[3]);
            
            // Eğer hepsi geçerli bir sayı ise (NaN değilse) toplamlara ekle
            if (!isNaN(m_val) && !isNaN(f_val) && !isNaN(h_val) && !isNaN(n_val)) {
                totals.M += m_val;
                totals.F += f_val;
                totals.H += h_val;
                totals.N += n_val;
            }
        }
    }

    // Toplamları ekrana yazdır
    totalM.innerText = totals.M;
    totalF.innerText = totals.F;
    totalH.innerText = totals.H;
    totalN.innerText = totals.N;
    
    statusDiv.innerText = "Hesaplama tamamlandı!";
}

/**
 * OCR'dan gelen metni sayıya çevirir. '-' ise -101 döndürür.
 * OCR hatalarını (örn: 'Z' -> '2', 'O' -> '0') düzeltmek için 
 * bu fonksiyonu geliştirmeniz gerekebilir.
 */
function parseScore(textValue) {
    textValue = textValue.trim();
    
    // OCR bazen '1-' veya '- 1' gibi okuyabilir
    if (textValue.includes('-')) {
        return -101;
    }
    
    // OCR'ın sık yaptığı hataları düzelt (Örnek)
    let cleanedValue = textValue.replace(/O/g, '0').replace(/Z/g, '2').replace(/B/g, '8');
    
    // Sayı olmayan karakterleri temizle (sadece rakam kalsın)
    cleanedValue = cleanedValue.replace(/\D/g, ''); 
    
    return parseInt(cleanedValue) || 0; // Sayı değilse 0 say
}
