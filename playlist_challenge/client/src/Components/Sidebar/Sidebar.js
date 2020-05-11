import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Sidebar.css';

const CREATE_PLAYLIST = gql`
  mutation CreatePlaylist($name:String! ){
    createPlaylist( name:$name ){  
    id
    name
    songs
  }
}
`
class Sidebar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showButton: true,
            showInput: false,
            notify: false,
            playlistName: ''
        }
    }
    createPlaylist = () => {
        this.setState({ showButton: false, showInput: true });
    }
    onChange = (event) => {
        this.setState({ playlistName: event.target.value });
    }
    loadPlaylist = (index) => {
        this.props.selectedPlaylist(index);
    }
    effects = () => {
        this.props.playlistChanged();
        this.notify();
    }
    notify = () => toast.info("Playlist successfully created");
    render() {
        const playlists = this.props.playlists;
        const playlist_names = playlists.map((playlist, index) =>
            <li key={playlist.name + index} onClick={() => this.loadPlaylist(index)}> {playlist.name}</li>
        )

        return (
            <Mutation mutation={CREATE_PLAYLIST}>
                {(createPlaylist) => (
                    <div className="sidenav" >
                        <div className="playlists">
                            <a href="#"><i className="fa fa-music"></i>Playlists</a>
                            <ul> {playlist_names} </ul>
                        </div>
                        <div className="createPlaylist">
                            {this.state.showButton &&
                                <button className="createPlaylistBtn" onClick={this.createPlaylist}>
                                    <i className="fa fa-plus"></i>
                                    <span><strong>Create Playlist</strong></span>
                                </button>}
                            {this.state.showInput && <div className="createPlaylistControls">
                                <input autoFocus type="text" placeholder="Enter playlist name" value={this.state.playlistName}
                                    onChange={this.onChange} onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            createPlaylist({ variables: { name: this.state.playlistName } });
                                            this.setState({ showButton: true, showInput: false, notify: true, playlistName: '' });
                                            this.effects();
                                        }
                                    }} />
                            </div>}
                            <ToastContainer position="top-left" hideProgressBar={true} />
                        </div>
                    </div>
                )}
            </Mutation >
        )
    }
}

export default Sidebar;