import express from "express";
import mongoose from "mongoose";
import User from "../models/User";
import {OAuth2Client} from "google-auth-library";
import config from "../config";
import crypto from "crypto";
import {imagesUpload} from "../multer";

const usersRouter = express.Router();

const client = new OAuth2Client(config.google.clientId);

usersRouter.post('/', imagesUpload.single('avatar'), async (req, res, next) => {
  try {
    const user = new User({
      username: req.body.username,
      displayName: req.body.displayName,
      avatar: req.file ? req.file.filename : null,
      password: req.body.password,
    });

    user.generateToken();
    await user.save();
    return res.send({message: 'Registered successfully!', user});
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).send(error);
    }
    return next(error);
  }
});

usersRouter.post('/sessions', async (req, res, next) => {
  const user = await User.findOne({username: req.body.username});

  if (!user) {
    return res.status(400).send({error: 'Username or password incorrect'});
  }

  const isMatch = await user.checkPassword(req.body.password);

  if (!isMatch) {
    return res.status(400).send({error: 'Username or password incorrect'});
  }

  try {
    user.generateToken();
    await user.save();

    return res.send({message: 'Username and password correct!', user});
  } catch (e) {
    return next(e);
  }
});

usersRouter.post('/google', async (req, res, next) => {
  try {
    const ticket = await client.verifyIdToken({
      idToken: req.body.credential,
      audience: config.google.clientId,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      return res.status(400).send({error: "Google login error!"});
    }

    const email = payload["email"];
    const id = payload["sub"];
    const displayName = payload["name"];
    const avatar = payload["picture"];
    if (!email) {
      return res
        .status(400)
        .send({error: "Not enough user data to continue"});
    }

    let user = await User.findOne({googleId: id});

    if (!user) {
      user = new User({
        username: email,
        password: crypto.randomUUID(),
        googleId: id,
        displayName,
        avatar,
      });
    }

    user.generateToken();
    await user.save();
    return res.send({
      message: "Login with Google successful!",
      user
    });

  } catch (e) {
    return next(e);
  }
})

usersRouter.delete('/sessions', async (req, res, next) => {
  try {
    const token = req.get('Authorization');
    const success = {message: 'OK'};

    if (!token) {
      return res.send(success);
    }

    const user = await User.findOne({token});

    if (!user) {
      return res.send(success);
    }

    user.generateToken();
    await user.save();
    return res.send({message: 'Login with Google successful1', user});
  } catch (e) {
    return next(e);
  }
})

export default usersRouter;