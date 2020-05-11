import React, { Component } from 'react';
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import Popup from '../Popup/Popup';
import './Song.css';


class Song extends Component {
    constructor(props) {
        super(props);
        this.state = {
            song_id: this.props.location.state.song,
            playlists: this.props.location.state.playlists,
            showPopup: false
        }
    }
    togglePopup = () => {
        this.setState({
            showPopup: !this.state.showPopup
        });
    }
    render() {
        const SONG_QUERY = gql`
        {
            song(id: ${this.state.song_id}) {
                album
                duration
                title
                id
                artist
            }
        }  
        `
        return (
            <Query query={SONG_QUERY}>
                {({ loading, error, data }) => {
                    if (loading) return <div>Fetching</div>
                    if (error) return <div>Error</div>
                    const song = data.song;
                    return (
                        <div className="">
                            <div className="song">
                                <div className="card">
                                    <div className="card-img"></div>
                                    <div className="container" onClick={this.togglePopup}><i className="fa fa-plus"></i></div>
                                    {this.state.showPopup ?
                                        <Popup
                                            text='Choose Playlist'
                                            closePopup={this.togglePopup}
                                            content={this.state.playlists}
                                            song={this.state.song_id}
                                        />
                                        : null
                                    }
                                </div>
                                <div className="details">
                                    <span className="card-title"><b>{song.title}</b></span>
                                    <span className="card-duration">{song.duration}</span>
                                    <p className="card-artist">- {song.artist}</p>
                                    <p className="card-album">{song.album}</p>
                                    <button className="play">Play</button>
                                </div>
                            </div>
                        </div>
                    )
                }}
            </Query>
        );
    }
}

export default Song;