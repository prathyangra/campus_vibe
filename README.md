# CampusVibe - College Events and Student Registration Portal
Tagline: Discover. Participate. Celebrate.

Technologies: HTML5, CSS3, Bootstrap 5 (CDN), Vanilla JavaScript, Browser LocalStorage.

## Folder structure
CampusVibe/
- index.html, events.html, event-details.html, login.html, register.html, my-registrations.html, clubs.html, contact.html
- css/style.css
- js/data.js (events + clubs), main.js (navbar, footer, helpers, favourites, home), auth.js, events.js, registration.js, contact.js
- images/ (optional; posters are generated with CSS gradients and emoji)

## How to run
1. Unzip the folder and open it in VS Code.
2. Install the "Live Server" extension.
3. Right-click index.html and choose "Open with Live Server".
(An internet connection is needed for Bootstrap and Google Fonts CDN links.)

## Demo login
Email: aarav@campus.edu   Password: Demo@123

## Testing checklist
1. Home: countdown runs, stats animate, category cards open filtered events.
2. Events: search by name, click each category chip, combine both, search "zzz" for the empty message, press Esc to clear.
3. Click the heart while logged out (asks to log in); log in and try again; refresh and confirm it persists.
4. Register page: submit empty, bad name (Aar4v), bad email, weak password, mismatched passwords; then register a new student.
5. Login: empty fields, wrong password, correct login, show/hide password, remember me.
6. Event details: Register Now logged out redirects to login; logged in shows a confirm modal; registering twice is blocked.
7. Event 7 (full) and event 10 (closed) must have disabled buttons.
8. My Registrations: counts update, Cancel asks for confirmation, favourites can be removed.
9. Contact: validation, success message, character counter. Check DevTools > Application > Local Storage.
10. Resize to mobile width: the navbar collapses into a menu.

## Security note
Login uses LocalStorage with plain-text passwords for demonstration only. It is NOT secure and must not be used in production.

## Academic summary
CampusVibe is a multi-page, responsive college event portal. HTML5 semantic elements (header, nav, main, section, article, aside, footer), lists (ordered and nested), tables and forms structure the pages. CSS3 (external, internal-style attributes, Flexbox, Grid via Bootstrap, gradients, transitions, animations, media queries) provides the design. JavaScript handles dynamic rendering, regular-expression validation, array methods (filter, find, map), DOM events (click, input, keydown, onmouseover, onmouseout), and JSON persistence in LocalStorage. Bootstrap supplies the navbar, grid, cards, forms, alerts, modals, toasts and utilities.
