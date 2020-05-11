import React, { Component } from 'react';
import gql from 'graphql-tag'
import { withApollo } from '@apollo/react-hoc';
import './Header.css';

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchKey: '',
            filteredSongs: []
        }
    }
    onChange = (event) => {
        this.setState({ searchKey: event.target.value });
    }
    searchSongs = () => {
        this.props.client.query({
            query: gql`
                {
                    songFilter (key : "${this.state.searchKey}") {
                      songs {
                        album
                        duration
                        title
                        id
                        artist
                      }
                    }
                  }           
                `,
        }).then(res => this.props.filteredSongs(res.data.songFilter.songs));
    }
    render() {
        return (
            <div className="menu">
                <a href="#"><i className="fa fa-2x fa-headphones logo"></i>
                    <span className="name">Musiq</span></a>

                <div className="search-container">
                    <input type="text" placeholder="Search.." name="search" value={this.state.searchKey} onChange={this.onChange} />
                    <button type="submit" onClick={this.searchSongs}><i className="fa fa-search"></i></button>
                </div>
            </div>
        )
    }
}

export default withApollo(Header);