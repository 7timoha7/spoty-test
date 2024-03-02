import {createAsyncThunk} from "@reduxjs/toolkit";
import axiosApi from "../../axiosApi";
import {RootState} from "../../app/store";
import {HistoryType} from "../../types";

export const addHistory = createAsyncThunk<void, string, { state: RootState }>(
  'trackHistory/addHistory',
  async (item, {getState}) => {
    const user = getState().users.user;
    if (user) {
      await axiosApi.post('/tracks_history', {track: item}, {headers: {'Authorization': user.token}});
    }
  });

export const fetchUserTracks = createAsyncThunk<HistoryType[], void, { state: RootState }>(
  'trackHistory/fetchTracksHistory',
  async (_, {getState}) => {
    const user = getState().users.user;
    if (user) {
      const tracks = await axiosApi.get('/tracks_history', {headers: {'Authorization': user.token}});
      return tracks.data;
    }
    return [];
  }
);