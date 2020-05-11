import React, { Component } from 'react';
import './Player.css';

class Player extends Component {
    render() {
        return (
            <div className="player">
                <span className="song-title"></span>
                <audio controls>
                    <source src="horse.ogg" type="audio/ogg" />
                    <source src="horse.mp3" type="audio/mpeg" />
                            Your browser does not support the audio element.
                </audio>
            </div>
        );
    }
}

export default Player;