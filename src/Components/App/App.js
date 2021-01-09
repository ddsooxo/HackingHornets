import React from "react";
import "./App.css";
import SearchBar from "../SearchBar/ SearchBar";
import Playlist from "../Playlist/Playlist";
import SearchResults from "../SearchResults/SearchResults";
import Spotify from "../../util/Spotify";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
      playlistName: "Your Playlist",
      playlistTracks: [],
    };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }
  addTrack(newTrack) {
    let isDuplicate = false;
    this.state.playlistTracks.forEach((track) => {
      if (track.id === newTrack.id) {
        isDuplicate = true;
      }
    });
    if (!isDuplicate) {
      console.log("Track added: " + newTrack.name);
      this.state.playlistTracks.push(newTrack);
    }
    this.setState({ playlistTracks: this.state.playlistTracks });
  }
  removeTrack(trackToRemove) {
    let isFound = false;
    this.state.playlistTracks.forEach((track) => {
      if (track.id === trackToRemove.id) {
        isFound = true;
      }
    });
    if (isFound) {
      console.log("Track Removed: " + trackToRemove.name);
      this.state.playlistTracks.pop(trackToRemove);
    }
    this.setState({ playlistTracks: this.state.playlistTracks });
  }
  updatePlaylistName(newName) {
    this.setState({ playlistName: newName });
  }
  savePlaylist() {
    const trackURIs = this.state.playlistTracks.map((track) => track.uri);
    Spotify.savePlaylist(this.state.playlistName, trackURIs).then(() => {
      this.setState({
        // We have saved the playlist and now must clear it
        playlistName: 'New Playlist',
        playlistTracks: []
      })
    });

  }
  search(criteria) {
    Spotify.search(criteria).then((searchResults) => {
      this.setState({ searchResults: searchResults });
    });
  }
  updateSearchResults() {}
  render() {
    return (
      <div>
        <h1>
          Ja<span className="highlight">mmm</span>ing
        </h1>
        <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults
              searchResults={this.state.searchResults}
              onAdd={this.addTrack}
            />
            <Playlist
              playlistName={this.state.playlistName}
              playlistTracks={this.state.playlistTracks}
              onRemove={this.removeTrack}
              onNameChange={this.updatePlaylistName}
              onSave={this.savePlaylist}
            />
          </div>
        </div>
      </div>
    );
  }
}
export default App;
