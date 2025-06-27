# PUP SANJUAN Accreditation Website

This repository contains the code and resources for the **PUP SANJUAN Accreditation Website**, designed to handle file server management for accreditation purposes at **Polytechnic University of the Philippines - San Juan Campus**.

## Table of Contents

1. [Project Overview](#project-overview)
2. [Technologies Used](#technologies-used)
3. [Features](#features)
4. [Installation](#installation)
5. [Usage](#usage)
6. [Team](#team)
7. [Contributing](#contributing)
8. [License](#license)

## Project Overview

The PUP SANJUAN Accreditation Website allows seamless file server handling for accreditation documents, making it easier for administrators to manage and submit files efficiently. It ensures that all accreditation files are stored in a centralized location with easy access and secure storage.

## Technologies Used

- **Frontend:** HTML, CSS, SCSS, Tailwind CSS, JavaScript, React.js
- **Backend:** Laravel
- **Database:** PostGres
- **Authentication:** JWT (JSON Web Token)
- **File Storage:** Cloudinary / Local File System

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

5. Generate Key Encryption for Laravel:

    ```bash
    php artisan key:generate
    ```

6. Copy the `.env.example` file and rename it to `.env`:

    ```bash
    cp .env.example .env
    ```

7. Update the `.env` file with your database credentials:

    ```bash
    DB_USERNAME=your-username (usually postgres)
    ```

8. Migrate the project database:

    ```bash
    php artisan migrate
    ```

9. Fresh migrate the project database:

    ```bash
    php artisan migrate:fresh
    ```

10. Seed the project database to populate the tables for users and programs:

    ```bash
    php artisan db:seed
    ```

11. Start the server for laravel:

    ```bash
    php artisan serve
    ```

12. Start the server for node:

    ```bash
    npm run dev
    ```

## Testing

1. Go to `http://localhost:8000` in your browser.
2. Login with 
    for Coordinator email: <test@example.com> and password: password@123
    for Area Designee <keithlee@example.com> and password: password@456

## Team

- **Justine Bautista** - Project Manager
- **Regie San Juan** - Document Analyst/ Programmer
- **Tamara Geronimo** - Document Analyst/ Quality Assurance Tester
- **Mark Fulguerinas** - Programmer/ Designer
- **Charles Ilarde** - Database Administrator/ Programmer

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
