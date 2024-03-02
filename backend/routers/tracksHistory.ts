import express from "express";
import User from "../models/User";
import TrackHistory from "../models/TrackHistory";
import mongoose from "mongoose";

const tracksHistory = express.Router();

tracksHistory.post('/', async (req, res, next) => {
  try {
    const tokenId = req.headers.authorization;
    if (!tokenId) {
      return res.status(401).send({error: 'No token present'});
    }

    const userId = await User.findOne({token: tokenId});

    if (!userId) {
      return res.status(401).send({error: 'Wrong token!'});
    }

    const trackId: string = req.body.track;

    const trackHistory = new TrackHistory({
      user: userId['_id'],
      track: trackId,
      datetime: new Date().toISOString(),
    });

    await trackHistory.save();
    return res.send(trackHistory);
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      return res.status(400).send(e);
    } else {
      return next(e);
    }
  }
});

tracksHistory.get('/', async (req, res, next) => {
  try {
    const tokenId = req.headers.authorization;
    if (!tokenId) {
      return res.status(401).send({error: 'No token present'});
    }

    const userId = await User.findOne({token: tokenId});

    if (!userId) {
      return res.status(401).send({error: 'Wrong token!'});
    }

    const tracks = await TrackHistory.find({user: userId['_id']}).populate({
      path: "track",
      populate: {
        path: "album",
        populate: {
          path: "artist"
        }
      }
    }).sort({datetime: -1});
    res.send(tracks);

  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      return res.status(400).send(e);
    } else {
      return next(e);
    }
  }
});

export default tracksHistory;
