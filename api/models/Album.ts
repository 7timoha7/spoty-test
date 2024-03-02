import mongoose, {Types} from "mongoose";
import Artist from "./Artist";
import User from "./User";

const Schema = mongoose.Schema;

const AlbumSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  artist: {
    type: Schema.Types.ObjectId,
    ref: 'Artist',
    required: true,
    validate: {
      validator: async (value: Types.ObjectId) => Artist.findById(value),
      message: 'Artist does not exist'
    }
  },
  year: {
    type: Number,
    required: true,
  },
  image: String,
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

const Album = mongoose.model('Album', AlbumSchema);
export default Album;