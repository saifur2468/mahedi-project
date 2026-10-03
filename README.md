# English Sikho

## Run the app and API

1. Install Node.js 22.5 or newer.
2. In the project folder, open a terminal and run `npm start`. Keep this
   terminal open while using the app.
3. Open a web browser (Chrome or Edge) and type `http://localhost:3000` in the
   browser's address bar. Do not type the URL as a PowerShell command. If you
   want to open it from PowerShell, run `Start-Process "http://localhost:3000"`.
   Do not open the HTML files directly or use a separate static Live Server.

The site root and `/index.html` require a valid login session. New visitors are
sent to the login page; use **Register Now** to create an account first.
Choose a 3-30 character username (English letters, numbers, or underscores) or
use an email address as the username. Registration returns to the login page
with a success message, and only a successful login opens the dashboard.
Logging out revokes the server session.

The API stores account profiles, scrypt password hashes, and revocable login
sessions in `data/english-sikho.sqlite`. Passwords are never stored as plain
text. Keep the `data` folder private and back it up to preserve accounts.

For local verification, run `npm test`.

To let other devices use the same accounts, deploy this Node app to a host that
supports Node.js and persistent disk storage. A temporary or ephemeral hosting
filesystem can erase the SQLite database when the app restarts. Set `HOST=0.0.0.0`
for a container host and `COOKIE_SECURE=true` when TLS terminates at a reverse
proxy.
