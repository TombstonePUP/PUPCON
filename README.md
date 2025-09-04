<div align="center">

# 🎓 PUP San Juan Accreditation Website

**A comprehensive file server management system for accreditation processes at Polytechnic University of the Philippines - San Juan Campus**

[![Laravel](https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)](https://laravel.com)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)

[🚀 Live Demo](http://localhost:8000) • [📖 Documentation](#documentation) • [🐛 Report Bug](https://github.com/TombstonePUP/PUPCON/issues) • [💡 Request Feature](https://github.com/TombstonePUP/PUPCON/issues)

</div>

---

## 📋 Table of Contents

- [🎯 Project Overview](#-project-overview)
- [✨ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [🚀 Installation](#-installation)
- [🔧 Usage](#-usage)
- [🧪 Testing](#-testing)
- [👥 Team](#-team)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## 🎯 Project Overview

The **PUP San Juan Accreditation Website** is a robust, secure file management system designed specifically for handling accreditation documents and processes at the Polytechnic University of the Philippines - San Juan Campus.

This system streamlines the entire accreditation workflow, from document upload and organization to collaborative review and final submission, ensuring compliance with institutional standards and accreditation body requirements.

### 🎯 Key Objectives

- Centralized document management for accreditation processes
- Secure file storage with role-based access control
- Streamlined collaboration between faculty and administrators
- Automated workflow management for accreditation submissions
- Real-time progress tracking and reporting

---

## ✨ Features

### 📂 **Document Management**

- **File Upload & Download** - Secure file handling with progress indicators
- **Document Versioning** - Track changes and maintain document history
- **Bulk Operations** - Upload, download, and manage multiple files simultaneously
- **File Organization** - Categorize documents by areas, parameters, and criteria
- **Search & Filter** - Advanced search functionality with multiple filters

### 👥 **User Management & Authentication**

- **Role-Based Access Control** - Admin, Coordinator, Area Designee, and Viewer roles
- **Secure Authentication** - JWT-based authentication with session management
- **User Profiles** - Comprehensive user management with profile customization
- **Permission Management** - Granular control over user access and capabilities

### 📊 **Accreditation Workflow**

- **Program Management** - Organize documents by academic programs
- **Area Assessment** - Structured assessment areas with parameters
- **Progress Tracking** - Real-time progress monitoring and reporting
- **Collaborative Review** - Multi-user document review and approval workflow
- **Exhibit Management** - Specialized handling of accreditation exhibits

### 🎨 **User Experience**

- **Responsive Design** - Optimized for desktop, tablet, and mobile devices
- **Dark/Light Mode** - Customizable appearance settings
- **Interactive Dashboard** - Real-time analytics and progress visualization
- **Document Viewer** - Built-in PDF and document preview functionality
- **Notification System** - Real-time alerts and updates

### 🔒 **Security & Compliance**

- **Data Encryption** - End-to-end encryption for sensitive documents
- **Audit Trail** - Comprehensive logging of all user activities
- **Backup & Recovery** - Automated backup with disaster recovery
- **Compliance Monitoring** - Built-in compliance checks and validation

---

## 🛠️ Tech Stack

### **Frontend**

- **[React 18](https://reactjs.org)** - Modern UI library with hooks and concurrent features
- **[TypeScript](https://www.typescriptlang.org)** - Type-safe JavaScript for better development experience
- **[Inertia.js](https://inertiajs.com)** - Full-stack framework bridging backend and frontend
- **[Tailwind CSS](https://tailwindcss.com)** - Utility-first CSS framework for rapid styling
- **[Framer Motion](https://www.framer.com/motion/)** - Production-ready motion library for React
- **[Lucide React](https://lucide.dev)** - Beautiful & consistent icon library

### **Backend**

- **[Laravel 10](https://laravel.com)** - Elegant PHP web application framework
- **[PHP 8.2+](https://www.php.net)** - Modern PHP with latest features and performance improvements
- **[Sanctum](https://laravel.com/docs/sanctum)** - Laravel's lightweight API authentication

### **Database & Storage**

- **[PostgreSQL](https://www.postgresql.org)** - Advanced open-source relational database
- **[Cloudinary](https://cloudinary.com)** - Cloud-based media management (optional)
- **Local File System** - Secure local file storage option

### **Development & Build Tools**

- **[Vite](https://vitejs.dev)** - Next-generation frontend build tool
- **[Composer](https://getcomposer.org)** - PHP dependency management
- **[npm](https://www.npmjs.com)** - Package manager for JavaScript dependencies

---

## 🚀 Installation

### **Prerequisites**

- PHP 8.2 or higher
- Node.js 18 or higher
- PostgreSQL 13 or higher
- Composer 2.x
- Git

### **Step 1: Clone the Repository**

```bash
# Clone with HTTPS
git clone https://github.com/TombstonePUP/PUPCON.git

# Or clone with SSH
git clone git@github.com:TombstonePUP/PUPCON.git

# Navigate to project directory
cd PUPCON
```

### **Step 2: Install Dependencies**

```bash
# Install PHP dependencies
composer install

# Install Node.js dependencies
npm install
```

### **Step 3: Environment Configuration**

```bash
# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate
```

### **Step 4: Database Setup**

Update your `.env` file with database credentials:

```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=pupcon_db
DB_USERNAME=your-username
DB_PASSWORD=your-password
```

```bash
# Create database (if not exists)
createdb pupcon_db

# Run migrations
php artisan migrate

# Seed the database with sample data
php artisan db:seed
```

### **Step 5: Start Development Servers**

```bash
# Terminal 1: Start Laravel development server
php artisan serve

# Terminal 2: Start Vite development server
npm run dev
```

🎉 **Your application is now running at [http://localhost:8000](http://localhost:8000)**

---

## 🔧 Usage

### **Default User Accounts**

| Role              | Email                  | Password       | Access Level         |
| ----------------- | ---------------------- | -------------- | -------------------- |
| **Coordinator**   | `test@example.com`     | `password@123` | Full system access   |
| **Area Designee** | `keithlee@example.com` | `password@456` | Area-specific access |

### **Quick Start Guide**

1. **Login** to the system using the credentials above
2. **Navigate** to the dashboard to view available programs
3. **Upload Documents** by selecting the appropriate area and parameter
4. **Manage Users** (Coordinator only) through the user management panel
5. **Track Progress** using the built-in analytics dashboard

---

## 🧪 Testing

### **Manual Testing**

1. Open your browser and go to `http://localhost:8000`

</div>[⬆ Back to Top](#-pup-san-juan-accreditation-website)**Made with ❤️ by the PUP San Juan Development Team**<div align="center">---This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.## 📄 License---- Update documentation as needed- Write tests for new features- Use TypeScript for all new frontend code- Follow PSR-12 coding standards for PHP### **Development Guidelines**5. **Open** a Pull Request4. **Push** to the branch (`git push origin feature/amazing-feature`)3. **Commit** your changes (`git commit -m 'Add some amazing feature'`)2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)1. **Fork** the repositoryWe welcome contributions! Please follow these steps:## 🤝 Contributing---</table>  </tr>    </td>      <sub>Database Administrator / Programmer</sub>      <sub><b>Charles Ilarde</b></sub><br>      <img src="https://github.com/charlesilarde.png" width="100px;" alt="Charles Ilarde"/><br>    <td align="center">    </td>      <sub>Programmer / Designer</sub>      <sub><b>Mark Fulguerinas</b></sub><br>      <img src="https://github.com/markfulguerinas.png" width="100px;" alt="Mark Fulguerinas"/><br>    <td align="center">  <tr>  </tr>    </td>      <sub>Document Analyst / QA Tester</sub>      <sub><b>Tamara Geronimo</b></sub><br>      <img src="https://github.com/tamaragrading.png" width="100px;" alt="Tamara Geronimo"/><br>    <td align="center">    </td>      <sub>Document Analyst / Programmer</sub>      <sub><b>Regie San Juan</b></sub><br>      <img src="https://github.com/regiesanjuan.png" width="100px;" alt="Regie San Juan"/><br>    <td align="center">    </td>      <sub>Project Manager</sub>      <sub><b>Justine Bautista</b></sub><br>      <img src="https://github.com/justinebautista.png" width="100px;" alt="Justine Bautista"/><br>    <td align="center">  <tr><table>## 👥 Team---```php artisan test --coverage# Run with coveragenpm run test# Run frontend testsphp artisan test# Run PHP unit tests```bash### **Running Automated Tests**5. Test document viewer and search features4. Verify role-based access controls3. Test file upload/download functionality2. Login with the provided test credentials2. Login with the provided test credentials
3. Test file upload/download functionality
4. Verify role-based access controls
5. Test document viewer and search features

### **Running Automated Tests**

```bash
# Run PHP unit tests
php artisan test

# Run frontend tests
npm run test

# Run with coverage
php artisan test --coverage
```

---

## 👥 Team

<table>
  <tr>
    <td align="center">
      <img src="https://github.com/justinebautista.png" width="100px;" alt="Justine Bautista"/><br>
      <sub><b>Justine Bautista</b></sub><br>
      <sub>Project Manager</sub>
    </td>
    <td align="center">
      <img src="https://github.com/regiesanjuan.png" width="100px;" alt="Regie San Juan"/><br>
      <sub><b>Regie San Juan</b></sub><br>
      <sub>Document Analyst / Programmer</sub>
    </td>
    <td align="center">
      <img src="https://github.com/tamaragrading.png" width="100px;" alt="Tamara Geronimo"/><br>
      <sub><b>Tamara Geronimo</b></sub><br>
      <sub>Document Analyst / QA Tester</sub>
    </td>
  </tr>
  <tr>
    <td align="center">
      <img src="https://github.com/markfulguerinas.png" width="100px;" alt="Mark Fulguerinas"/><br>
      <sub><b>Mark Fulguerinas</b></sub><br>
      <sub>Programmer / Designer</sub>
    </td>
    <td align="center">
      <img src="https://github.com/charlesilarde.png" width="100px;" alt="Charles Ilarde"/><br>
      <sub><b>Charles Ilarde</b></sub><br>
      <sub>Database Administrator / Programmer</sub>
    </td>
  </tr>
</table>

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add some amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### **Development Guidelines**

- Follow PSR-12 coding standards for PHP
- Use TypeScript for all new frontend code
- Write tests for new features
- Update documentation as needed

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Made with ❤️ by the PUP San Juan Development Team**

[⬆ Back to Top](#-pup-san-juan-accreditation-website)

</div>
