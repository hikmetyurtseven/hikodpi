# HikoDPI (Windows & Android Mobile)

<p align="center">
  <strong>Gelişmiş Windows & Android DPI (Deep Packet Inspection) ve Sansür Baypas Paketi</strong><br>
  Superonline, Türk Telekom, Turkcell, Vodafone için Discord, Roblox ve engelli servislere erişme çözümü.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Versiyon-0.3.0%20Multi--Platform-cyan?style=flat-square" alt="Version">
  <img src="https://img.shields.io/badge/Android%20APK-Hazır%20(3.3%20MB)-success?style=flat-square&logo=android" alt="Android APK">
  <img src="https://img.shields.io/badge/Windows-Portatif%20Exe-blue?style=flat-square&logo=windows" alt="Windows">
  <img src="https://img.shields.io/badge/Lisans-MIT-emerald?style=flat-square" alt="License">
</p>

---

## Hızlı Başlangıç ve İndirmeler

| Platform | Başlatma / Kurulum Dosyası | Boyut / Tür | Açıklama |
| :--- | :--- | :--- | :--- |
| **Windows Masaüstü** | `HikoDPI-Portatif/HikoDPI.exe` | Portatif (.exe) | Kurulumsuz doğrudan çalıştırın |
| **Android Mobil** | [**HikoDPI-Mobile.apk**](HikoDPI-Mobile.apk) | ~3.3 MB (.apk) | İmzalı, Play Protect uyumlu doğrudan yükleme paketi |
| **Windows Kurulum** | `HikoDPI-Kurulum.exe` | 125 MB (.exe) | Standart Windows kurulum sihirbazı |

---

## Genel Bakış

HikoDPI Suite, internet servis sağlayıcılarının (Superonline, Türk Telekom, Turkcell, Vodafone vb.) uyguladığı derin paket inceleme (DPI), DNS zehirlemesi ve SNI kısıtlamalarını hem Windows hem de Android cihazlarda aşmak için geliştirilmiş modern bir ağ aracıdır.

Sistem, konsol komutları veya karmaşık parametrelerle uğraşmadan tek tıkla çalışan modern bir arayüz ve arka planda yerel çalışan DoH & SNI parçalama motoru barındırır.

---

## Windows Masaüstü Sürümü

Windows üzerinde herhangi bir kurulum yapmaya gerek olmadan programı kullanabilirsiniz.

### Çalıştırma Adımları:
1. `HikoDPI-Portatif` klasörünü açın.
2. İçerisindeki **`HikoDPI.exe`** dosyasına çift tıklayarak uygulamayı başlatın.
3. Açılan arayüzden çalışma profilinizi (Genel Web, Discord & Roblox, Superonline vb.) seçip ana butondan korumayı etkinleştirin.

### Özellikler:
* **2-Baytlık SNI Parçalama:** WinDivert tabanlı filtreleme ile TLS ClientHello paketlerini ağ seviyesinde parçalayarak sansür filtrelerinin alan adını okumasını engeller.
* **Discord Voice & Gateway Desteği:** Discord ses kanallarında meydana gelen RTC bağlanıyor ve ses kopma sorunlarını UDP port maskelemesi ile giderir.
* **Roblox ve Oyun Desteği:** Roblox web, CDN ve oyun sunucusu bağlantılarını açar.
* **Canlı Oturum ve Paket Telemetrisi:** Aktarılan paketler, manipüle edilen SNI blokları ve hassas çalışma süresi sayacı.
* **Hizmet Tanı Aracı:** Discord, Roblox, Cloudflare DoH ve YouTube erişilebilirliğini arayüz üzerinden anlık test eder.

---

## Android Mobil Sürümü (HikoDPI Mobile)

Android 10 ve üzeri sürümlerle tam uyumlu çalışan mobil sürüm, mobil ağlardaki ve Wi-Fi üzerindeki engelleri yerel VpnService altyapısıyla çözer.

### Kurulum ve Çalıştırma:
1. [**HikoDPI-Mobile.apk**](HikoDPI-Mobile.apk) dosyasını telefonunuza indirin ve yükleyin.
2. Uygulama açılışında gelen Bildirim Gönderme İzni penceresini onaylayın.
3. Ana ekrandaki güç butonuna basıp Android VPN bağlantı isteğine "Tamam" deyin.
4. Bildirim çubuğunda anlık kronometre ve hızlı kontrol butonları belirecektir.

### Önemli Çözümler ve Yetenekler:
* **Gizlilik Hatası (SSL/NET::ERR_CERT_COMMON_NAME_INVALID) Çözümü:** Özel DNS girilse dahi operatör DPI kutularının HTTPS bağlantısını yakalayıp sahte BTK sayfasına yönlendirmesini engellemek için yerel `HikoDpiProxyServer` motoru kullanılır. TLS ClientHello paketini 2. baytından parçalayarak sunucuya iletir; böylece tarayıcı orijinal SSL sertifikasını alır ve gizlilik hatası yaşanmaz.
* **Canlı Kronometre ve Bildirim Kontrolleri:** Bildirim çubuğunda kaç saniyedir açık olduğunu gösteren canlı donanımsal sayaç yer alır. Bildirim üzerinden tek tıkla DPI Kapat, Yenile ve Aç işlemleri yapılabilir.
* **Dahili Cloudflare DoH:** Standart UDP 53 DNS sorguları yerine tüm alan adı çözümlemeleri doğrudan `https://1.1.1.1/dns-query` üzerinden ikili formatta gerçekleştirilir.
* **Google Play Protect Uyumlu:** Özel 2048-bit RSA üretim anahtarıyla hem V1 hem V2 standartlarında imzalanmıştır.

---

## Çalışma Profilleri (Presetler)

| Profil Adı | Açıklama | Kullanım Senaryosu |
| :--- | :--- | :--- |
| **Genel Web & Tarayıcı** | Standart SNI parçalama + DoH | Web siteleri, haber portalları, forumlar |
| **Superonline & Katı ISP** | 2 baytlık agresif SNI bölme + sahte paket enjeksiyonu | Superonline ve Türk Telekom katı filtreleri |
| **Discord & Roblox** | TCP 443 SNI split + UDP 50000-65535 ses desteği | Discord ses odaları ve Roblox sunucuları |
| **Özel Yapılandırma** | Özelleştirilebilir upstream DNS ve parametreler | İleri düzey kullanıcılar ve özel DNS sunucuları |

---

## Proje Dizin Yapısı

```
HikoDPI/
├── HikoDPI-Mobile.apk           # Kuruluma hazır Android Release APK (~3.3 MB)
├── HikoDPI-Portatif/           # Windows portatif sürüm klasörü
│   └── HikoDPI.exe             # Windows portatif çalıştırılabilir dosya
├── HikoDPI-Kurulum.exe          # Windows masaüstü kurulum sihirbazı
├── DISCLAIMER.md               # Yasal sorumluluk reddi beyanı
├── README.md                   # Proje dokümantasyonu
├── KULLANIM-KILAVUZU.txt       # Hızlı kullanım rehberi
├── engine/                     # Windows WinDivert DPI motoru
├── electron/                   # Windows Electron masaüstü kabuğu
├── src/                        # Windows React 19 arayüz kaynak kodları
└── android-sourcefiles/        # Android mobil kaynak kodları
    ├── HikoDPI-Mobile.apk      # İmzalı mobil paket
    ├── capacitor.config.ts     # Capacitor mobil yapılandırması
    ├── src/                    # Mobil React 19 + Tailwind UI
    └── android/                # Android Native Java VpnService & Proxy Motoru
        └── app/src/main/java/com/hikodpi/mobile/
            ├── HikoDpiProxyServer.java   # 2-baytlık TLS SNI parçalama proxy'si
            ├── HikoDpiVpnService.java    # Android TUN VpnService ve bildirim motoru
            ├── HikoDpiPlugin.java        # Capacitor - Native Java köprüsü
            └── MainActivity.java         # Android yaşam döngüsü ve izin yönetimi
```

---

## Kaynak Koddan Derleme

### Android Mobil Sürümü Derleme:
```powershell
cd android-sourcefiles
pnpm install
pnpm build
npx cap sync android
cd android
./gradlew assembleRelease
# Oluşan APK: android/app/build/outputs/apk/release/app-release.apk
```

### Windows Masaüstü Sürümünü Derleme:
```powershell
pnpm install
pnpm dev       # Geliştirici modu
pnpm build     # Üretim modu derlemesi
```

---

## Sorumluluk Reddi Beyanı (Disclaimer)

HikoDPI Suite (Windows ve Android Mobile), yalnızca ağ teknolojileri, DPI mimarileri ve TLS/SNI protokol davranışlarını incelemek amacıyla eğitim ve araştırma kapsamında geliştirilmiştir.

* Yazılımı kullanan kişiler, bulundukları ülkenin bilişim mevzuatına ve yasal düzenlemelerine uymakla bizzat yükümlüdür.
* Yazılımın kullanımından doğabilecek her türlü hukuki, idari ve teknik sorumluluk münhasıran kullanıcıya aittir.
* Geliştiriciler; yazılımın kullanımından veya hatalı yapılandırılmasından kaynaklanan doğrudan veya dolaylı zararlardan, bağlantı kesintilerinden ya da üçüncü taraf yaptırımlarından sorumlu tutulamaz.

Ayrıntılı yasal metin için [DISCLAIMER.md](DISCLAIMER.md) dosyasını inceleyebilirsiniz.

---

## Lisans

Bu proje [MIT Lisansı](LICENSE) kapsamında lisanslanmıştır. Özgürce incelenebilir, geliştirilebilir ve dağıtılabilir.
