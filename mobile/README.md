# 🛡️ HikoDPI Mobile

<p align="center">
  <strong>Gelişmiş Mobil DPI (Deep Packet Inspection), Discord VoIP & Sansür Baypas Aracı</strong><br>
  Android, iOS ve mobil ağlar (Turkcell, Vodafone, Türk Telekom) için optimize edilmiş modern mobil sürüm.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Made%20With-Vibecoding%20🎧-purple?style=for-the-badge" alt="Vibecoding">
  <img src="https://img.shields.io/badge/Versiyon-0.2.0-cyan?style=for-the-badge" alt="Version">
  <img src="https://img.shields.io/badge/Platform-Android%20%7C%20iOS%20%7C%20PWA-blue?style=for-the-badge&logo=android" alt="Platform">
  <img src="https://img.shields.io/badge/React-19-61dafb?style=for-the-badge&logo=react" alt="React">
  <img src="https://img.shields.io/badge/Tailwind-v4-38bdf8?style=for-the-badge&logo=tailwindcss" alt="Tailwind">
  <img src="https://img.shields.io/badge/Lisans-MIT-emerald?style=for-the-badge" alt="License">
</p>

---

## 🎧 Made with Vibecoding

> Bu mobil sürüm, masaüstü HikoDPI Pro ile birebir aynı görsel tasarım dili ve felsefeyle; **Vibecoding** anlayışı temel alınarak modern mobil arayüz standartlarına uygun şekilde geliştirilmiştir.

---

## 📱 Genel Bakış

**HikoDPI Mobile**, akıllı telefonlarda (Android & iOS) mobil hücresel ağlar ve Wi-Fi bağlantıları üzerinden uygulanan derin paket inceleme (DPI) ve DNS zehirlemesi engellerini aşmak üzere geliştirilmiştir.

Masaüstü sürümdeki neon siber-estetik, anlık canlı telemetri, dokunsal haptik titreşim geri bildirimi ve test araçları doğrudan mobil ekran boyutlarına uyarlanmıştır.

### ⚡ Öne Çıkan Mobil Özellikler

* **🎙️ Mobil Discord Ses Odaları (VoIP RTC):** Mobil Discord uygulamasında yaşanan *"RTC Bağlanıyor"* ve ses kopması sorunlarını çözen UDP 50000-65535 paket maskeleme desteği.
* **🎮 Roblox Mobil Desteği:** Roblox mobil uygulaması harita indirmeleri, oyun içi CDN varlıkları ve API bağlantılarını açar.
* **🚀 2-Baytlık Agresif SNI Parçalama:** TLS ClientHello paketini ilk 2 bayttan bölerek mobil operatörlerin DPI donanımlarını atlatır.
* **🔒 Cloudflare DNS over HTTPS (DoH) & Private DNS:** ISP seviyesindeki DNS sahte IP yönlendirmelerini (BTK engeli) aşar.
* **📱 1-Tıkla Android Özel DNS Rehberi:** Android 9+ cihazlarda hiçbir harici uygulama yüklemeden `one.one.one.one` kurulumu sağlayan panoya kopyalama desteği.
* **📳 Haptik Titreşim Geri Bildirimi:** Güç butonu ve işlemlerde dokunsal mobil titreşim.
* **🌐 PWA & Native Android (Capacitor):** Hem tarayıcıdan "Ana Ekrana Ekle" yapılarak bağımsız bir mobil uygulama gibi çalışır, hem de Android Studio ile native `.apk` olarak derlenebilir (`android/` klasörü hazır).
* **🩺 Mobil Hizmet Tanı Aracı:** Discord Gateway, Discord Voice, Roblox API, Cloudflare DoH ve YouTube gecikmelerini tek dokunuşla ölçer.

---

## 🛠️ Nasıl Çalıştırılır ve Kullanılır?

### Yöntem A: Telefonunuzdan Hemen Kullanma (Tek Tıkla Başlatıcı)
1. Klasör içerisindeki **`HikoDPI-Mobile-Baslat.bat`** dosyasına çift tıklayın.
2. Konsol ekranında yerel ağ IP adresiniz görüntülenecektir (Örnek: `http://192.168.1.116:5173`).
3. Telefonunuz bilgisayarınızla **aynı Wi-Fi ağına bağlıyken** telefonunuzun tarayıcısından (Chrome veya Safari) bu adrese girin.
4. **İpucu:** Tarayıcınızın menüsünden **"Ana Ekrana Ekle" (Add to Home Screen)** seçeneğine dokunarak tam ekran, yerel bir mobil uygulama deneyimi elde edebilirsiniz!

### Yöntem B: Native Android APK Olarak Açma
Android Studio kullanıyorsanız, projeyi doğrudan native bir Android uygulaması olarak açabilirsiniz:
```bash
npx cap open android
```
*(Proje `HikoDpiVpnService.java` ve `AndroidManifest.xml` izinleri ile önceden yapılandırılmıştır).*

---

## ⚙️ Mobil Baypas Profilleri

| Profil | Rozet | Açıklama |
| :--- | :--- | :--- |
| **Discord & Roblox Mobil** | `Popüler 🎮` | Mobil Discord VoIP ses kanalları (UDP 50000-65535) ve Roblox harita erişimi. |
| **Superonline & Katı ISP** | `Agresif ⚡` | Superonline ve Türk Telekom mobil hatlarındaki katı sansürü aşmak için 2-baytlık SNI bölme. |
| **Genel Mobil Web** | `Önerilen 🌐` | Yasaklı web siteleri ve tarayıcılar için en kararlı, pil dostu DoH modu. |
| **Özel Yapılandırma** | `Gelişmiş 🛠️` | AdGuard, Quad9 veya özel DoH sunucuları ile özelleştirilebilir kurallar. |

---

## ⚖️ Sorumluluk Reddi Beyanı (Disclaimer)

> **DİKKAT:** **HikoDPI Mobile**, yalnızca mobil ağ protokolleri, DPI mimarileri ve şifreli DNS davranışlarını incelemek amacıyla **eğitim ve araştırma kapsamında** geliştirilmiştir.
> 
> * Bu yazılımı kullanan kişiler, bulundukları ülkenin bilişim mevzuatına ve yasal düzenlemelerine uymakla bizzat yükümlüdür.
> * Yazılımın kullanımından doğabilecek her türlü hukuki, idari ve teknik sorumluluk tamamen **kullanıcıya aittir**.
> 
> Ayrıntılı yasal metin için [DISCLAIMER.md](DISCLAIMER.md) dosyasını inceleyebilirsiniz.

---

## 📄 Lisans

Bu proje [MIT Lisansı](LICENSE) kapsamında lisanslanmıştır. Özgürce kullanılabilir ve geliştirilebilir.
