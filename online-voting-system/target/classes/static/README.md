# Online Voting System — Frontend (Admin/User split + Pie Chart Results)

## Files in this package

- index.html   -> Landing page: choose Admin or User
- admin.html   -> Create poll form + read-only poll list (admin only)
- admin.js     -> Logic for admin.html
- user.html    -> View polls + vote + pie chart results (user only)
- user.js      -> Logic for user.html (includes Chart.js pie chart)
- style.css    -> Shared styling for all pages

## How to Install (Recommended — served by Spring Boot)

1. Copy ALL 6 files in this folder directly into:
   src/main/resources/static/
   (create the "static" folder inside "resources" if it doesn't exist)

2. Delete any old index.html / script.js that were there before, so there's
   no conflict with these new files.

3. Restart your Spring Boot app in Eclipse.

4. Open your browser to:
   http://localhost:8080/

   You'll land on the Admin/User selection page.

## How to Install (Alternative — standalone, separate from backend)

1. Keep all 6 files together in one folder (e.g. voting-frontend/).
2. Run a local server pointed at that folder — for example:
   python -m http.server 5500
3. Open http://localhost:5500/ in your browser.
4. Make sure WebConfig.java (CORS) is still present in your Spring Boot
   project, since frontend and backend are on different ports this way.

## Notes

- The pie chart uses Chart.js, loaded from a CDN inside user.html — an
  internet connection in the browser is required for the chart to render.
- Admin's "Create Poll" page has no security — it's just hidden from the
  regular user flow via a separate HTML page, matching the "no login /
  no Spring Security" requirement for this mini project. Anyone who knows
  the direct URL (admin.html) or the API could still create polls.
