import crypto from 'crypto';
import mongoose from 'mongoose';
import config from './config';
import User from './models/User';
import Artist from "./models/Artist";
import Album from "./models/Album";
import Track from "./models/Track";

const run = async () => {
  mongoose.set('strictQuery', false);
  await mongoose.connect(config.db);
  const db = mongoose.connection;

  try {
    await db.dropCollection('users');
    await db.dropCollection('artists');
    await db.dropCollection('albums');
    await db.dropCollection('tracks');
  } catch (e) {
    console.log('Collections were not present, skipping drop...');
  }

  const [user1, user2] = await User.create({
    username: "Neo",
    password: "matrix",
    token: crypto.randomUUID(),
    role: 'admin',
    displayName: 'Mr Anderson',
    avatar: '/images/avatar1.jpg',
  }, {
    username: "Blade",
    password: "blood",
    token: crypto.randomUUID(),
    role: 'user',
    displayName: 'Ninja',
    avatar: '/images/avatar2.jpg',
  });

  const [artist1, artist2, artist3] = await Artist.create({
    name: 'The Prodigy',
    image: '/images/prodigyArtist.jpg',
    desc: 'The plot centers around a child whose disturbing behavior signals that an evil,' +
      ' possibly supernatural being has taken control of him, forcing his parents to investigate ' +
      'whether sinister forces are involved.',
    isPublished: true,
    user: user1._id,
  }, {
    name: 'Bomfunk MC’s',
    image: '/images/bomfunkArtist.jpg',
    desc: 'The Bomfunk MCs is a Finnish hip hop group that was active between 1998 and 2005, before ' +
      'reuniting in 2018. The groups frontman is the rapper B.O. Dubb ' +
      '(born Raymond Ebanks, and formerly known as "B.O.W.")',
    isPublished: true,
    user: user2._id,
  }, {
    name: '2Pac',
    image: '/images/2pacArtist.jpg',
    desc: 'Tupac Amaru Shakur ( June 16, 1971 – September 13, 1996) was an American rap artist, actor, activist,' +
      ' and poet. He is known by various alias such as: 2Pac, Makaveli and Pac. He is known in the Guinness Book' +
      ' of World Records as the top-selling hip-hop artist, having sold over 73 million albums worldwide.',
    isPublished: false,
    user: user2._id,
  });

  const [albumProdigy1, albumProdigy2, albumBomfunk1, albumBomfunk2, album2pac] = await Album.create({
    name: 'Experience',
    artist: artist1._id,
    year: 1992,
    image: 'images/prodigyAlbum1.jpg',
    isPublished: true,
    user: user1,
  }, {
    name: 'Music for the Jilted Generation',
    artist: artist1._id,
    year: 1994,
    image: 'images/prodigyAlbum2.jpg',
    isPublished: true,
    user: user2,
  }, {
    name: 'In Stereo',
    artist: artist2._id,
    year: 1999,
    image: 'images/bomfunkAlbum1.jpg',
    isPublished: true,
    user: user2,
  }, {
    name: 'Burnin Sneakers',
    artist: artist2._id,
    year: 2002,
    image: 'images/bomfunkAlbum2.jpg',
    isPublished: true,
    user: user2,
  }, {
    name: 'Me Against the World',
    artist: artist3._id,
    year: 1995,
    image: 'images/2pacAlbum1.jpg',
    isPublished: false,
    user: user2,
  });

  await Track.create({
    name: 'Jericho',
    album: albumProdigy1._id,
    trackNumber: 1,
    duration: '3:42',
    isPublished: true,
    user: user2,
  }, {
    name: 'Music Reach (1/2/3/4)',
    album: albumProdigy1._id,
    trackNumber: 2,
    duration: '4:12',
    isPublished: true,
    user: user2,
  }, {
    name: 'Wind It Up',
    album: albumProdigy1._id,
    trackNumber: 3,
    duration: '4:33',
    videoId: 'QM_8PiSMpTs',
    isPublished: true,
    user: user2,
  }, {
    name: 'Your Love (Remix)',
    album: albumProdigy1._id,
    trackNumber: 4,
    duration: '5:30',
    videoId: 'YLBh0JIwYoA',
    isPublished: true,
    user: user2,
  }, {
    name: 'Hyperspeed',
    album: albumProdigy1._id,
    trackNumber: 5,
    duration: '5:16',
    isPublished: true,
    user: user2,
  }, {
    name: 'Intro',
    album: albumProdigy2._id,
    trackNumber: 1,
    duration: '3:42',
    isPublished: true,
    user: user2,
  }, {
    name: 'Break & Enter',
    album: albumProdigy2._id,
    trackNumber: 2,
    duration: '4:12',
    isPublished: true,
    user: user2,
  }, {
    name: 'Their Law',
    album: albumProdigy2._id,
    trackNumber: 3,
    duration: '4:33',
    videoId: 'zKNoU2P0dQc',
    isPublished: true,
    user: user2,
  }, {
    name: 'Full Throttle',
    album: albumProdigy2._id,
    trackNumber: 4,
    duration: '5:30',
    isPublished: true,
    user: user2,
  }, {
    name: 'Voodoo People',
    album: albumProdigy2._id,
    trackNumber: 5,
    duration: '5:16',
    videoId: 'YV78vobCyIo',
    isPublished: true,
    user: user2,
  }, {
    name: 'Uprocking Beats',
    album: albumBomfunk1._id,
    trackNumber: 1,
    duration: '3:42',
    videoId: 'wLwZx1hyGL8',
    isPublished: true,
    user: user2,
  }, {
    name: 'Other Emcee',
    album: albumBomfunk1._id,
    trackNumber: 2,
    duration: '4:12',
    isPublished: true,
    user: user2,
  }, {
    name: 'B-Boys & Flygirls',
    album: albumBomfunk1._id,
    trackNumber: 3,
    duration: '4:33',
    videoId: 'nTI3OvIcJhE',
    isPublished: true,
    user: user2,
  }, {
    name: 'Freestyler',
    album: albumBomfunk1._id,
    trackNumber: 4,
    duration: '5:30',
    videoId: 'ymNFyxvIdaM',
    isPublished: true,
    user: user2,
  }, {
    name: 'Rocking, Just To Make Ya Move',
    album: albumBomfunk1._id,
    trackNumber: 5,
    duration: '5:16',
    isPublished: true,
    user: user2,
  }, {
    name: 'Super Electric',
    album: albumBomfunk2._id,
    trackNumber: 1,
    duration: '3:42',
    videoId: 'AXbCz0UFHrU',
    isPublished: true,
    user: user2,
  }, {
    name: 'Put Ya Hands Up',
    album: albumBomfunk2._id,
    trackNumber: 2,
    duration: '4:12',
    isPublished: true,
    user: user2,
  }, {
    name: 'Wheres The Party At',
    album: albumBomfunk2._id,
    trackNumber: 3,
    duration: '4:33',
    isPublished: true,
    user: user2,
  }, {
    name: 'Back To Back',
    album: albumBomfunk2._id,
    trackNumber: 4,
    duration: '5:30',
    videoId: 'QGvn-Ox5YOo',
    isPublished: true,
    user: user2,

  }, {
    name: 'Rockin With The Best',
    album: albumBomfunk2._id,
    trackNumber: 5,
    duration: '5:16',
    isPublished: true,
    user: user2,
  }, {
    name: 'Dear Mama',
    album: album2pac._id,
    trackNumber: 5,
    duration: '4:40',
    videoId: 'Mb1ZvUDvLDY',
    isPublished: false,
    user: user2,
  }, {
    name: 'If I Die 2Nite',
    album: album2pac._id,
    trackNumber: 1,
    duration: '4:02',
    isPublished: false,
    user: user2,
  }, {
    name: 'So Many Tears',
    album: album2pac._id,
    trackNumber: 4,
    duration: '3:59',
    videoId: '1Z52-lIZMbQ',
    isPublished: false,
    user: user2,
  });

  await db.close();
};

void run();