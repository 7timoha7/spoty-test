import express from "express";
import mongoose, {HydratedDocument} from "mongoose";
import {AlbumOnServer, TrackToServer} from "../types";
import Track from "../models/Track";
import Album from "../models/Album";
import auth, {RequestWithUser} from "../middleware/auth";
import permit from "../middleware/permit";
import {promises as fs} from "fs";

const tracksRouter = express.Router();

tracksRouter.post('/', auth, async (req, res, next) => {
  try {
    const user = (req as RequestWithUser).user;
    const track = await Track.create({
      name: req.body.name,
      album: req.body.album,
      duration: req.body.duration,
      trackNumber: req.body.trackNumber,
      videoId: req.body.videoId,
      user: user._id,
    });
    return res.send(track);
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      return res.status(400).send(e);
    } else {
      return next(e);
    }
  }
});

tracksRouter.get('/', async (req, res) => {
  try {
    if (req.query.album) {
      const trackAlbum = await Track.find({album: req.query.album}).sort({trackNumber: 1});
      const albumName = await Album.findById(req.query.album).populate('artist');

      const result = {
        albumName: albumName,
        trackAlbum: trackAlbum,
      }

      return res.send(result);

    } else if (req.query.artist) {
      const albums: AlbumOnServer[] = await Album.find({artist: req.query.artist});
      const albumsId: string[] = albums.map(item => {
        return item._id.toString();
      });
      const trackNew = await Track.find({album: {$in: albumsId}});
      return res.send(trackNew);
    }

    const track = await Track.find();
    return res.send(track);
  } catch {
    return res.sendStatus(500);
  }
});

tracksRouter.delete('/tracksDelete/:id', auth, async (req, res, next) => {
  try {
    const user = (req as RequestWithUser).user;
    const track = await Track.findById(req.params.id);

    if (track) {
      if ((user.role === 'admin') || ((track.user.toString() === user._id.toString())
        && (track.isPublished === false))) {
        await Track.deleteOne({_id: req.params.id});
        return res.send({message: "OK"});
      }
    }
  } catch (e) {
    if (req.file) {
      await fs.unlink(req.file.path);
    }
    return next(e);
  }
});

tracksRouter.patch('/:id/togglePublished', auth, permit('admin'), async (req, res, next) => {
  try {
    const track: HydratedDocument<TrackToServer> | null = await Track.findById(req.params.id);

    if (!track) {
      return res.sendStatus(404);
    }

    if (track.isPublished) {
      track.isPublished = false;
    } else if (!track.isPublished) {
      track.isPublished = true;
    }

    await track.save();
    return res.send(track);
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      return res.status(400).send(e);
    } else {
      return next(e);
    }
  }
});

export default tracksRouter;