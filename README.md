# 🛡️ HikoDPI Pro

<p align="center">
  <strong>Gelişmiş Windows DPI (Deep Packet Inspection) ve Sansür Baypas Aracı</strong><br>
  Superonline, Türk Telekom, Discord, Roblox ve engelli siteler için optimize edilmiştir.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Made%20With-Vibecoding%20🎧-purple?style=for-the-badge" alt="Vibecoding">
  <img src="https://img.shields.io/badge/Versiyon-0.2.0-cyan?style=for-the-badge" alt="Version">
  <img src="https://img.shields.io/badge/Platform-Windows%20(UAC%20Admin)-blue?style=for-the-badge&logo=windows" alt="Platform">
  <img src="https://img.shields.io/badge/React-19-61dafb?style=for-the-badge&logo=react" alt="React">
  <img src="https://img.shields.io/badge/Tailwind-v4-38bdf8?style=for-the-badge&logo=tailwindcss" alt="Tailwind">
  <img src="https://img.shields.io/badge/Lisans-MIT-emerald?style=for-the-badge" alt="License">
</p>

---

## 🎧 Made with Vibecoding

> Bu proje baştan sona **Vibecoding** felsefesiyle; yapay zeka destekli sezgisel pair-programming, hızlı prototipleme ve modern tam yığın (full-stack) masaüstü mimari standartlarıyla geliştirilmiştir.

---

## 📖 Genel Bakış

**HikoDPI**, Türkiye'deki internet servis sağlayıcılarının (Superonline, Türk Telekom, Turkcell, Vodafone) uyguladığı derin paket inceleme (DPI) ve DNS zehirlemesi kısıtlamalarını aşmak için geliştirilmiş modern, tek parça bir masaüstü baypas aracıdır.

Karmaşık konsol parametreleri veya hantal araçlar yerine; şık bir grafik arayüz ve arkasında çalışan yerel DoH & SNI parçalama motoru tek bir yapıda birleştirilmiştir.

### ⚡ Öne Çıkan Özellikler

* **🚀 2-Baytlık Agresif SNI Parçalama (SNI Splitting):** TLS ClientHello paketini ilk 2 baytından bölerek DPI donanımlarının (Huawei, Sandvine vb.) hedef domaini tespit etmesini engeller.
* **🎙️ Discord Voice & Gateway Çözümü:** Discord mesajlaşma ve ses odalarında yaşanan *"RTC Bağlanıyor"* ve ses kesintisi sorunlarını UDP 50000-65535 maskelemesi ile giderir.
* **🎮 Roblox & Oyun Desteği:** Roblox web sitesi, oyun içi harita/CDN varlıkları ve sunucu bağlantılarını açar.
* **🔒 Cloudflare DNS over HTTPS (DoH):** ISP seviyesindeki DNS zehirlemelerini aşarak alan adlarını doğrudan `1.1.1.1` üzerinden şifreli çözer (BTK sahte IP tuzağını atlatır).
* **⏱️ Canlı Oturum & Paket Telemetrisi:** Aktarılan paketler, manipüle edilen SNI blokları ve hassas oturum süresi (uptime) sayacı.
* **🩺 Hizmet Tanı Aracı (Diagnostics):** Discord, Roblox, Cloudflare DoH ve YouTube erişilebilirliğini anlık test eder.
* **🛡️ Otomatik Yönetici İzni:** Windows ağ adaptörlerini ve sistem proxy ayarlarını kesintisiz yönetebilmek için açılışta otomatik UAC yönetici izni ister.

---

## 🛠️ Hızlı Başlangıç

### 1. Tek Tıkla Başlatma (Otomatik Bağımlılık Yükleyici)
Klasör içerisindeki **`HikoDPI-Baslat.bat`** dosyasına çift tıklayın:
* Sistemde gerekli yazılımları (Node.js vb.) ve bağımlılıkları otomatik kontrol eder.
* Eksik bir bileşen varsa otomatik olarak kurar.
* Kurulum tamamlandığında veya zaten hazırsa ekranda **`PROGRAM ÇALIŞMAYA HAZIR!`** bildirimini verip uygulamayı açar.

### 2. Kurulum Paketi ile Kurulum (.exe)
Klasördeki **`HikoDPI-Kurulum.exe`** dosyasına çift tıklayarak programı doğrudan Windows'unuza kurabilir ve Başlat Menünüze kısayol ekleyebilirsiniz.

---

## ⚙️ Presetler (Çalışma Profilleri)

| Profil Adı | Açıklama | Kullanım Senaryosu |
| :--- | :--- | :--- |
| **Genel Web & Tarayıcı** | Standart SNI parçalama + DoH | Normal web siteleri, haberler, forumlar |
| **Superonline & Katı ISP** | 2 baytlık agresif SNI bölme + sahte paket enjeksiyonu | Superonline ve Türk Telekom katı sansürleri |
| **Discord & Roblox** | TCP 443 SNI split + UDP 50000-65535 ses fix'i | Discord ses odaları ve Roblox sunucuları |
| **Özel Yapılandırma** | Özelleştirilebilir upstream DNS ve parametreler | İleri düzey kullanıcılar ve özel DNS sunucuları |

---


---

## 📄 Lisans

Bu proje [MIT Lisansı](LICENSE) kapsamında lisanslanmıştır. Özgürce kullanılabilir, geliştirilebilir ve dağıtılabilir.
