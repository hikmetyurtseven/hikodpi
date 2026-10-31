@echo off
chcp 65001 > nul
title HikoDPI Mobile - DPI & Sansür Baypas (Vibecoding 🎧)
color 0b

cls
echo ======================================================================
echo    🛡️  HikoDPI Mobile v0.2.0 (Built with Vibecoding 🎧)
echo    Mobil DPI, Discord VoIP, Roblox & Sansür Baypas Aracı
echo ======================================================================
echo.

:: 1. Bağımlılıkları kontrol et
if not exist "%~dp0node_modules" (
    echo [*] Proje bağımlılıkları ilk kez yükleniyor (pnpm install)...
    cd /d "%~dp0"
    call pnpm install
) else (
    echo [✓] Mobil bağımlılıklar hazır.
)

:: 2. Yerel IP adresini bul
for /f "tokens=4" %%a in ('route print^|findstr 0.0.0.0.*0.0.0.0^|findstr /v "0.0.0.0          0.0.0.0"') do (
    set LOCAL_IP=%%a
)

echo.
echo ======================================================================
echo   🎉 MOBİL UYGULAMA ÇALIŞMAYA HAZIR!
echo ======================================================================
echo.
echo   [📱 TELEFONUNUZDAN BAĞLANIN]:
echo   Telefonunuz aynı Wi-Fi ağına bağlıyken tarayıcınızdan (Chrome/Safari)
echo   şu adrese girin:
echo.
echo      👉 http://%LOCAL_IP%:5173
echo.
echo   [💻 BİLGİSAYARDAN ÖNİZLEME]:
echo      👉 http://localhost:5173
echo.
echo   [💡 İPUCU]: Telefonunuzda tarayıcı menüsünden "Ana Ekrana Ekle"
echo   yaparak tam ekran yerel bir mobil uygulama (PWA) gibi kullanabilirsiniz!
echo.
echo   [🤖 ANDROID STUDİO / APK]:
echo   Native Android derlemek için: "npx cap open android" çalıştırın.
echo.
echo ======================================================================
echo Sunucu başlatılıyor... (Kapatmak için Ctrl+C)
echo ======================================================================
echo.

cd /d "%~dp0"
call pnpm dev
pause
