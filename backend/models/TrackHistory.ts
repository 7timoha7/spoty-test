import mongoose, {Types} from "mongoose";
import User from "./User";
import Track from "./Track";

const Schema = mongoose.Schema;

const TrackHistorySchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    validate: {
      validator: async (value: Types.ObjectId) => User.findById(value),
      message: 'User does not exist'
    }
  },
  track: {
    type: Schema.Types.ObjectId,
    ref: 'Track',
    required: true,
    validate: {
      validator: async (value: Types.ObjectId) => Track.findById(value),
      message: 'Track does not exist'
    }
  },
  datetime: {
    type: String,
    required: true,
  },
});

const TrackHistory = mongoose.model('TrackHistory', TrackHistorySchema);
export default TrackHistory;