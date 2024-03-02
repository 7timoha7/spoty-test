import mongoose, {Types} from "mongoose";
import Album from "./Album";
import User from "./User";

const Schema = mongoose.Schema;

const TrackSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  album: {
    type: Schema.Types.ObjectId,
    ref: 'Album',
    required: true,
    validate: {
      validator: async (value: Types.ObjectId) => Album.findById(value),
      message: 'Album does not exist'
    }
  },
  duration: {
    type: String,
    required: true,
  },
  trackNumber: {
    type: Number,
    required: true,
  },
  videoId: String,
  isPublished:{
    type: Boolean,
    required: true,
    default: false,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    validate: {
      validator: async (value: Types.ObjectId) => User.findById(value),
      message: 'User does not exist'
    }
  },
});

const Track = mongoose.model('Track', TrackSchema);
export default Track;