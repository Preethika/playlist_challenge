import React, { Component } from 'react';
import { Redirect } from 'react-router';
import './Songs.css';

class Songs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            toSongPanel: false
        }
    }
    getSong = (id) => {
        this.setState({ toSongPanel: true, id: id })
    }

    render() {
        var randomColor = Math.floor(Math.random()*16777215).toString(16);
        const style = {
            background: `#${randomColor}`,
            background: `-webkit-radial-gradient(center, #${randomColor}, #e4e6ed)`,
            background: `-moz-radial-gradient(center, #${randomColor}, #e4e6ed)`,
            background: `radial-gradient(ellipse at center, #${randomColor}, #e4e6ed)`
        };

        if (this.state.toSongPanel === true) {
            return <Redirect to={{
                pathname: "/Song",
                state: { song: this.state.id, playlists: this.props.playlists }
            }} />
        }
        return (
            <>
                <div className="songs">
                    <div className="content-title">{this.props.title} ({this.props.list.length})</div>
                    <div className="cards">
                        {this.props.list && this.props.list.map((song) => (
                            <div key={song.id} className="card" onClick={() => {
                                this.getSong(song.id);
                            }}>
                                <div style={style} className="card-img"></div>
                                <div className="container">
                                    <span className="card-title"><b>{song.title}</b></span>
                                    <span className="card-duration">{song.duration}</span>
                                    <p className="card-album">{song.album}</p>
                                    <p className="card-artist">- {song.artist}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </>
        );
    }
}

export default Songs;