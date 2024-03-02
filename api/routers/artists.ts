import express from "express";
import Artist from "../models/Artist";
import {imagesUpload} from "../multer";
import mongoose, {HydratedDocument} from "mongoose";
import auth, {RequestWithUser} from "../middleware/auth";
import permit from "../middleware/permit";
import {promises as fs} from "fs";
import {ArtistToServer} from "../types";
import Album from "../models/Album";
import Track from "../models/Track";

const artistsRouter = express.Router();

artistsRouter.post('/', auth, imagesUpload.single('image'), async (req, res, next) => {
  try {
    const user = (req as RequestWithUser).user;
    const artist = await Artist.create({
      name: req.body.name,
      desc: req.body.desc ? req.body.desc : null,
      image: req.file ? req.file.filename : null,
      user: user._id,
    });
    return res.send(artist);
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      return res.status(400).send(e);
    } else {
      return next(e);
    }
  }
});

artistsRouter.get('/', async (req, res) => {
  try {
    const artist = await Artist.find()
    return res.send(artist);
  } catch {
    return res.sendStatus(500);
  }
});

artistsRouter.delete('/artistDelete/:id', auth, async (req, res, next) => {
  try {
    const user = (req as RequestWithUser).user;
    const artist = await Artist.findById(req.params.id);

    if (artist) {
      if ((user.role === 'admin') || ((artist.user.toString() === user._id.toString())
        && artist.isPublished === false)) {
        await Artist.deleteOne({_id: req.params.id});
        const album = await Album.findOne({artist: artist._id});
        if (album) {
          await Album.deleteMany({artist: artist._id});
          const tracks = await Track.findOne({album: album._id});
          if (tracks) {
            await Track.deleteMany({album: album._id})
          }
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

artistsRouter.patch('/:id/togglePublished', auth, permit('admin'), async (req, res, next) => {
  try {
    const artist: HydratedDocument<ArtistToServer> | null = await Artist.findById(req.params.id);

    if (!artist) {
      return res.sendStatus(404);
    }

    if (artist.isPublished) {
      artist.isPublished = false;
    } else if (!artist.isPublished) {
      artist.isPublished = true;
    }

    await artist.save();
    return res.send(artist);
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


export default artistsRouter;