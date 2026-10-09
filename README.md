# DevBrain Studio

A local learning workspace for aspiring software engineers, built with Laravel, React, and Tailwind. Lessons, code-review practice, tech-stack notes, projects, and progress are stored in MySQL.

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

   To enable natural-language answers in the floating assistant, optionally add a Gemini API key. If omitted, the assistant still performs local MySQL keyword search and returns clickable snippet links:

   ```dotenv
   GEMINI_API_KEY=your_key_here
   GEMINI_MODEL=gemini-3.8-flash
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

The app saves the whole local workspace to MySQL through Laravel. A browser-local cache is kept as a fallback if MySQL is temporarily unavailable. JSON export and restore are also available from the app.

## Features

- Beginner-friendly software engineering lessons.
- Interactive code-review practice with a rubric and explanations.
- Searchable stack library and multi-stack snippet cards, including optional small image uploads.
- Project notes and practice evidence for interview preparation.
- Progress summaries and backup/restore.
- Floating deep-search assistant with clickable links to matching snippets.
- Optional Gemini answers grounded in matching notes from the local library.

## AI API

Gemini is optional. Without `GEMINI_API_KEY`, the floating assistant uses local keyword search. When configured, the user's question and matching snippets are sent from Laravel to Gemini for a grounded answer. Keep secrets and private code out of saved snippets if you do not want them sent to the configured provider.
