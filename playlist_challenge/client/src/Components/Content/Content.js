import React, { Component } from 'react';
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import Songs from '../Songs/Songs';
// import { connect } from 'react-redux';
// import { getAllSongs } from '../../redux/actions/actions';
import './Content.css';
import '../Header/Header.css';

const SONGS_QUERY = gql`
{
    songs {
      songs {
        album
        duration
        title
        id
        artist
      }
    }
  }  
`

class Content extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedPlaylist: false,
            filteredSongs: [],
            filtered: false
        }
    }
    static getDerivedStateFromProps(props) {
        return {
            selectedPlaylist: (props.selectedPlaylist == -1) ? false : true,
            filtered: props.filtered
        }
    }

    render() {
        let { selectedPlaylist, filtered } = this.state;
        const PLAYLIST_QUERY = gql`
        {
            playlist(id: ${this.props.selectedPlaylist}) {
              name
              id
              songs {
                album
                duration
                title
                id
                artist
              }
            }
          }
        `
        return (

            <>
                {filtered
                    && <Songs title="Songs" list={this.props.filteredSongs} playlists={this.props.playlists} />
                }
                {
                    !filtered && !selectedPlaylist &&
                    <Query query={SONGS_QUERY}>
                        {({ loading, error, data }) => {
                            if (loading) return <div>Fetching</div>
                            if (error) return <div>Error</div>

                            const songs = data.songs.songs;
                            return (
                                <div className="main">
                                    <div className="content">
                                        <Songs title="Library" list={songs} playlists={this.props.playlists} />
                                    </div>
                                </div>
                            )
                        }}
                    </Query>
                }
                {!filtered && selectedPlaylist &&
                    <Query query={PLAYLIST_QUERY}>
                        {({ loading, error, data }) => {
                            if (loading) return <div>Fetching</div>
                            if (error) return <div>Error</div>

                            const name = data.playlist.name;
                            const songs = data.playlist.songs;
                            return (
                                <Songs title={name} list={songs} playlists={this.props.playlists} />
                            )
                        }}
                    </Query>
                }

            </>
        );
    }
}
export default Content;