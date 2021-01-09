import SearchBar from "../Components/SearchBar/ SearchBar";

let accessToken;
const clientId = "0335937ef6834134836e9bcc43f5298d";

//const redirectUrl = "http://localhost:3000/"; /* Used during development stage */
const redirectUrl = "http://JammyLand.surge.sh";
const Spotify = {
  getAccessToken() {
    if (accessToken) {
      return accessToken;
    }
    const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);
    if (accessTokenMatch && expiresInMatch) {
      accessToken = accessTokenMatch[1];
      const expires_in = Number(expiresInMatch[1]);
      window.setTimeout(() => (accessToken = ""), expires_in * 1000);
      window.history.pushState("Access Token", null, "/");
      return accessToken;
    } else {
      const accessUrl =
        "https://accounts.spotify.com/authorize?client_id=" +
        clientId +
        "&response_type=token&scope=playlist-modify-public&redirect_uri=" +
        redirectUrl;
      window.location = accessUrl;
    }
  },
  search(criteria) {
    const accessToken = Spotify.getAccessToken();
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${criteria}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((Response) => {
        return Response.json();
      })
      .then((jsonResponse) => {
        if (!jsonResponse.tracks) {
          return [];
        }
        return jsonResponse.tracks.items.map((track) => ({
          id: track.id,
          name: track.name,
          artists: track.artists[0].name,
          album: track.album.name,
          uri: track.uri,
        }));
      });
  },
  savePlaylist(name, trackUris) {
    if (!name || !trackUris) {
      console.log("Invalid name or trackUri upon saving");
      return;
    }
    const accessToken = Spotify.getAccessToken();
    const headers = { Authorization: `Bearer ${accessToken}` };
    let userId;

    return fetch("https://api.spotify.com/v1/me", {
      headers: headers,
    })
      .then((response) => response.json())
      .then((jsonResponse) => {
        userId = jsonResponse.id;
        console.log(userId);
        return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
          headers: headers,
          method: "POST",
          body: JSON.stringify({ name: name }),
        });
      })
      .then((response) => response.json())
      .then((jsonResponse) => {
        const playlistId = jsonResponse.id;
        return fetch(
          `https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`,
          {
            headers: headers,
            method: "POST",
            body: JSON.stringify({ uris: trackUris }),
          }
        );
      });
  },
};
export default Spotify;
