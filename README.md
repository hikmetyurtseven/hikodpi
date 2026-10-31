# HikoDPI (Windows & Android Mobile)

<p align="center">
  <strong>Gelişmiş Windows & Android DPI (Deep Packet Inspection) ve Sansür Baypas Paketi</strong><br>
  Superonline, Türk Telekom, Turkcell, Vodafone için Discord, Roblox ve engelli servislere erişme çözümü.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Versiyon-0.3.0-cyan?style=flat-square" alt="Version">
  <img src="https://img.shields.io/badge/Android%20APK-Hazır%20(3.3%20MB)-success?style=flat-square&logo=android" alt="Android APK">
  <img src="https://img.shields.io/badge/Windows-Portatif%20Exe-blue?style=flat-square&logo=windows" alt="Windows">
  <img src="https://img.shields.io/badge/Mimari-100%25%20Yerel%20(VPN'siz%20Hız)-orange?style=flat-square" alt="Architecture">
  <img src="https://img.shields.io/badge/Lisans-MIT-emerald?style=flat-square" alt="License">
</p>

---

## Hızlı Başlangıç ve İndirmeler

| Platform | Başlatma / Kurulum Dosyası | Boyut / Tür | Açıklama |
| :--- | :--- | :--- | :--- |
| **Windows Masaüstü** | `HikoDPI-Portatif/HikoDPI.exe` | Portatif (.exe) | Kurulum gerektirmez, doğrudan çift tıklayarak çalıştırın |
| **Android Mobil** | [**HikoDPI-Mobile.apk**](HikoDPI-Mobile.apk) | ~3.3 MB (.apk) | İmzalı, Play Protect uyumlu, doğrudan telefona yükleyin |
| **Windows Kurulum** | `HikoDPI-Kurulum.exe` | 125 MB (.exe) | Masaüstü ve Başlat menüsü kısayollu standart kurulum |

---

## Kapsamlı Genel Bakış ve Teknik Çalışma Mantığı

HikoDPI, Türkiye'deki internet servis sağlayıcılarının (Turkcell Superonline, Türk Telekom, Vodafone, Kablonet vb.) uyguladığı Derin Paket İnceleme (DPI), DNS zehirlemesi ve SNI kısıtlamalarını; uzak sunuculara ihtiyaç duymadan, bant genişliğini daraltmadan ve ping süresini artırmadan aşmak üzere geliştirilmiş yeni nesil bir ağ aracıdır.

### 1. Klasik VPN'lerden Farkı: Neden HikoDPI?
Geleneksel VPN servisleri (NordVPN, Proton, WARP vb.), kullanıcının tüm internet trafiğini yurt dışındaki (Almanya, Hollanda vb.) bir sunucuya tüneller. Bu durum:
* Bağlantı gecikmesini (ping) 50-120 ms artırarak çevrimiçi oyunlarda (Roblox, Valorant, CS2) ve Discord ses kanallarında gecikmeye yol açar,
* İnternet hızınızı VPN sunucusunun yoğunluğuna ve kapasitesine hapseder,
* Üçüncü taraf sunucular üzerinden geçen verileriniz için gizlilik soru işaretleri oluşturur.

**HikoDPI ise harici bir sunucu KULLANMAZ.** Trafiğiniz hiçbir zaman üçüncü taraf bir sunucuya yönlendirilmez. HikoDPI, tamamen bilgisayarınızın veya telefonunuzun yerel işletim sistemi belleğinde çalışır. Giden paketlerin başlıklarını gerçek zamanlı olarak manipüle eder; paketler doğrudan hedefe (Discord, Roblox sunucuları) gider. Bu sayede **orijinal fiber internet hızınızı ve minimum ping değerinizi (1-5 ms) korursunuz.**

---

### 2. İSS Sansür Mekanizması Nasıl Çalışır ve HikoDPI Nasıl Aşar?

Türkiye'deki internet kısıtlamaları çok katmanlı bir filtreleme mimarisine sahiptir:

#### Katman A: DNS Zehirlemesi (DNS Spoofing / Hijacking)
* **Engelleme Yöntemi:** Standart UDP 53 portu üzerinden giden DNS sorguları İSS tarafından yakalanır ve hedefin gerçek IP adresi yerine sahte bir yönlendirme IP'si (`195.175.254.2` veya BTK uyarı sunucuları) yanıt olarak döndürülür.
* **HikoDPI Çözümü:** Standart DNS sorguları tamamen devre dışı bırakılır. Tüm alan adı çözümlemeleri, Cloudflare `https://1.1.1.1/dns-query` üzerinden TLS ile şifrelenmiş **DNS over HTTPS (DoH)** ikili protokolüyle yapılır. İSS sorgu içeriğini göremez ve değiştiremez.

#### Katman B: TLS SNI Filtrelemesi (Deep Packet Inspection)
* **Engelleme Yöntemi:** Kullanıcı telefonuna veya bilgisayarına "Özel DNS" (örneğin 1.1.1.1) tanımlasa dahi, hedef web sitesine bağlanırken gönderilen ilk TLS `ClientHello` paketinde gidilmek istenen alan adı (`discord.com` veya `roblox.com`) **Server Name Indication (SNI)** başlığı altında açık metin (şifresiz) olarak yer alır. İSS'nin ağ omurgasındaki DPI donanımları (Huawei, Sandvine, ZTE) bu paketi yakalar ve araya girerek TCP Reset veya sahte bir HTTP/TLS yönlendirmesi enjekte eder.
* **HikoDPI Çözümü (2-Baytlık Agresif SNI Parçalama):** HikoDPI, TLS `ClientHello` paketini tam 2. baytından keserek iki ayrı TCP segmentine böler (TCP segmentation). İSS'nin hat üzerindeki DPI filtreleri paketleri anlık incelediği ve TCP akışını belleğinde birleştirip reassemble edemediği için alan adı dizilimini (`d` + `iscord.com`) tespit edemez. Paketler filtreden geçerek doğrudan orijinal sunucuya ulaşır.

#### Katman C: Mobil Cihazlardaki "Gizlilik Hatası / SSL Sertifika Hatası"
* **Sorun:** Telefonda Özel DNS açıkken dahi Discord veya Roblox açılmak istendiğinde Android tarayıcısı veya WebView `NET::ERR_CERT_COMMON_NAME_INVALID` hatası verir. Bunun sebebi, İSS DPI kutusunun SNI'ı yakaladığında araya sahte BTK engelleme sayfası sertifikası sıkıştırmasıdır.
* **HikoDPI Mobil Çözümü:** Android sürümü içinde çalışan yerel çok iş parçacıklı `HikoDpiProxyServer` motoru, bağlantıyı yerel proxy üzerinde yakalayıp 2 baytlık parçalama uygulayarak doğrudan uzak sunucuya açtığı soket üzerinden aktarır. Böylece telefona BTK'nın sahte sertifikası yerine Discord'un orijinal Cloudflare SSL sertifikası ulaşır ve **Gizlilik Hatası tamamen ortadan kalkar.**

#### Katman D: Discord Ses Kanalları (VoIP RTC) Engeli
* **Sorun:** Discord metin kanalları açılsa bile ses odalarına bağlanıldığında *"RTC Bağlanıyor"* hatası alınır veya ses hiç gitmez. Bunun sebebi ses trafiğinin UDP 50000-65535 portları üzerinden akması ve İSS'nin bu portları kısıtlamasıdır.
* **HikoDPI Çözümü:** Windows ve Android üzerinde ses paketlerine uygulanan özel port maskeleme parametreleri sayesinde ses bağlantısı kesintisiz kurulur.

---

## Platform Detayları

### Windows Masaüstü Sürümü

Windows sürümü, çekirdek seviyesinde çalışan güvenli ağ sürücüsü (WinDivert) ile entegre çalışır.

#### Çalıştırma Adımları:
1. `HikoDPI-Portatif` klasörünü açın.
2. Klasör içindeki **`HikoDPI.exe`** dosyasına çift tıklayın.
3. Çalışma profilinizi (örneğin "Discord & Roblox" veya "Superonline & Katı ISP") seçin.
4. Ana ekrandaki güç butonuna basarak korumayı başlatın.

#### Temel Yetenekler:
* **WinDivert Çekirdek Sürücüsü:** Ağ adaptörü seviyesinde paket yakalama ve mikro saniyeler düzeyinde paket parçalama.
* **Düşük Kaynak Tüketimi:** Arka planda %0.1'den az CPU ve yaklaşık 30-40 MB RAM tüketimi.
* **Canlı Oturum ve Paket Telemetrisi:** Aktarılan toplam veri, manipüle edilen SNI paketleri ve bağlantı süresi sayacı.
* **Dahili Tanı Aracı (Diagnostics):** Discord, Roblox, Cloudflare DoH ve YouTube erişilebilirliğini anlık olarak test eden entegre teşhis paneli.

---

### Android Mobil Sürümü (HikoDPI Mobile)

Android 10 - 17 sürümleriyle tam uyumlu yerel `VpnService` ve `ProxyServer` mimarisiyle inşa edilmiştir.

#### Kurulum ve Çalıştırma:
1. [**HikoDPI-Mobile.apk**](HikoDPI-Mobile.apk) dosyasını telefonunuza indirin ve dokunarak yükleyin. (Play Protect uyarısı çıkarsa "Yine de Yükle"yi seçin).
2. Uygulamayı ilk açtığınızda ekrana gelen **Bildirim Gönderme İzni** penceresine "İzin Ver" deyin.
3. Ana ekrandaki neon güç butonuna basın; Android'in standart sistem uyarısı olan **"VPN Bağlantı İsteği"** penceresini onaylayın.
4. Bildirim çubuğunu aşağı kaydırdığınızda canlı saniye sayacı ve kontrol butonları belirecektir.

#### Mobil Yenilikler:
* **Donanımsal Canlı Kronometre:** Bildirim çubuğunda telefonun dahili donanım saatini kullanan (`setUsesChronometer(true)`) anlık süre sayacı.
* **Doğrudan Bildirim Kontrolleri:** Bildirim üzerinden tek tıkla motoru kapatma, bağlantıyı yenileme ve uygulamaya dönme butonları.
* **Yüksek Öncelikli Servis:** Android'in pil optimizasyonu nedeniyle arka plandaki servisi sonlandırmasını önleyen öncelikli çalışma modu.
* **Güvenli İmza:** 2048-bit RSA + SHA-384 üretim sertifikası ile V1 ve V2 şemalarıyla imzalanmış kompakt APK paketi (~3.3 MB).

---

## Çalışma Profilleri (Presetler)

| Profil Adı | Çalışma Mantığı | Tavsiye Edilen Kullanım |
| :--- | :--- | :--- |
| **Genel Web & Tarayıcı** | Standart SNI parçalama + Cloudflare DoH | Yasaklı haber siteleri, bloglar, forumlar, genel web gezintisi |
| **Superonline & Katı ISP** | 2 baytlık agresif SNI bölme + TCP pencere manipülasyonu | Turkcell Superonline ve Türk Telekom katı DPI filtreleri |
| **Discord & Roblox** | TCP 443 SNI split + UDP 50000-65535 ses desteği | Discord mesajlaşma/ses odaları ve Roblox mobil/masaüstü |
| **Özel Yapılandırma** | Özelleştirilebilir upstream DoH adresleri | İleri düzey kullanıcılar, Quad9, AdGuard DNS yapılandırmaları |

---

## Proje Dizin Yapısı

```
HikoDPI/
├── HikoDPI-Mobile.apk           # Doğrudan kuruluma hazır Android Release APK (~3.3 MB)
├── HikoDPI-Portatif/           # Windows taşınabilir sürüm klasörü
│   └── HikoDPI.exe             # Windows portatif çalıştırılabilir dosya
├── HikoDPI-Kurulum.exe          # Windows masaüstü kurulum sihirbazı
├── DISCLAIMER.md               # Kapsamlı yasal sorumluluk reddi beyanı (TR & EN)
├── README.md                   # Ana proje dokümantasyonu
├── KULLANIM-KILAVUZU.txt       # Hızlı metin kılavuzu
├── engine/                     # Windows WinDivert paket motoru
├── electron/                   # Windows masaüstü Electron kabuğu
├── src/                        # Windows React 19 kullanıcı arayüzü kodları
└── android-sourcefiles/        # Android mobil tam kaynak kodları
    ├── HikoDPI-Mobile.apk      # İmzalı mobil paket
    ├── capacitor.config.ts     # Capacitor mobil yapılandırması
    ├── src/                    # Mobil React 19 + Tailwind UI bileşenleri
    └── android/                # Android Native Java VpnService & Proxy Motoru
        └── app/src/main/java/com/hikodpi/mobile/
            ├── HikoDpiProxyServer.java   # 2-baytlık TLS SNI parçalama proxy'si
            ├── HikoDpiVpnService.java    # Android TUN VpnService ve bildirim motoru
            ├── HikoDpiPlugin.java        # Capacitor - Native Java köprüsü
            └── MainActivity.java         # Android yaşam döngüsü ve bildirim izinleri
```

---

## Kaynak Koddan Derleme (Geliştiriciler İçin)

### Android Mobil Sürümünü Derleme:
```powershell
cd android-sourcefiles
pnpm install
pnpm build
npx cap sync android
cd android
./gradlew assembleRelease
# Çıktı APK: android/app/build/outputs/apk/release/app-release.apk
```

### Windows Masaüstü Sürümünü Derleme:
```powershell
pnpm install
pnpm dev       # Geliştirici modu
pnpm build     # Üretim modu derlemesi
```

---

## Sorumluluk Reddi Beyanı ve Hukuki Uyarı

Bu yazılım, münhasıran bilgisayar ağları, internet protokolleri, Derin Paket İnceleme (DPI) mimarileri ve TLS/SNI paket davranışlarını incelemek amacıyla **eğitim, teknik test ve akademik araştırma kapsamında** geliştirilmiştir.

1. **Kullanıcı Sorumluluğu:** Yazılımı indiren, derleyen veya kullanan her birey, bulunduğu yargı alanındaki yürürlükteki yasalara (Türkiye Cumhuriyeti için 5651 Sayılı Kanun, 5237 Sayılı Türk Ceza Kanunu Bilişim Suçları hükümleri ve yetkili mahkeme/BTK kararları dahil) uymakla bizzat yükümlüdür.
2. **Kötüye Kullanım Yasağı:** Yazılımın yasa dışı faaliyetlerde bulunmak veya suç unsuru teşkil eden içeriklere erişmek amacıyla kullanılması kesinlikle yasaktır ve bu tür eylemlerden doğacak tüm hukuki, idari ve cezai sorumluluk münhasıran kullanıcıya aittir.
3. **Garanti ve Sorumluluk Muafiyeti:** Yazılım MIT Lisansı kapsamında "OLDUĞU GİBİ" (AS IS) sunulmaktadır. Geliştiriciler; yazılımın kullanımından doğabilecek veri kayıplarından, sistem arızalarından, ağ kesintilerinden veya üçüncü taraf platformlarca (Discord, Roblox, İSS vb.) uygulanabilecek hesap kısıtlamalarından hiçbir koşul altında sorumlu tutulamaz.

Ayrıntılı ve bağlayıcı çift dilli yasal metin için [DISCLAIMER.md](DISCLAIMER.md) dosyasını inceleyiniz.

---

## Lisans

Bu proje [MIT Lisansı](LICENSE) kapsamında açık kaynak olarak lisanslanmıştır. Özgürce incelenebilir, geliştirilebilir ve kişisel amaçlarla dağıtılabilir.
