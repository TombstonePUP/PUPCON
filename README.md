<div align="center">

# 🎓 PUPCON

**🏛️ PUP San Juan Accreditation System**

[![Laravel](https://img.shields.io/badge/Laravel-FF2D20?style=flat-square&logo=laravel&logoColor=white)](https://laravel.com)
[![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org)

[🚀 Demo](http://localhost:8000) • [📋 Issues](https://github.com/TombstonePUP/PUPCON/issues) • [💡 Feature Request](https://github.com/TombstonePUP/PUPCON/issues/new)

</div>

---

## 📋 Table of Contents

- [🎯 Overview](#-overview)
- [✨ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [🚀 Installation](#-installation)
- [🔐 cURL & OpenSSL Configuration](#-curl--openssl-configuration)
- [📄 Ghostscript PDF Optimizer Setup](#-ghostscript-pdf-optimizer-setup)
- [👥 Team](#-team)

---

## 🎯 Overview

📚 **File management system** for PUP San Juan accreditation processes  
🔐 **Secure document handling** with role-based access  
📊 **Real-time progress tracking** and analytics

---

## ✨ Features

### 📂 Document Management

- 📤 **Upload/Download** with progress indicators
- 📁 **File organization** by areas & parameters
- 🔍 **Advanced search** & filtering
- 📑 **Document viewer** with PDF preview

### 👥 User Management

- 🔑 **Role-based access** (Admin, Coordinator, Area Designee)
- 🛡️ **Secure authentication** with JWT
- 👤 **User profiles** & permission management
- 📋 **Audit trail** for all activities

### 📊 Workflow

- 🎯 **Program management** by academic areas
- 📈 **Progress tracking** with real-time updates
- 🤝 **Collaborative review** process
- 🏆 **Exhibit management** for accreditation

### 🎨 Experience

- 📱 **Responsive design** (mobile, tablet, desktop)
- 🌙 **Dark/Light mode** toggle
- 📊 **Interactive dashboard** with analytics
- 🔔 **Real-time notifications**

---

## 🛠️ Tech Stack

**Frontend** 🎨  
[![React](https://img.shields.io/badge/React_18-20232A?style=flat-square&logo=react&logoColor=61DAFB)](https://reactjs.org) [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org) [![Tailwind](https://img.shields.io/badge/Tailwind-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com) [![Inertia](https://img.shields.io/badge/Inertia.js-9553E9?style=flat-square&logo=inertiajs&logoColor=white)](https://inertiajs.com)

**Backend** ⚙️  
[![Laravel](https://img.shields.io/badge/Laravel_11-FF2D20?style=flat-square&logo=laravel&logoColor=white)](https://laravel.com) [![PHP](https://img.shields.io/badge/PHP_8.2+-777BB4?style=flat-square&logo=php&logoColor=white)](https://www.php.net) [![Sanctum](https://img.shields.io/badge/Sanctum-FF2D20?style=flat-square&logo=laravel&logoColor=white)](https://laravel.com/docs/sanctum)

**Database** 🗄️  
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org)

**Tools** 🔧  
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev) [![Composer](https://img.shields.io/badge/Composer-885630?style=flat-square&logo=composer&logoColor=white)](https://getcomposer.org) [![npm](https://img.shields.io/badge/npm-CB3837?style=flat-square&logo=npm&logoColor=white)](https://www.npmjs.com) [![Ghostscript](https://img.shields.io/badge/Ghostscript-000000?style=flat-square&logo=ghostscript&logoColor=white)](https://www.ghostscript.com)

---

## 🚀 Installation

### ⚡ Prerequisites

- 🐘 PHP 8.2+
- 🟢 Node.js 18+
- 🐘 PostgreSQL 13+
- 📦 Composer 2.x
- 👻 Ghostscript (for PDF optimization)
- 🔐 cURL & OpenSSL enabled

### 📥 Setup

```bash
# 1️⃣ Clone repository
git clone https://github.com/TombstonePUP/PUPCON.git
cd PUPCON

# 2️⃣ Install dependencies
composer install
composer require mostafaznv/pdf-optimizer  # 📄 Install PDF Optimizer package
npm install

# 3️⃣ Environment setup
cp .env.example .env
php artisan key:generate
php artisan storage:link

# 4️⃣ Database setup
php artisan migrate
php artisan db:seed

# 5️⃣ Start servers
composer run dev
```

### 🔑 Default Accounts

| 👤 Role           | 📧 Email                 | 🔐 Password      |
| ----------------- | ------------------------ | ---------------- |
| 🛡️ **Admin**      | `johndoe@admin.com`      | `admin@123`      |
| 👨‍💼 **Chairman**   | `keithlee@chairman.com`  | `chairman@123`   |
| 👨‍💼 **Accreditor** | `janedoe@accreditor.com` | `accreditor@123` |

🎉 **App running at** [http://localhost:8000](http://localhost:8000)

---

## 🔐 cURL & OpenSSL Configuration

This application requires cURL and OpenSSL for secure API connections (Facebook API, external services, etc.). Follow these steps to enable and configure them properly.

### 📦 Step 1: Enable cURL and OpenSSL Extensions

#### 🪟 Windows (XAMPP/WAMP)

1. **Locate your `php.ini` file:**

    - XAMPP: `C:\xampp\php\php.ini`
    - WAMP: `C:\wamp64\bin\php\php8.x.x\php.ini`

2. **Open `php.ini` in a text editor (as Administrator)**

3. **Enable extensions by removing the semicolon (`;`):**
    ```ini
    ; Find these lines and uncomment them:
    extension=curl
    extension=openssl
    ```

#### 🍎 macOS

```bash
# Check if extensions are enabled
php -m | grep -E 'curl|openssl'

# If not installed, use Homebrew
brew install curl openssl
```

#### 🐧 Linux (Ubuntu/Debian)

```bash
# Install cURL and OpenSSL
sudo apt-get update
sudo apt-get install php-curl php-openssl

# Restart Apache/PHP-FPM
sudo systemctl restart apache2
# OR
sudo systemctl restart php8.2-fpm
```

### 🔒 Step 2: Download and Configure CA Certificate Bundle

To fix SSL certificate errors (especially for Facebook API), you need to configure the CA certificate bundle:

#### 1️⃣ **Download cacert.pem**

```bash
# Download the latest CA certificate bundle
curl -o cacert.pem https://curl.se/ca/cacert.pem
```

Or download manually from: [https://curl.se/ca/cacert.pem](https://curl.se/ca/cacert.pem)

#### 2️⃣ **Save the certificate file**

- **Windows XAMPP:** `C:\xampp\php\extras\ssl\cacert.pem`
- **Windows WAMP:** `C:\wamp64\bin\php\php8.x.x\extras\ssl\cacert.pem`
- **macOS/Linux:** `/usr/local/etc/openssl/cacert.pem`

#### 3️⃣ **Update `php.ini` configuration**

Open your `php.ini` file and add/update these lines:

```ini
[curl]
; A default value for the CURLOPT_CAINFO option.
curl.cainfo = "C:\xampp\php\extras\ssl\cacert.pem"

[openssl]
; The location of a Certificate Authority (CA) file on the local filesystem
openssl.cafile = "C:\xampp\php\extras\ssl\cacert.pem"
```

**For Linux/macOS:**

```ini
curl.cainfo = "/usr/local/etc/openssl/cacert.pem"
openssl.cafile = "/usr/local/etc/openssl/cacert.pem"
```

#### 4️⃣ **Restart your web server**

```bash
# XAMPP - Restart Apache from Control Panel

# Linux
sudo systemctl restart apache2
# OR
sudo systemctl restart nginx
sudo systemctl restart php8.2-fpm

# macOS (Homebrew)
brew services restart php
```

### ✅ Step 3: Verify Configuration

Run these commands to verify cURL and OpenSSL are properly configured:

```bash
# Check if extensions are loaded
php -m | grep -E 'curl|openssl'

# Test cURL
php -r "echo (function_exists('curl_version') ? 'cURL is enabled' : 'cURL is disabled');"

# Test OpenSSL
php -r "echo (extension_loaded('openssl') ? 'OpenSSL is enabled' : 'OpenSSL is disabled');"

# Check CA certificate path
php -r "echo ini_get('curl.cainfo');"
php -r "echo ini_get('openssl.cafile');"
```

### 🔧 Troubleshooting

<details>
<summary><b>❌ Error: "cURL error 60: SSL certificate problem"</b></summary>

**Solution:**

1. Ensure you've downloaded the latest `cacert.pem` file
2. Verify the path in `php.ini` is correct and points to the `cacert.pem` file
3. Restart your web server after making changes
4. Check file permissions (the PHP process must be able to read the file)

**Temporary workaround for development only:**

```php
// In your .env file (NOT for production!)
CURL_VERIFY_SSL=false
```

</details>

<details>
<summary><b>🚫 Error: "Call to undefined function curl_init()"</b></summary>

**Solution:**

1. Verify cURL extension is enabled in `php.ini`
2. Restart web server
3. Check `php -m | grep curl` to confirm it's loaded
4. On Linux: `sudo apt-get install php-curl`
 </details>

<details>
<summary><b>⚠️ Error: "SSL operation failed with code 1"</b></summary>

**Solution:**

1. Update OpenSSL to the latest version
2. Ensure both `curl.cainfo` and `openssl.cafile` are set in `php.ini`
3. Verify the `cacert.pem` file is not corrupted (re-download if necessary)
 </details>

<details>
<summary><b>🔍 How to find the correct `php.ini` file</b></summary>

```bash
# Command line
php --ini

# Or create a test file
echo "<?php phpinfo(); ?>" > info.php
# Then visit: http://localhost/info.php
# Look for "Loaded Configuration File"

# preferred modifications
upload_max_filesize = 2G
max_file_uploads = 50
memory_limit = 2G
post_max_size = 3G
```

</details>

### 📝 Additional Notes

- ⚠️ **Never disable SSL verification in production** - Only use `verify => false` for local development
- 🔄 **Update cacert.pem regularly** - CA certificates are updated periodically
- 🔐 **Keep your PHP version updated** - Newer versions have better SSL/TLS support
- 📊 **Monitor your logs** - Check `storage/logs/laravel.log` for SSL-related errors

---

## 📄 Ghostscript PDF Optimizer Setup

Ghostscript is used to optimize and compress PDF files in the application for better performance and reduced storage.

### 📦 Installation

#### 📚 Laravel PDF Optimizer Package

First, install the Laravel PDF Optimizer package:

```bash
# Install via Composer
composer require mostafaznv/pdf-optimizer
```

**Package Features:**

- ✅ Automatic PDF compression
- ✅ Quality optimization
- ✅ Batch processing support
- ✅ Laravel integration
- ✅ Chainable methods

**Documentation:** [https://github.com/mostafaznv/pdf-optimizer](https://github.com/mostafaznv/pdf-optimizer)

#### 🪟 Windows

1. **Download Ghostscript:**

    - Visit: [https://www.ghostscript.com/download/gsdnld.html](https://www.ghostscript.com/download/gsdnld.html)
    - Download the latest Windows installer (e.g., `gs10.06.0w64.exe` for 64-bit)

2. **Run the installer:**

    - Follow the installation wizard
    - Default installation path: `C:\Program Files\gs\gs10.06.0\bin`

3. **Add Ghostscript to System PATH:**

    - Right-click on "This PC" → **Properties**
    - Click **"Advanced system settings"**
    - Click **"Environment Variables"**
    - Under "System variables", find and select **"Path"**
    - Click **"Edit"** → **"New"**
    - Add: `C:\Program Files\gs\gs10.06.0\bin` (adjust version number if different)
    - Click **"OK"** on all dialogs

4. **Verify installation:**
    ```bash
    gswin64c --version
    ```

#### 🍎 macOS

1. **Install using Homebrew:**

    ```bash
    brew install ghostscript
    ```

2. **Verify installation:**
    ```bash
    gs --version
    ```

#### 🐧 Linux (Ubuntu/Debian)

1. **Install via apt:**

    ```bash
    sudo apt-get update
    sudo apt-get install ghostscript
    ```

2. **Verify installation:**
    ```bash
    gs --version
    ```

### ⚙️ Configuration

Add Ghostscript and temporary directory paths to your `.env` file:

#### 🪟 **Windows Configuration:**

```env
# Ghostscript Binary Path (adjust version number to match your installation)
PDF_OPTIMIZER_BIN_PATH="C:\\Program Files\\gs\\gs10.06.0\\bin\\gswin64c.exe"

# Temporary Directory for PDF Processing
TEMP="C:\\Users\\LENOVO\\Desktop\\Capstone\\PUPCON\\storage\\app\\public\\temp"
TMP="C:\\Users\\LENOVO\\Desktop\\Capstone\\PUPCON\\storage\\app\\public\\temp"
PDF_OPTIMIZER_TEMP_PATH="C:\\Users\\LENOVO\\Desktop\\Capstone\\PUPCON\\storage\\app\\public\\temp"
```

> ⚠️ **Important:** Replace `C:\\Users\\LENOVO\\Desktop\\Capstone\\PUPCON` with your actual project path.

#### 🍎 **macOS Configuration:**

```env
# Ghostscript Binary Path
PDF_OPTIMIZER_BIN_PATH="/usr/local/bin/gs"

# Temporary Directory for PDF Processing
TEMP="/path/to/your/project/storage/app/public/temp"
TMP="/path/to/your/project/storage/app/public/temp"
PDF_OPTIMIZER_TEMP_PATH="/path/to/your/project/storage/app/public/temp"
```

#### 🐧 **Linux Configuration:**

```env
# Ghostscript Binary Path
PDF_OPTIMIZER_BIN_PATH="/usr/bin/gs"

# Temporary Directory for PDF Processing
TEMP="/path/to/your/project/storage/app/public/temp"
TMP="/path/to/your/project/storage/app/public/temp"
PDF_OPTIMIZER_TEMP_PATH="/path/to/your/project/storage/app/public/temp"
```

### 📁 Create Temporary Directory

Ensure the temporary directory exists and has proper permissions:

```bash
# Windows (PowerShell)
New-Item -ItemType Directory -Force -Path "storage\app\public\temp"

# Linux/macOS
mkdir -p storage/app/public/temp
chmod 755 storage/app/public/temp
```

> 💡 **Note:** If not set, the application will attempt to auto-detect the Ghostscript installation and use system temp directories.

### 💻 Usage Examples

The PDF optimizer can be used in your Laravel application:

```php
use Mostafaznv\PdfOptimizer\Pdf;

// Basic optimization
Pdf::optimize('path/to/input.pdf')
    ->save('path/to/output.pdf');

// With quality settings
Pdf::optimize('path/to/input.pdf')
    ->quality(150) // DPI
    ->save('path/to/output.pdf');

// Chain multiple operations
Pdf::optimize('path/to/input.pdf')
    ->quality(150)
    ->grayscale()
    ->save('path/to/output.pdf');
```

### 🎯 Automatic Usage

The PDF optimizer is automatically used when:

- 📤 Uploading supporting documents
- 📊 Generating reports
- 📁 Processing accreditation files

PDF files are compressed to reduce file size while maintaining quality (150 DPI for screen viewing).

### 🔧 Troubleshooting

<details>
<summary><b>❌ Error: "Ghostscript not found"</b></summary>

**Solution:**

- Verify installation: Run `gs --version` or `gswin64c --version`
- Check PATH environment variable includes Ghostscript bin directory
- Verify `PDF_OPTIMIZER_BIN_PATH` in `.env` points to correct executable
- Restart your terminal/command prompt after modifying PATH
- On Windows, you may need to restart your computer

**Windows - Check installation path:**

```powershell
Get-Command gswin64c
```

**Linux/macOS - Check installation path:**

```bash
which gs
```

</details>

<details>
<summary><b>🚫 Error: "Permission denied" or "Access denied"</b></summary>

**Solution:**

- On Linux/macOS: Check file permissions
    ```bash
    sudo chmod +x /usr/bin/gs
    chmod 755 storage/app/public/temp
    ```
- On Windows: Run as Administrator or check folder permissions
- Ensure the temp directory exists and is writable
  </details>

<details>
<summary><b>⚠️ Compression not working</b></summary>

**Solution:**

- Check storage permissions in `storage/app/public/temp`
- Ensure sufficient disk space
- Verify `PDF_OPTIMIZER_TEMP_PATH` is correct
- Review Laravel logs in `storage/logs/laravel.log`
- Test Ghostscript manually:
  ```bash # Windows
  "C:\Program Files\gs\gs10.06.0\bin\gswin64c.exe" --version

        # Linux/macOS
        gs --version
        ```

    </details>

<details>
<summary><b>📦 Package installation issues</b></summary>

**Solution:**

```bash
# Clear Composer cache
composer clear-cache

# Remove vendor directory and reinstall
rm -rf vendor
composer install

# If still having issues, update Composer
composer self-update
composer require mostafaznv/pdf-optimizer --with-all-dependencies
```

</details>

<details>
<summary><b>🔍 How to find your Ghostscript installation path</b></summary>

**Windows:**

```powershell
# Check registry
Get-ItemProperty HKLM:\Software\GPL\Ghostscript\*

# Or search in Program Files
Get-ChildItem "C:\Program Files" -Recurse -Filter gswin64c.exe
```

**Linux/macOS:**

```bash
# Find Ghostscript binary
which gs

# Or search manually
find / -name gs 2>/dev/null
```

</details>

### 📊 Optimization Settings

The application uses the following Ghostscript settings for PDF optimization:

| Setting            | Value      | Description                  |
| ------------------ | ---------- | ---------------------------- |
| 🎨 **Device**      | `pdfwrite` | PDF output device            |
| 📏 **Resolution**  | `150 DPI`  | Optimized for screen viewing |
| 🗜️ **Compression** | `JPEG`     | Image compression method     |
| 🎯 **Quality**     | `High`     | Balances size and quality    |

### 📝 Additional Notes

- ⚡ **Automatic cleanup** - Temporary files are deleted after processing
- 💾 **Storage optimization** - Original files are replaced with compressed versions
- 🔒 **Security** - Temp directory is isolated and regularly cleaned
- 📈 **Performance** - Reduces file sizes by up to 70% on average
- ⚠️ **Version compatibility** - Tested with Ghostscript 10.x (latest recommended)
- 📦 **Laravel Package** - Uses [mostafaznv/pdf-optimizer](https://github.com/mostafaznv/pdf-optimizer) for seamless integration

---

## 👥 Team

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/AgustinUno">
        <img src="https://github.com/AgustinUno.png" width="80" alt="Justine"/><br>
        <sub><b>🎯 Justine Bautista</b></sub><br>
        <sub>📋 Project Manager</sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/regiesanjuan">
        <img src="https://github.com/regiesanjuan.png" width="80" alt="Regie"/><br>
        <sub><b>📄 Regie San Juan</b></sub><br>
        <sub>💻 Data Integrator</sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/tammygeronimo">
        <img src="https://github.com/tammygeronimo.png" width="80" alt="Tamara"/><br>
        <sub><b>🧪 Tamara Geronimo</b></sub><br>
        <sub>🔍 QA Tester</sub>
      </a>
    </td>
  </tr>
  <tr>
    <td align="center">
      <a href="https://github.com/pulge">
        <img src="https://github.com/pulge.png" width="80" alt="Mark"/><br>
        <sub><b>🎨 Mark Fulguerinas</b></sub><br>
        <sub>💻 Frontend Developer</sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/1101101011">
        <img src="https://github.com/1101101011.png" width="80" alt="Charles"/><br>
        <sub><b>🗄️ Charles Ilarde</b></sub><br>
        <sub>🔧 Database Admin</sub>
      </a>
    </td>
  </tr>
</table>

---

<div align="center">

**💝 Made with ❤️ by PUP San Juan Team**

[![⬆️ Back to Top](https://img.shields.io/badge/⬆️-Back_to_Top-blue?style=flat-square)](#-pupcon)

</div>
