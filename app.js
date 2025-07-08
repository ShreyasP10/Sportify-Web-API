var redirect_uri = window.location.href.includes('localhost') 
    ? "http://localhost:5500/index.html" 
    : "https://my-awesome-app.vercel.app"; 

var client_id = "";
var client_secret = "";
var access_token = null;
var refresh_token = null;
var currentPlaylist = "";
var radioButtons = [];
var shuffleState = false;

// API Endpoints
const AUTHORIZE = "https://accounts.spotify.com/authorize";
const TOKEN = "https://accounts.spotify.com/api/token";
const PLAYLISTS = "https://api.spotify.com/v1/me/playlists";
const DEVICES = "https://api.spotify.com/v1/me/player/devices";
const PLAY = "https://api.spotify.com/v1/me/player/play";
const PAUSE = "https://api.spotify.com/v1/me/player/pause";
const NEXT = "https://api.spotify.com/v1/me/player/next";
const PREVIOUS = "https://api.spotify.com/v1/me/player/previous";
const PLAYER = "https://api.spotify.com/v1/me/player";
const TRACKS = "https://api.spotify.com/v1/playlists/{{PlaylistId}}/tracks";
const CURRENTLYPLAYING = "https://api.spotify.com/v1/me/player/currently-playing";
const SHUFFLE = "https://api.spotify.com/v1/me/player/shuffle";

// DOM Ready
function onPageLoad() {
    client_id = localStorage.getItem("client_id") || "";
    client_secret = localStorage.getItem("client_secret") || "";
    
    document.getElementById("clientId").value = client_id;
    document.getElementById("clientSecret").value = client_secret;

    if (window.location.search.length > 0) {
        handleRedirect();
    } else {
        access_token = localStorage.getItem("access_token");
        if (!access_token) {
            document.getElementById("tokenSection").style.display = 'block';
        } else {
            showDeviceSection();
        }
    }
    refreshRadioButtons();
}

function showDeviceSection() {
    document.getElementById("tokenSection").style.display = 'none';
    document.getElementById("deviceSection").style.display = 'block';
    refreshDevices();
    refreshPlaylists();
    currentlyPlaying();
}

// Authorization Flow
function handleRedirect() {
    const code = getCode();
    if (code) {
        fetchAccessToken(code);
        window.history.pushState("", "", redirect_uri);
    }
}

function getCode() {
    const queryString = window.location.search;
    if (queryString.length > 0) {
        const urlParams = new URLSearchParams(queryString);
        return urlParams.get('code');
    }
    return null;
}

function requestAuthorization() {
    client_id = document.getElementById("clientId").value.trim();
    client_secret = document.getElementById("clientSecret").value.trim();
    
    if (!client_id || !client_secret) {
        showMessage("Please enter both Client ID and Client Secret", "danger");
        return;
    }

    localStorage.setItem("client_id", client_id);
    localStorage.setItem("client_secret", client_secret);

    let url = AUTHORIZE;
    url += "?client_id=" + client_id;
    url += "&response_type=code";
    url += "&redirect_uri=" + encodeURIComponent(redirect_uri);
    url += "&show_dialog=true";
    url += "&scope=user-read-private user-read-email user-modify-playback-state user-read-playback-position user-library-read streaming user-read-playback-state user-read-recently-played playlist-read-private";
    
    window.location.href = url;
}

function fetchAccessToken(code) {
    const body = new URLSearchParams();
    body.append('grant_type', 'authorization_code');
    body.append('code', code);
    body.append('redirect_uri', redirect_uri);
    body.append('client_id', client_id);
    body.append('client_secret', client_secret);

    callAuthorizationApi(body);
}

function refreshAccessToken() {
    refresh_token = localStorage.getItem("refresh_token");
    if (!refresh_token) {
        showMessage("No refresh token available", "danger");
        return;
    }

    const body = new URLSearchParams();
    body.append('grant_type', 'refresh_token');
    body.append('refresh_token', refresh_token);
    body.append('client_id', client_id);

    callAuthorizationApi(body);
}

function callAuthorizationApi(body) {
    fetch(TOKEN, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(client_id + ":" + client_secret)
        },
        body: body
    })
    .then(response => response.json())
    .then(data => handleAuthorizationResponse(data))
    .catch(error => {
        console.error('Authorization error:', error);
        showMessage("Authorization failed: " + error.message, "danger");
    });
}

function handleAuthorizationResponse(data) {
    if (data.access_token) {
        access_token = data.access_token;
        localStorage.setItem("access_token", access_token);
        
        if (data.refresh_token) {
            refresh_token = data.refresh_token;
            localStorage.setItem("refresh_token", refresh_token);
        }
        
        showMessage("Authorization successful!", "success");
        setTimeout(showDeviceSection, 1000);
    } else {
        console.error('Authorization error:', data);
        showMessage("Authorization failed: " + (data.error_description || "Unknown error"), "danger");
    }
}

// API Functions
function callApi(method, url, body, callback) {
    const headers = {
        'Authorization': 'Bearer ' + access_token
    };
    
    if (body && typeof body !== 'string') {
        headers['Content-Type'] = 'application/json';
        body = JSON.stringify(body);
    }

    fetch(url, {
        method: method,
        headers: headers,
        body: body
    })
    .then(response => {
        if (response.status === 204) return null;
        return response.json();
    })
    .then(data => callback(data, null))
    .catch(error => callback(null, error));
}

// Device Management
function refreshDevices() {
    callApi("GET", DEVICES, null, handleDevicesResponse);
}

function handleDevicesResponse(data, error) {
    if (error) return handleApiError(error);
    if (!data) return;
    
    removeAllItems("devices");
    data.devices.forEach(item => addDevice(item));
}

function addDevice(item) {
    const node = document.createElement("option");
    node.value = item.id;
    node.textContent = `${item.name} (${item.type})`;
    document.getElementById("devices").appendChild(node);
}

// Playlist Management
function refreshPlaylists() {
    callApi("GET", PLAYLISTS, null, handlePlaylistsResponse);
}

function handlePlaylistsResponse(data, error) {
    if (error) return handleApiError(error);
    if (!data) return;
    
    removeAllItems("playlists");
    data.items.forEach(item => addPlaylist(item));
}

function addPlaylist(item) {
    const node = document.createElement("option");
    node.value = item.id;
    node.textContent = `${item.name} (${item.tracks.total})`;
    document.getElementById("playlists").appendChild(node);
}

// Track Management
function fetchTracks() {
    const playlist_id = document.getElementById("playlists").value;
    if (!playlist_id) {
        showMessage("Please select a playlist first", "warning");
        return;
    }
    
    const url = TRACKS.replace("{{PlaylistId}}", playlist_id);
    callApi("GET", url, null, handleTracksResponse);
}

function handleTracksResponse(data, error) {
    if (error) return handleApiError(error);
    if (!data) return;
    
    removeAllItems("tracks");
    data.items.forEach((item, index) => addTrack(item, index));
}

function addTrack(item, index) {
    const node = document.createElement("option");
    node.value = index;
    node.textContent = `${item.track.name} - ${item.track.artists[0].name}`;
    document.getElementById("tracks").appendChild(node);
}

// Playback Controls
function play() {
    const playlist_id = document.getElementById("playlists").value;
    const trackindex = document.getElementById("tracks").value;
    const album = document.getElementById("album").value.trim();
    
    let body = {};
    if (album) {
        body.context_uri = album;
    } else if (playlist_id) {
        body.context_uri = `spotify:playlist:${playlist_id}`;
    } else {
        showMessage("Please select a playlist or enter album URI", "warning");
        return;
    }
    
    if (trackindex) {
        body.offset = { position: Number(trackindex) };
    }
    
    callApi("PUT", `${PLAY}?device_id=${deviceId()}`, body, handleApiResponse);
}

function toggleShuffle() {
    shuffleState = !shuffleState;
    callApi("PUT", `${SHUFFLE}?state=${shuffleState}&device_id=${deviceId()}`, null, handleApiResponse);
    document.querySelector('.btn-warning').textContent = shuffleState ? 'Shuffle ON' : 'Shuffle OFF';
}

function pause() {
    callApi("PUT", `${PAUSE}?device_id=${deviceId()}`, null, handleApiResponse);
}

function next() {
    callApi("POST", `${NEXT}?device_id=${deviceId()}`, null, handleApiResponse);
}

function previous() {
    callApi("POST", `${PREVIOUS}?device_id=${deviceId()}`, null, handleApiResponse);
}

function transfer() {
    const deviceId = document.getElementById("devices").value;
    if (!deviceId) {
        showMessage("No device selected", "warning");
        return;
    }
    
    callApi("PUT", PLAYER, { device_ids: [deviceId], play: true }, handleApiResponse);
}

// Player State
function currentlyPlaying() {
    callApi("GET", `${PLAYER}?market=US`, null, handleCurrentlyPlayingResponse);
}

function handleCurrentlyPlayingResponse(data, error) {
    if (error) return handleApiError(error);
    
    const albumImg = document.getElementById("albumImage");
    const trackTitle = document.getElementById("trackTitle");
    const trackArtist = document.getElementById("trackArtist");
    
    if (!data || !data.item) {
        albumImg.src = "";
        trackTitle.textContent = "-";
        trackArtist.textContent = "-";
        return;
    }
    
    // Update track info
    albumImg.src = data.item.album.images[0]?.url || "";
    trackTitle.textContent = data.item.name;
    trackArtist.textContent = data.item.artists.map(a => a.name).join(", ");
    
    // Update shuffle state
    if (data.shuffle_state !== undefined) {
        shuffleState = data.shuffle_state;
        document.querySelector('.btn-warning').textContent = shuffleState ? 'Shuffle ON' : 'Shuffle OFF';
    }
    
    // Update device selection
    if (data.device) {
        document.getElementById('devices').value = data.device.id;
    }
    
    // Update playlist selection
    if (data.context?.uri) {
        const uriParts = data.context.uri.split(":");
        if (uriParts.length > 2 && uriParts[1] === "playlist") {
            currentPlaylist = uriParts[2];
            document.getElementById('playlists').value = currentPlaylist;
        }
    }
}

// Quick Access Buttons
function saveNewRadioButton() {
    const labelInput = document.getElementById("buttonLabel");
    const label = labelInput.value.trim();
    
    if (!label) {
        showMessage("Please enter a button label", "warning");
        return;
    }
    
    const deviceId = document.getElementById("devices").value;
    const playlistId = document.getElementById("playlists").value;
    
    if (!deviceId || !playlistId) {
        showMessage("Please select both a device and playlist", "warning");
        return;
    }
    
    radioButtons.push({
        label: label,
        deviceId: deviceId,
        playlistId: playlistId
    });
    
    localStorage.setItem("radio_buttons", JSON.stringify(radioButtons));
    refreshRadioButtons();
    labelInput.value = "";
    showMessage("Button saved!", "success");
}

function refreshRadioButtons() {
    const savedButtons = localStorage.getItem("radio_buttons");
    const container = document.getElementById("radioButtons");
    container.innerHTML = "";
    
    if (savedButtons) {
        try {
            radioButtons = JSON.parse(savedButtons);
            radioButtons.forEach((btn, index) => {
                addRadioButton(btn, index);
            });
        } catch (e) {
            console.error("Error parsing radio buttons:", e);
        }
    }
}

function addRadioButton(btn, index) {
    const button = document.createElement("button");
    button.className = "btn btn-outline-info";
    button.textContent = btn.label || `Button ${index + 1}`;
    button.onclick = () => onRadioButton(btn.deviceId, btn.playlistId);
    document.getElementById("radioButtons").appendChild(button);
}

function onRadioButton(deviceId, playlistId) {
    callApi("PUT", `${PLAY}?device_id=${deviceId}`, {
        context_uri: `spotify:playlist:${playlistId}`
    }, handleApiResponse);
}

// Utilities
function deviceId() {
    return document.getElementById("devices").value;
}

function removeAllItems(elementId) {
    const container = document.getElementById(elementId);
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
}

function handleApiResponse(data, error) {
    if (error) return handleApiError(error);

    if (data?.error) {
        showMessage(`API Error: ${data.error.message}`, "danger");

        // ✅ Check for expired session
        if (data?.error?.status === 401) {
            showMessage("Session expired. Logging out...", "warning");
            setTimeout(logout, 1500);
            return;
        }

    } else {
        setTimeout(currentlyPlaying, 1000);
    }
}

function handleApiError(error) {
    console.error("API Error:", error);
    const message = error?.message || "Unknown error occurred";
    
    if (error?.status === 401) {
        showMessage("Session expired. Refreshing token...", "warning");
        refreshAccessToken();
    } else {
        showMessage(`Error: ${message}`, "danger");
    }
}

function showMessage(text, type) {
    const messageArea = document.getElementById("messageArea");
    messageArea.textContent = text;
    messageArea.className = `alert alert-${type}`;
    messageArea.style.display = 'block';
    
    setTimeout(() => {
        messageArea.style.display = 'none';
    }, 5000);
}

function logout() {
    localStorage.removeItem("client_id");
    localStorage.removeItem("client_secret");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("radio_buttons");

    showMessage("Logged out successfully", "info");

    setTimeout(() => {
        window.location.href = redirect_uri;
    }, 1000);
}
