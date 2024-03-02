import {createAsyncThunk} from "@reduxjs/toolkit";
import {TrackMutationType, TrackToServer, ValidationError} from "../../types";
import axiosApi from "../../axiosApi";
import {isAxiosError} from "axios";

export const tracksAlbumsFetch = createAsyncThunk<TrackMutationType, string>(
  'tracks/fetch',
  async (id) => {
    const tracks = await axiosApi.get('/tracks?album=' + id);
    return tracks.data;
  }
);

export const trackAdd = createAsyncThunk<void, TrackToServer, { rejectValue: ValidationError }>(
  'tracks/add',
  async (track, {rejectWithValue}) => {
    try {
      await axiosApi.post('/tracks', track);
    } catch (e) {
      if (isAxiosError(e) && e.response && e.response.status === 400) {
        return rejectWithValue(e.response.data as ValidationError);
      }
      throw e;
    }
  });

export const tracksDelete = createAsyncThunk<void, string>(
  'tracks/tracksDelete',
  async (id) => {
    await axiosApi.delete('/tracks/tracksDelete/' + id);
  });

export const tracksToggle = createAsyncThunk<void, string>(
  'tracks/tracksToggle',
  async (id) => {
    await axiosApi.patch('/tracks/' + id + '/togglePublished/');
  });