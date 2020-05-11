import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import Header from './Components/Header/Header';
import Sidebar from './Components/Sidebar/Sidebar';
import Content from './Components/Content/Content';
import Playlist from './Components/Playlist-x/Playlist';
import Song from './Components/Song/Song';
import Player from './Components/Player/Player';
import './App.css';

const restApi = 'http://localhost:5001/playlist';

class App extends Component {
  constructor() {
    super();
    this.state = {
      selectedPlaylist: -1,
      filtered: false,
      filteredSongs: [],
      playlists: []
    }
  }
  loadPlaylist = () => {
    fetch(restApi)
      .then(response => response.json())
      .then(response => {
        this.setState({ playlists: response });
      })
      .catch(error => console.log(error));
  }
  componentDidMount() {
    this.loadPlaylist();
  }
  selectedPlaylist = (id) => {
    this.setState({ selectedPlaylist: id, filtered: false });
  }
  playlistChanged = () => {
    this.loadPlaylist();
  }
  filteredSongs = (songs) => {
    this.setState({ filteredSongs: songs, selectedPlaylist: -1, filtered: true });
  }
  render() {
    const playlists = this.state.playlists;
    return (
      <div className="App" >
        <Header filteredSongs={this.filteredSongs} />
        <Sidebar playlists={playlists} selectedPlaylist={this.selectedPlaylist} playlistChanged={this.playlistChanged} />
        <div className="song-player">
          <Player />
        </div>
        <Router>
          <Switch>
            <Route exact path="/" component={() => <Content playlists={playlists} selectedPlaylist={this.state.selectedPlaylist} filteredSongs={this.state.filteredSongs} filtered={this.state.filtered} />} />
            <Route exact path="/Playlist" component={Playlist} />
            <Route exact path="/Song" component={Song} />
          </Switch>
        </Router>
      </div>
    )
  }
}
export default App;
