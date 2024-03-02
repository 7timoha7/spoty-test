export interface ArtistToServer {
  name: string;
  image: string | null;
  desc: string | null;
  isPublished: boolean;
}

export interface AlbumToServer {
  name: string;
  artist: string;
  year: string;
  image: string | null;
  isPublished: boolean;
}

export interface AlbumOnServer {
  _id: string;
  name: string;
  artist: string;
  year: string;
  image: string | null;
}

export interface TrackToServer {
  name: string;
  album: string;
  duration: string;
  trackNumber: string;
  videoId: string;
  isPublished: boolean;
}

export interface IUser {
  username: string;
  password: string;
  token: string;
  role: string;
  displayName: string;
  googleId?: string | null;
  avatar?: string | null;
}





