import express from "express";
import {imagesUpload} from "../multer";
import mongoose, {HydratedDocument} from "mongoose";
import Album from "../models/Album";
import Artist from "../models/Artist";
import auth, {RequestWithUser} from "../middleware/auth";
import permit from "../middleware/permit";
import {AlbumToServer} from "../types";
import {promises as fs} from "fs";
import Track from "../models/Track";

const albumsRouter = express.Router();

albumsRouter.post('/', auth, imagesUpload.single('image'), async (req, res, next) => {
  try {
    const user = (req as RequestWithUser).user;
    const album = await Album.create({
      name: req.body.name,
      artist: req.body.artist,
      year: req.body.year,
      image: req.file ? req.file.filename : null,
      user: user._id,
    });
    return res.send(album);
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      return res.status(400).send(e);
    } else {
      return next(e);
    }
  }
});

albumsRouter.get('/', async (req, res) => {
  try {
    if (req.query.artist) {
      const newAlbum = await Album.find({artist: req.query.artist}).sort({year: -1}).populate('artist');
      const artist = await Artist.findById(req.query.artist);
      const newAlbumArtist = {
        artist: artist,
        albums: newAlbum,
      }
      return res.send(newAlbumArtist);
    }
    const album = await Album.find();
    return res.send(album);
  } catch {
    return res.sendStatus(500);
  }
});

albumsRouter.get('/:id', async (req, res) => {
  try {
    const result = await Album.findById(req.params.id).populate('artist');
    if (!result) {
      return res.sendStatus(404);
    }
    return res.send(result);
  } catch {
    return res.sendStatus(500);
  }
});

albumsRouter.delete('/albumsDelete/:id', auth, async (req, res, next) => {
  try {
    const user = (req as RequestWithUser).user;
    const album = await Album.findById(req.params.id);

    if (album) {
      if ((user.role === 'admin') || ((album.user.toString() === user._id.toString())
        && (album.isPublished === false))) {
        await Album.deleteOne({_id: req.params.id});
        const track = await Track.findOne({album: album._id});
        if (track) {
          await Track.deleteMany({album: album._id});
        }
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

albumsRouter.patch('/:id/togglePublished', auth, permit('admin'), async (req, res, next) => {
  try {
    const album: HydratedDocument<AlbumToServer> | null = await Album.findById(req.params.id);

    if (!album) {
      return res.sendStatus(404);
    }

    if (album.isPublished) {
      album.isPublished = false;
    } else if (!album.isPublished) {
      album.isPublished = true;
    }

    await album.save();
    return res.send(album);
  } catch (e) {
    if (req.file) {
      await fs.unlink(req.file.path);
    }

    if (e instanceof mongoose.Error.ValidationError) {
      return res.status(400).send(e);
    } else {
      return next(e);
    }
  }
});

export default albumsRouter;


