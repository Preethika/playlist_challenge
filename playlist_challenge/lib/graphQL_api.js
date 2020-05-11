var path = require('path');
var express = require('express');
var expressGraphql = require('express-graphql');
var graphql = require('graphql');
var slashes = require('connect-slashes');
var cors = require('cors');
var async = require('asyncawait');
var Songs = require('./songs');

var STATIC_DIR = path.join(__dirname, '../client/build');

module.exports = function createApp(options) {
    var library = new Songs(path.join(__dirname, '..', 'data'));

    var app = express();
    app.use(express.logger());
    app.use(express.bodyParser());
    app.use(express.static(STATIC_DIR));
    app.use(slashes(false));

    app.use(cors());

    const schema = graphql.buildSchema(`
        type Song {
            album : String!,
            duration : String!,
            title : String!,
            id : Int!,
            artist : String!
        }
        type Playlist {
            id : Int!,
            name : String!,
            songs : [Int]
        }
        type PlaylistWithSongs{
            id : Int!,
            name : String!,
            songs : [Song]
        }
        type Library {
            songs : [Song]
        }
        type Playlists {
            playlists : [Playlist]
        } 
        type Query {
            songs : Library,
            song(id : Int!) : Song,
            songFilter(key : String!) : Library,
            playlists : Playlists,
            playlist(id : Int!) : PlaylistWithSongs
        }
        type Mutation {
            createPlaylist(name: String!) : Playlist,
            editPlaylist(id:Int!, name:String!, song: Int!) : Playlist,
        }
    `);

    const rootResolver = {
        //getLibrary
        songs: () => {
            var data = library.getLibrary();
            return { songs: data };
        },
        //getSong
        song: (data) => {
            var id = parseInt(data.id, 10);
            data = library.getSong(id);
            return { album: data.album, duration: data.duration, title: data.title, id: data.id, artist: data.artist };
        },
        //getPlaylists - return in the format {playlists : <data>}
        playlists: (data) => {

            library.getPlaylists(function (err, playlists) {
                console.log('playlists - ', playlists);
                return { playlists: playlists }; //if we return in this line this will go the callback in songs.js(line 99)
            });

            // // below commented line is working fine
            // let playlists = [{ "id": 4, "name": "Ali Alizada", "songs": [31, 56, 1, 7, 0] },
            // { "id": 5, "name": "Ali Alizada1", "songs": [7, 0] }];
            // return { playlists: playlists };
        },
        //getPlaylist
        playlist: (data) => {
            var id = parseInt(data.id, 10);
            data = library.getPlaylist(id);
            var songs = library.getLibrary();
            var result = [];
            for (let i = 0; i < data.songs.length; i++) {
                for (let j = 0; j < songs.length && j < 40; j++) {
                    if (data.songs[i] == songs[j].id) {
                        result.push(songs[i]);
                    }
                }
            }
            return { id: data.id, name: data.name, songs: result };
        },
        //createPlaylist
        createPlaylist: (data) => {
            var name = data.name;
            var songs = [];
            library.savePlaylist(null, name, songs, function (err, id) {
                return { id: id, name: name, songs: songs };
            });
        },
        //editPlaylist
        editPlaylist: (data) => {
            var id = data.id;
            var name = data.name
            var song = data.song
            var songs = library.getPlaylist(id).songs;
            var isError = false;

            if (!songs.includes(song)) {
                songs = [...songs, song];
                library.savePlaylist(id, name, songs, function (err, id) {
                    if (err) isError = true;
                });
            }
            if (!isError)
                return { id: id, name: name, songs: songs };
            return null;
        },
        // songFilter
        songFilter: (data) => {
            var allSongs = library.getLibrary();
            var filteredSongs = [];
            filteredSongs = allSongs.filter(song => {
                let title = song.title.toLowerCase();
                let album = song.album.toLowerCase();
                let artist = song.artist.toLowerCase();
                let key = data.key.toLowerCase();

                if (title.includes(key) || album.includes(key) || artist.includes(key)) {
                    return true;
                }
            })
            return { songs: filteredSongs };
        }
    };

    app.use('/graphql', expressGraphql({
        schema: schema,
        rootValue: rootResolver,
        graphiql: true
    }));
    return app;
};
