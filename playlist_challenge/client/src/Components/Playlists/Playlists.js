 

import React, { Component } from 'react';
import { Query } from 'react-apollo'
import gql from 'graphql-tag'

const PLAYLISTS_QUERY = gql`
{
    playlists {
      playlists{
        name
      }
    }
  }  
`

class Playlists extends Component {
    constructor(props) {
        super(props);
        this.state = {
            playlists: [
                {
                    "name": "Ryan's Megamix 2012"
                },
                {
                    "name": "Hi"
                },
                {
                    "name": "Test"
                },
                {
                    "name": "Ali Alizada"
                },
                {
                    "name": "Hola"
                },
                {
                    "name": "Justin playlist"
                },
                {
                    "name": "Jay"
                }
            ]
        }
    }
    render() {
        return (
            <Query query={PLAYLISTS_QUERY}>
                {({ loading, error, data }) => {
                    if (loading) return <div>Fetching</div>
                    if (error) return <div>Error</div>

                    const playlists = data.playlists.playlists;
                    const playlist_names = playlists.map(playlist => <li>{playlist.name}</li>)

                    return (
                        playlists
                        // <div className="sidenav">
                        //     <div className="playlists">
                        //         <a href="#">
                        //             <i className="fa fa-music"></i>  Playlists  </a>
                        //         <ul>
                        //             {playlist_names} 
                        //         </ul>
                        //     </div>
                        // </div>
                    )
                }}
            </Query>
        );
    }
}

export default Playlists;