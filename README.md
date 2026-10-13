# DevBrain Studio

A local development workspace for managing tech stacks and reusable code snippets, built using Laravel, React, and Tailwind CSS. It uses MySQL to store workspace data and supports browser-based backups, along with JSON data export and restoration.

## XAMPP setup

1. Start **MySQL** in the XAMPP Control Panel.
2. In phpMyAdmin, create a database named `devbrain_studio` using `utf8mb4`.
3. In `.env`, configure the MySQL connection (XAMPP's default local settings are shown below):

   ```dotenv
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=devbrain_studio
   DB_USERNAME=root
   DB_PASSWORD=
   ```

4. Install dependencies if needed, then run the database migrations and build the frontend once:

   ```powershell
   composer install
   npm install
   php artisan migrate
   npm run build
   ```

5. Start the web app:

   ```powershell
   php artisan serve
   ```

Open the local address printed by Artisan, usually `http://127.0.0.1:8000`. After the one-time asset build, `php artisan serve` is all you need to launch the app. Run `npm run build` again after changing React or CSS files.

## Features

- Explore tech stacks organized by category.
- Create and find snippet cards organized within a stack.
- Add an optional image to any snippet or stack.
- Modify the home banner image to your liking. 
- Track saved snippet and stack totals, and back up or restore your data using JSON files.
____________________________________________________________________________________________________________________________ 
