import {createAsyncThunk} from "@reduxjs/toolkit";
import {ArtistsToServer, ArtistsType, ValidationError} from "../../types";
import axiosApi from "../../axiosApi";
import {isAxiosError} from "axios";

export const artistsFetch = createAsyncThunk<ArtistsType[]>(
  'artists/fetchAll',
  async () => {
    const artists = await axiosApi.get('/artists');
    return artists.data;
  }
);

export const artistAdd = createAsyncThunk<void, ArtistsToServer, { rejectValue: ValidationError }>(
  'artists/add',
  async (artist, {rejectWithValue}) => {
    try {
      const formData = new FormData();
      const keys = Object.keys(artist) as (keyof ArtistsToServer)[];
      keys.forEach((key) => {
        const value = artist[key];
        if (value !== null) {
          formData.append(key, value);
        }
      });
      await axiosApi.post('/artists', formData);
    } catch (e) {
      if (isAxiosError(e) && e.response && e.response.status === 400) {
        return rejectWithValue(e.response.data as ValidationError);
      }
      throw e;
    }
  });

export const artistDelete = createAsyncThunk<void, string>(
  'artists/artistsDelete',
  async (id) => {
    await axiosApi.delete('/artists/artistDelete/' + id);
  });

export const artistToggle = createAsyncThunk<void, string>(
  'artists/artistToggle',
  async (id) => {
    await axiosApi.patch('/artists/' + id + '/togglePublished/');
  });