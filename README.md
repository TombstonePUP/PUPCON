# PUP SANJUAN Accreditation Website

This repository contains the code and resources for the **PUP SANJUAN Accreditation Website**, designed to handle file server management for accreditation purposes at **Polytechnic University of the Philippines - San Juan Campus**.

## Table of Contents
1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Installation](#installation)
4. [Usage](#usage)
5. [Technologies Used](#technologies-used)
6. [Team](#team)
7. [Contributing](#contributing)
8. [License](#license)

## Project Overview
The PUP SANJUAN Accreditation Website allows seamless file server handling for accreditation documents, making it easier for administrators to manage and submit files efficiently. It ensures that all accreditation files are stored in a centralized location with easy access and secure storage.

## Features
- File upload and download functionality.
- User authentication for secure access.
- Search functionality for retrieving specific files.
- Admin panel for managing user permissions and overseeing file activities.
- Easy-to-navigate user interface for both admins and users.

## Installation
1. Clone the repository:
    ```bash
    # Clone with HTTPS
    git clone https://github.com/TombstonePUP/PUPCON.git
    # Clone with SSH
    git clone git@github.com:TombstonePUP/PUPCON.git
    ```
2. Navigate to the project directory:
    ```bash
    cd PUPCON
    ```
3. Install dependencies for node modules:
    ```bash
    npm install
    ```
4. Install dependencies for composer:
    ```bash
    composer install
    ```
5. Copy the `.env.example` file and rename it to `.env`:
    ```bash
    cp .env.example .env
    ```
6. Update the `.env` file with your database credentials:
    ```bash
    DB_USERNAME=your-username (usually postgres)
    ```
7. Migrate the project database:
    ```bash
    php artisan migrate
    ```
8. Generate Key Encryotion for Laravel:
    ```bash
    php artisan key:generate
    ```
<!-- 7. Fresh migrate the project database:
    ```bash
    php artisan migrate:fresh
    ```
8. Seed the project database to populate the tables for users and programs:
    ```bash
    php artisan db:seed
    ``` -->
7. Start the server for laravel:
    ```bash
    php artisan serve
    ```
8. Start the server for node:
    ```bash
    npm run dev
    ```
9. Unblocking ports:
    ```bash
    netstat -a -n -o | find ":portnumber" or netstat -a -n -o | find ":3306" [get the pidNumber]
    ```
10. Killing the process:
    ```bash
    taskkill /PID pidNumber /F 
    ```

## Testing
1. Go to `http://localhost:8000` in your browser.

## Technologies Used
- **Frontend:** HTML, CSS, Tailwind CSS, JavaScript, Vue.js
- **Backend:** Laravel
- **Database:** MariaDB / MySQL
- **Authentication:** JWT (JSON Web Token)
- **File Storage:** Cloudinary / Local File System

## Team
- **Justine Bautista** - Project Manager
- **Regie San Juan** - Document Analyst/ Programmer
- **Tamara Geronimo** - Document Analyst/ Quality Assurance Tester
- **Mark Fulguerinas** - Programmer/ Designer
- **Charles Ilarde** - Database Administrator/ Programmer

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
