# HikoDPI Mobile (Android Kaynak Kodları)

<p align="center">
  <strong>Gelişmiş Mobil DPI (Deep Packet Inspection), Discord VoIP & Sansür Baypas Motoru</strong><br>
  Android ve mobil ağlar (Turkcell, Vodafone, Türk Telekom) için optimize edilmiş mobil kaynak kodları.
</p>

---

## Genel Bakış

Bu dizin, HikoDPI'nin Android mobil sürümüne ait React 19 + Tailwind v4 kullanıcı arayüzü ve native Android VpnService & SNI proxy motorunun kaynak kodlarını içerir.

### Temel Bileşenler:
* **HikoDpiProxyServer.java:** 2-baytlık TLS SNI parçalama proxy'si. Operatör DPI filtrelerini atlatarak Discord ve Roblox'taki SSL gizlilik hatasını çözer.
* **HikoDpiVpnService.java:** Android TUN arayüzü, DoH (DNS over HTTPS) ikili DNS çözücü ve canlı donanımsal kronometreli bildirim çubuğu.
* **HikoDpiPlugin.java:** Web arayüzü ile native Java servisleri arasındaki Capacitor köprüsü.
* **MainActivity.java:** Android 13+ (API 33+) bildirim izin yönetimi ve uygulama yaşam döngüsü.

---

## Kaynak Koddan Derleme

Android Release APK derlemek için:

```powershell
# 1. Bağımlılıkları yükleyin
pnpm install

# 2. Web varlıklarını derleyin
pnpm build

# 3. Android projesine aktarın
npx cap sync android

# 4. Release APK derleyin
cd android
./gradlew assembleRelease
```

Derlenen APK: `android/app/build/outputs/apk/release/app-release.apk` dizininde üretilir.

---

## Lisans

Bu proje [MIT Lisansı](LICENSE) kapsamında lisanslanmıştır.
