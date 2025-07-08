🎵 Spotify Web API Controller – Setup & Usage Guide
This project is a web app built using JavaScript and the Spotify Web API. It allows you to control your Spotify playback (play, pause, next, shuffle, device switch, etc.) directly from the browser.

⚠️ Note: Spotify Premium account is required for playback control features (play, pause, shuffle, etc.).

🛠️ Step-by-Step Setup
✅ 1. Create a Spotify Developer Account
Visit: https://developer.spotify.com/dashboard

Log in using your Spotify account.

Click "Create an App".

Fill in:

App name: Spotify Web Controller (or anything you like)

Description: Web-based Spotify player controller using Spotify Web API

Accept the terms and create the app.

🔑 2. Set Redirect URI
Open your created app → click "Edit Settings".

In the Redirect URIs field, add:

For local testing:

arduino
Copy
Edit
http://127.0.0.1:5500/index.html
For GitHub Pages (replace with your actual GitHub username and repo):

arduino
Copy
Edit
https://your-github-username.github.io/SpotifyWebAPI/
Click Add and then Save.

📥 3. Clone or Download This Repository
bash
Copy
Edit
git clone https://github.com/your-username/SpotifyWebAPI.git
cd SpotifyWebAPI
Or just Download ZIP and extract it.

🌐 4. Host the Project
Choose one of the following:

Option A: Run Locally (Using VS Code + Live Server)
Install Live Server extension in VS Code.

Open this project folder in VS Code.

Open index.html and right-click → Open with Live Server.

Your project should run on:

arduino
Copy
Edit
http://127.0.0.1:5500/index.html
Option B: Deploy on GitHub Pages
Push the project to a GitHub repository.

Go to Repo → Settings → Pages.

Under "Source", choose the branch (main) and folder (/root or /docs).

Click Save.

Access your hosted app at:

arduino
Copy
Edit
https://your-username.github.io/SpotifyWebAPI/
🧪 5. Run the App
Open the app in your browser.

Enter your:

Client ID and Client Secret (from Spotify Developer Dashboard).

Click Request Authorization.

You will be redirected to Spotify login screen → allow permissions.

You’ll return to the app where you can:

See your devices

Select playlists

Play, pause, shuffle, skip, etc.

⚠️ Important Notes
🔐 Client Secret is only stored in localStorage. For production apps, NEVER expose it on frontend.

🔁 Tokens are automatically refreshed using the refresh token mechanism.

🔒 Playback control only works with Spotify Premium.

🎧 Make sure Spotify is running on at least one device before using this app.

📚 APIs Used
https://accounts.spotify.com/authorize

https://accounts.spotify.com/api/token

https://api.spotify.com/v1/me/player/play

https://api.spotify.com/v1/me/player/pause

https://api.spotify.com/v1/me/player/next

https://api.spotify.com/v1/me/player/devices

https://api.spotify.com/v1/me/playlists

and more...

💡 Features
🎵 Control Spotify playback (Play, Pause, Next, Prev)

🔁 Shuffle songs

🎧 Switch between Spotify-connected devices

📜 View and select from your playlists

🎨 View current track name, artist, and album art

💾 Save your favorite device+playlist combos as buttons

