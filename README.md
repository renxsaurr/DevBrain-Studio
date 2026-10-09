# DevBrain Studio

A local developer workspace for organizing tech stacks and reusable code notes, built with Laravel, React, and Tailwind. Workspace data is stored in MySQL, with a browser-local backup and JSON export/restore.

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

- Browse tech stacks by category.
- Create and search snippet cards within a stack.
- Attach an optional image to a snippet or stack.
- Change the home banner image.
- View saved snippet and stack counts, and export or restore a JSON backup.
