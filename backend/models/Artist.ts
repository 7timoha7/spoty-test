import mongoose, {Types} from "mongoose";
import User from "./User";

const Schema = mongoose.Schema;

const ArtistSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique:true,
  },
  image: String,
  desc: String,
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

const Artist = mongoose.model('Artist', ArtistSchema);
export default Artist;