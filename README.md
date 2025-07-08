# 🎵 Spotify Web API Controller

A responsive web app built using **JavaScript**, **HTML**, and the **Spotify Web API** that allows users to control their Spotify playback from the browser.

> ⚠️ **Note**: A **Spotify Premium** account is required for playback control features (play, pause, shuffle, skip, etc.).

---

## 🌟 Features

- 🎵 Play, pause, skip, shuffle Spotify tracks  
- 🔁 Switch between connected Spotify devices  
- 📜 View and choose from your Spotify playlists  
- 🎨 View current track title, artist name, and album art  
- 💾 Save and reuse quick device+playlist combinations  
- 🔐 Secure authorization using Client ID & Client Secret  
- 🔓 Logout functionality to clear session and reset

---

## 🛠️ Step-by-Step Setup

### ✅ 1. Create a Spotify Developer App

1. Visit: [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Log in with your Spotify account
3. Click **Create an App**
4. Fill in the details:
   - **App Name**: `Spotify Web Controller` (or anything you like)
   - **Description**: `Web-based Spotify controller using Spotify Web API`
5. Agree to terms and click **Create**

---

### 🔑 2. Set Redirect URI

Go to your app → **Edit Settings** → under **Redirect URIs**, add:

#### For local testing:

http://127.0.0.1:5500/index.html

graphql
Copy
Edit

#### For GitHub Pages deployment (replace `your-username`):

https://your-username.github.io/Spotify-Web-API/

yaml
Copy
Edit

Click **Add** and then **Save**.

---

### 📥 3. Clone or Download the Repository

#### Option A: Clone via Git

```bash
git clone https://github.com/your-username/Spotify-Web-API.git
cd Spotify-Web-API
```
Option B: Download ZIP
Click the green Code button

Choose Download ZIP

Extract the folder and open it

🌐 4. Run the App
Option A: Run Locally (with Live Server)
Open the folder in VS Code

Install the Live Server extension

Right-click index.html → Open with Live Server

Access:
http://127.0.0.1:5500/index.html

Option B: Deploy to GitHub Pages
Push your project to GitHub

Go to Repo → Settings → Pages

Under Source, choose:

Branch: main

Folder: / (root)

Click Save

Your live app will be at:
```
https://your-username.github.io/Spotify-Web-API/
```

🚀 How to Use
Open the app in your browser

Enter your Client ID and Client Secret

Click Request Authorization

Log in with Spotify and allow permissions

Once redirected:

Select a device

Pick a playlist

Use playback controls (Play, Pause, Next, Shuffle)

Save quick-access buttons for device+playlist combos

Click Logout to clear session


🔐 Authorization Flow

Implements Authorization Code Flow with Refresh Token

Tokens are stored securely in localStorage (for demo only)

Automatically refreshes tokens when expired

Client Secret is never shared with backend


📦 APIs Used

https://accounts.spotify.com/authorize

https://accounts.spotify.com/api/token

https://api.spotify.com/v1/me/player/devices

https://api.spotify.com/v1/me/player/play

https://api.spotify.com/v1/me/player/pause

https://api.spotify.com/v1/me/player/next

https://api.spotify.com/v1/me/player/previous

https://api.spotify.com/v1/me/playlists

https://api.spotify.com/v1/playlists/{playlist_id}/tracks

https://api.spotify.com/v1/me/player/currently-playing


🧼 Logout Functionality

Clears all stored values:

client_id

client_secret

access_token

refresh_token

Redirects back to login page with cleared session


📄 License

This project is licensed under the MIT License


🙌 Acknowledgements

Spotify Developer Documentation

Bootstrap 5

MDN Web Docs - JavaScript
