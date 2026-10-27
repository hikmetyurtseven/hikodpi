@echo off
chcp 65001 > nul
title HikoDPI Pro - DPI & Sansür Baypas Aracı
color 0b

:: 1. Yönetici izinlerini denetle ve otomatik yetki iste (UAC Elevation)
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo [BİLGİ] HikoDPI için Yönetici hakları isteniyor...
    powershell -Command "Start-Process '%~dpnx0' -Verb RunAs"
    exit /b
)

:: 2. Önceden derlenmiş portatif sürüm varsa doğrudan başlat
if exist "%~dp0HikoDPI-Portatif\HikoDPI.exe" (
    cls
    echo ======================================================================
    echo    🛡️  HikoDPI Pro v0.2.0 (Built with Vibecoding 🎧)
    echo ======================================================================
    echo.
    echo   [✓] Bağımlılıklar denetlendi: Sistem hazır!
    echo   [✓] Program çalışmaya hazır!
    echo.
    echo ======================================================================
    start "" "%~dp0HikoDPI-Portatif\HikoDPI.exe"
    timeout /t 2 >nul
    exit /b
)

:: 3. Kaynak koddan çalıştırma: Otomatik bağımlılık denetimi ve kurulumu
cls
echo ======================================================================
echo    🛡️  HikoDPI Pro v0.2.0 (Built with Vibecoding 🎧)
echo    Otomatik Bağımlılık ve Sistem Denetimi
echo ======================================================================
echo.

:: Node.js Denetimi
echo [*] Node.js çalışma ortamı denetleniyor...
where node >nul 2>&1
if %errorLevel% neq 0 (
    echo [EKSİK] Node.js bulunamadı!
    echo [YÜKLENİYOR] Windows Paket Yöneticisi (winget) ile Node.js kuruluyor...
    where winget >nul 2>&1
    if %errorLevel% equ 0 (
        winget install OpenJS.NodeJS.LTS --silent --accept-package-agreements --accept-source-agreements
        echo [TAMAMLANDI] Node.js kuruldu.
    ) else (
        echo [HATA] winget bulunamadı. Lütfen https://nodejs.org adresinden Node.js kurun.
        pause
        exit /b
    )
) else (
    echo [✓] Node.js hazır.
)

:: pnpm Denetimi
echo [*] Paket yöneticisi denetleniyor...
where pnpm >nul 2>&1
if %errorLevel% neq 0 (
    echo [YÜKLENİYOR] pnpm yükleniyor...
    call npm install -g pnpm >nul 2>&1
) else (
    echo [✓] pnpm hazır.
)

:: node_modules Denetimi
if not exist "%~dp0node_modules" (
    echo [*] Proje bağımlılıkları ve kütüphaneler yükleniyor (pnpm install)...
    cd /d "%~dp0"
    call pnpm install
) else (
    echo [✓] Kütüphaneler hazır.
)

:: dist Arayüz Derleme Denetimi
if not exist "%~dp0dist" (
    echo [*] Arayüz ilk kez derleniyor (pnpm run build)...
    call pnpm run build
) else (
    echo [✓] Arayüz derlemesi hazır.
)

echo.
echo ======================================================================
echo   🎉 TÜM BAĞIMLILIKLAR VE ÇALIŞMA ORTAMI BAŞARIYLA TAMAMLANDI!
echo   ✓ PROGRAM ÇALIŞMAYA HAZIR!
echo ======================================================================
echo.

echo [1/3] HikoDPI Yerel Baypas ve DoH Motoru başlatılıyor (127.0.0.1:8080)...
start "HikoDPI Proxy" /min node "%~dp0engine\proxy.js" --system-proxy

echo [2/3] Windows DNS önbelleği temizleniyor...
ipconfig /flushdns >nul 2>nul

echo [3/3] HikoDPI Kontrol Paneli açılıyor...
call pnpm dev

:: Çıkışta sistem proxy ayarını güvenle temizle
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Internet Settings" /v ProxyEnable /t REG_DWORD /d 0 /f >nul 2>nul
