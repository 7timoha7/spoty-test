export interface ArtistsType {
  _id: string;
  name: string,
  image: string,
  desc: string,
  user: string,
  isPublished: boolean;
}

export interface ArtistsToServer {
  name: string,
  image: string,
  desc: string,
}

export interface AlbumsType {
  _id: string;
  name: string;
  artist: string;
  year: number;
  image: string;
  user: string;
  isPublished: boolean;
}

export interface AlbumsToServer {
  name: string;
  artist: string;
  year: number;
  image: string;
}

export interface AlbumsMutation {
  artist: ArtistsType,
  albums: AlbumsMutationNew[],
}

export interface AlbumsMutationNew {
  _id: string;
  name: string;
  artist: ArtistsType;
  year: number;
  image: string;
  isPublished: boolean;
  user: string;
}

export interface TrackType {
  _id: string;
  name: string;
  album: string;
  duration: string;
  trackNumber: number;
  videoId: string | null;
  user: string;
  isPublished: boolean;
}

export interface TrackToServer {
  name: string;
  album: string;
  duration: string;
  trackNumber: number;
  videoId: string;
}

export interface TrackMutationType {
  albumName: AlbumsMutationNew,
  trackAlbum: TrackType[],
}

export interface RegisterMutation {
  username: string;
  password: string;
  displayName: string;
  avatar: string;
}

export interface User {
  _id: string;
  username: string;
  token: string;
  role: string;
  displayName: string;
  avatar: string;
  googleId:string | null;
}

export interface RegisterResponse {
  message: string;
  user: User;
}

export interface ValidationError {
  errors: {
    [key: string]: {
      name: string;
      message: string;
    }
  },
  message: string;
  name: string;
  _name: string;
}

export interface LoginMutation {
  username: string;
  password: string;
}

export interface GlobalError {
  error: string;
}

export interface HistoryType {
  _id: string;
  track: {
    name: string;
    album: {
      artist: {
        name: string;
      }
    }
  };
  datetime: string;
}

export interface IPlay {
  id: string,
  status: boolean
}




