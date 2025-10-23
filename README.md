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
[![Laravel](https://img.shields.io/badge/Laravel_10-FF2D20?style=flat-square&logo=laravel&logoColor=white)](https://laravel.com) [![PHP](https://img.shields.io/badge/PHP_8.2+-777BB4?style=flat-square&logo=php&logoColor=white)](https://www.php.net) [![Sanctum](https://img.shields.io/badge/Sanctum-FF2D20?style=flat-square&logo=laravel&logoColor=white)](https://laravel.com/docs/sanctum)

**Database** 🗄️  
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org)

**Tools** 🔧  
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev) [![Composer](https://img.shields.io/badge/Composer-885630?style=flat-square&logo=composer&logoColor=white)](https://getcomposer.org) [![npm](https://img.shields.io/badge/npm-CB3837?style=flat-square&logo=npm&logoColor=white)](https://www.npmjs.com)

---

## 🚀 Installation

### ⚡ Prerequisites

- 🐘 PHP 8.2+
- 🟢 Node.js 18+
- 🐘 PostgreSQL 13+
- 📦 Composer 2.x

### 📥 Setup

```bash
# 1️⃣ Clone repository
git clone https://github.com/TombstonePUP/PUPCON.git
cd PUPCON

# 2️⃣ Install dependencies
composer install
npm install

# 3️⃣ Environment setup
cp .env.example .env
php artisan key:generate

# 4️⃣ Database setup
createdb pupcon_db
php artisan migrate
php artisan db:seed

# 5️⃣ Start servers
php artisan serve    # Terminal 1
npm run dev         # Terminal 2
```

### 🔑 Default Accounts

| 👤 Role              | 📧 Email            | 🔐 Password    |
| -------------------- | ---------------------| -------------- |
| 🛡️ **Admin**   | `johndoe@admin.com`        | `admin@123` |
| 👨‍💼 **Chairman** | `keithlee@chairman.com`   | `chairman@123` |
| 👨‍💼 **Accreditor** | `keithlee@example.com`  | `accreditor@123` |

🎉 **App running at** [http://localhost:8000](http://localhost:8000)

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
        <sub>💻 Document Analyst</sub>
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
