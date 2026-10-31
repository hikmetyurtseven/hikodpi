# 🛡️ HikoDPI Suite (Windows & Android Mobile)

<p align="center">
  <strong>Gelişmiş Windows & Android DPI (Deep Packet Inspection) ve Sansür Baypas Paketi</strong><br>
  Superonline, Türk Telekom, Turkcell, Vodafone, Discord, Roblox ve tüm engelli platformlar için tam donanımlı çift platform çözümü.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Made%20With-Vibecoding%20🎧-purple?style=for-the-badge" alt="Vibecoding">
  <img src="https://img.shields.io/badge/Versiyon-0.3.0%20Multi--Platform-cyan?style=for-the-badge" alt="Version">
  <img src="https://img.shields.io/badge/Android%20APK-Hazır%20(3.3%20MB)-success?style=for-the-badge&logo=android" alt="Android APK">
  <img src="https://img.shields.io/badge/Windows-UAC%20Admin-blue?style=for-the-badge&logo=windows" alt="Windows">
  <img src="https://img.shields.io/badge/Lisans-MIT-emerald?style=for-the-badge" alt="License">
</p>

---

## 🚀 Hızlı İndirme & Başlatma

| Platform | Kurulum / Çalıştırma Dosyası | Boyut | Açıklama |
| :--- | :--- | :--- | :--- |
| 📱 **Android Mobil** | [**HikoDPI-Mobile.apk**](HikoDPI-Mobile.apk) | **~3.3 MB** | İmzalı, Play Protect uyumlu, doğrudan telefona yükleyin |
| 💻 **Windows Masaüstü** | [**HikoDPI-Baslat.bat**](HikoDPI-Baslat.bat) | Script | Otomatik bağımlılık yükleyici ve başlatıcı |
| 💻 **Windows Kurulum** | `HikoDPI-Kurulum.exe` | 125 MB | Tam donanımlı Windows masaüstü kurulum paketi |

---

## 🎧 Made with Vibecoding

> Bu proje baştan sona **Vibecoding** felsefesiyle; yapay zeka destekli sezgisel pair-programming, hızlı prototipleme, sıfır hata toleransı ve modern tam yığın (full-stack) mimari standartlarıyla geliştirilmiştir.

---

## 📖 Genel Bakış

**HikoDPI Suite**, Türkiye'deki internet servis sağlayıcılarının (Superonline, Türk Telekom, Turkcell, Vodafone) uyguladığı derin paket inceleme (DPI), DNS zehirlemesi ve SNI kısıtlamalarını hem **Windows masaüstü** hem de **Android mobil** cihazlarda aşmak için geliştirilmiş tek parça, modern bir baypas çözümüdür.

Karmaşık konsol parametreleri veya hantal araçlar yerine; şık bir siberpunk arayüz, arkasında çalışan yerel DoH & SNI parçalama motoru ve platforma özel optimize edilmiş ağ servisleri sunar.

---

## 📱 HikoDPI Mobile (Android Sürümü) Özellikleri

HikoDPI Mobile, Android 10 - 15 sürümleriyle tam uyumlu yerel bir **VpnService & SNI Parçalama Proxy Motoru** ile donatılmıştır:

### 🛑 1. "Gizlilik Hatası / SSL Sertifika Hatası" (NET::ERR_CERT_COMMON_NAME_INVALID) Kökten Çözümü
* **Sorun:** Türkiye'deki İSS'ler, engelli sitelere girerken sadece DNS zehirlemesi yapmaz. Telefona Özel DNS (`one.one.one.one`) girseniz bile, HTTPS bağlantısındaki TLS `ClientHello` paketinde geçen `discord.com` veya `roblox.com` SNI bilgisini DPI kutularıyla (Sandvine/Huawei) tespit edip araya sahte bir BTK engelleme sayfası yönlendirir. Tarayıcı sahte sertifika gördüğünde **"Gizlilik Hatası"** verir.
* **HikoDPI Çözümü:** Yerleşik `HikoDpiProxyServer` motoru, TLS `ClientHello` paketini **2. baytından parçalayarak (segment splitting)** 2 ayrı TCP segmenti halinde gönderir. İSS DPI filtresi bölünmüş SNI başlığını tanıyamaz ve paketi doğrudan sunucuya iletir. Böylece **Gizlilik Hatası tamamen ortadan kalkar!**

### 🔔 2. Canlı Donanımsal Kronometre ve Bildirim Çubuğu Kontrolleri
* Android 13+ (API 33+) bildirim izinleriyle tam entegre.
* Bildirim çubuğunda canlı saniye sayacı (`setUsesChronometer(true)`) ile aktif kalma süresini anlık gösterir.
* Uygulamaya girmeden doğrudan bildirim üzerinden tek dokunuşla kontrol butonları:
  * 🔴 **DPI Kapat:** Motoru ve VPN servisini anında durdurur.
  * 🔄 **Yenile:** Bağlantıyı ve DoH soketlerini sıfırlayıp tazeler.
  * 🟢 **Aç:** HikoDPI arayüzüne tek dokunuşla döner.

### 🔒 3. Dahili Cloudflare DoH (DNS over HTTPS)
* DNS sorguları İSS'nin 53 numaralı portundan geçmez; doğrudan `https://1.1.1.1/dns-query` üzerinden ikili DNS formatında çözülür.

### 🛡️ 4. Google Play Protect ve İmza Doğrulaması
* Uygulama, özel 2048-bit RSA + SHA-384 üretim anahtarı (`hikodpi-release.keystore`) ile **V1 (JAR) ve V2 (Full APK Signature)** standartlarında imzalanmıştır.
* `debuggable: false` olarak derlenmiş, optimize edilmiş ve küçültülmüştür (~3.3 MB).

---

## 💻 HikoDPI Windows (Masaüstü Sürümü) Özellikleri

* **🚀 2-Baytlık Agresif SNI Parçalama:** WinDivert çekirdek sürücüsü ile paketleri ağ kartı seviyesinde yakalar ve böler.
* **🎙️ Discord Voice & Gateway Çözümü:** Discord ses odalarında yaşanan *"RTC Bağlanıyor"* ve ses kesintisi sorunlarını UDP 50000-65535 maskelemesi ile giderir.
* **🎮 Roblox & Oyun Desteği:** Roblox web sitesi, oyun içi harita/CDN varlıkları ve sunucu bağlantılarını açar.
* **⏱️ Canlı Oturum & Paket Telemetrisi:** Aktarılan paketler, manipüle edilen SNI blokları ve hassas oturum süresi sayacı.
* **🩺 Hizmet Tanı Aracı (Diagnostics):** Discord, Roblox, Cloudflare DoH ve YouTube erişilebilirliğini anlık test eder.
* **🛡️ Otomatik Yönetici İzni:** Windows ağ adaptörlerini kesintisiz yönetebilmek için açılışta otomatik UAC yönetici izni ister.

---

## 🛠️ Kurulum ve Kullanım Kılavuzu

### 📱 Android Kurulumu

1. [**HikoDPI-Mobile.apk**](HikoDPI-Mobile.apk) dosyasını telefonunuza indirin.
2. İndirilen APK dosyasına dokunun. (Telefonunuz "Bilinmeyen kaynaklardan yükleme" izni isterse izin verin; Play Protect uyarısı verirse *"Yine de Yükle"* seçeneğine dokunun).
3. Uygulamayı ilk kez açtığınızda gelen **"Bildirim Gönderme İzni"** penceresinde **"İzin Ver"** deyin.
4. Ana ekrandaki neon güç butonuna basın; Android'in standart **"Bağlantı İsteği (VPN Anahtarı)"** bildirimine **"Tamam"** deyin.
5. Bildirim çubuğunda yeşil kalkan simgesi ve canlı kronometre belirecektir. Artık Discord, Roblox ve tüm engelli sitelere kısıtlamasız girebilirsiniz!

---

### 💻 Windows Kurulumu

1. Proje ana dizinindeki **`HikoDPI-Baslat.bat`** dosyasına çift tıklayın:
   * Node.js ve gerekli bağımlılıkları otomatik kontrol eder ve eksikse yükler.
   * Yükleme tamamlandığında **`PROGRAM ÇALIŞMAYA HAZIR!`** mesajını vererek uygulamayı açar.
2. Veya doğrudan `HikoDPI-Kurulum.exe` kurulum sihirbazını çalıştırın.
3. Açılan arayüzde dilediğiniz profili seçip tek tıkla DPI korumasını başlatın.

---

## ⚙️ Presetler (Çalışma Profilleri)

| Profil Adı | Açıklama | Kullanım Senaryosu |
| :--- | :--- | :--- |
| **Genel Web & Tarayıcı** | Standart SNI parçalama + DoH | Normal web siteleri, haberler, forumlar |
| **Superonline & Katı ISP** | 2 baytlık agresif SNI bölme + sahte paket enjeksiyonu | Superonline ve Türk Telekom katı sansürleri |
| **Discord & Roblox** | TCP 443 SNI split + UDP 50000-65535 ses fix'i | Discord ses odaları ve Roblox sunucuları |
| **Özel Yapılandırma** | Özelleştirilebilir upstream DNS ve parametreler | İleri düzey kullanıcılar ve özel DNS sunucuları |

---

## 📂 Proje Dizin Yapısı

```
HikoDPI/
├── HikoDPI-Mobile.apk           # Doğrudan kuruluma hazır Android Release APK (~3.3 MB)
├── HikoDPI-Baslat.bat          # Windows otomatik bağımlılık yükleyici ve başlatıcı
├── HikoDPI-Kurulum.exe          # Windows masaüstü kurulum paketi
├── DISCLAIMER.md               # Yasal sorumluluk reddi beyanı
├── README.md                   # Proje dokümantasyonu
├── engine/                     # Windows WinDivert DPI motoru
├── electron/                   # Windows masaüstü Electron kabuğu
├── src/                        # Windows React 19 UI kaynak kodları
└── mobile/                     # HikoDPI Mobile kaynak kodları
    ├── HikoDPI-Mobile.apk      # İmzalı mobil paket
    ├── capacitor.config.ts     # Capacitor mobil yapılandırması
    ├── src/                    # Mobil React 19 + Tailwind UI
    └── android/                # Android Native Java VpnService & Proxy Motoru
        └── app/src/main/java/com/hikodpi/mobile/
            ├── HikoDpiProxyServer.java   # 2-baytlık TLS SNI parçalama proxy'si
            ├── HikoDpiVpnService.java    # Android TUN VpnService ve bildirim motoru
            ├── HikoDpiPlugin.java        # Capacitor - Native Java köprüsü
            └── MainActivity.java         # Android yaşam döngüsü ve bildirim izni
```

---

## 🔧 Kaynak Koddan Derleme (Geliştiriciler İçin)

### Android Sürümünü Derleme:
```powershell
cd mobile
pnpm install
pnpm build
npx cap sync android
cd android
./gradlew assembleRelease
# Çıktı: android/app/build/outputs/apk/release/app-release.apk
```

### Windows Sürümünü Derleme:
```powershell
pnpm install
pnpm dev       # Geliştirici modu
pnpm build     # Üretim modu derlemesi
```

---

## ⚖️ Sorumluluk Reddi Beyanı (Disclaimer)

> **DİKKAT:** **HikoDPI Suite (Windows & Android Mobile)**, yalnızca ağ teknolojileri, DPI (Derin Paket İnceleme) mimarileri ve TLS/SNI protokol davranışlarını incelemek amacıyla **eğitim ve araştırma kapsamında** geliştirilmiştir.
> 
> * Bu yazılımı kullanan kişiler, bulundukları ülkenin bilişim mevzuatına ve yasal düzenlemelerine uymakla bizzat yükümlüdür.
> * Yazılımın kullanımından doğabilecek her türlü hukuki, idari ve teknik sorumluluk tamamen **kullanıcıya aittir**.
> * Geliştiriciler; yazılımın kullanımından veya hatalı yapılandırılmasından kaynaklanan herhangi bir doğrudan veya dolaylı zarardan, bağlantı kesintilerinden ya da üçüncü taraf yaptırımlarından sorumlu tutulamaz.
> 
> Ayrıntılı yasal metin için [DISCLAIMER.md](DISCLAIMER.md) dosyasını inceleyebilirsiniz.

---

## 📄 Lisans

Bu proje [MIT Lisansı](LICENSE) kapsamında lisanslanmıştır. Özgürce incelenebilir, geliştirilebilir ve dağıtılabilir.
