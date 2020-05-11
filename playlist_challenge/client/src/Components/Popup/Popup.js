import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ADD_TO_PLAYLIST = gql`
  mutation editPlaylist($id:Int!, $name:String!, $song:Int!){
    editPlaylist(id:$id, name:$name, song:$song){  
    id
    name
    songs
  }
}
`
class Popup extends Component {
    closePopup = () => {
        this.props.closePopup();
    }
    notify = () => toast.info("Song added to playlist");
    render() {
        return (<Mutation mutation={ADD_TO_PLAYLIST}>
            {(editPlaylist) => (
                <div className='popup'>
                    <div className='popup_inner'>
                        <div className="header">
                            <h3>{this.props.text}</h3>
                            <span className="close" onClick={this.closePopup}><i className="fa fa-times"></i></span>
                        </div>
                        <div className="choosePlaylist">
                            <ul>
                                {this.props.content.map(playlist => (
                                    <li key={playlist.id} onClick={() => {
                                        editPlaylist({ variables: { id: playlist.id, name: playlist.name, song: this.props.song } });
                                        this.notify();
                                        this.closePopup();
                                    }}> {playlist.name}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <ToastContainer position="top-left" hideProgressBar={true} />
                </div>
            )}
        </Mutation>
        );
    }
}
export default Popup;
