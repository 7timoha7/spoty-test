import {createAsyncThunk} from "@reduxjs/toolkit";
import {AlbumsMutation, AlbumsToServer, ValidationError} from "../../types";
import axiosApi from "../../axiosApi";
import {isAxiosError} from "axios";


export const albumsFetch = createAsyncThunk<AlbumsMutation, string>(
  'albums/fetch',
  async (id) => {
    const albums = await axiosApi.get('/albums?artist=' + id);
    return albums.data;
  }
);

export const albumAdd = createAsyncThunk<void, AlbumsToServer, { rejectValue: ValidationError }>(
  'albums/add',
  async (album, {rejectWithValue}) => {
    try {
      const formData = new FormData();
      const keys = Object.keys(album) as (keyof AlbumsToServer)[];
      keys.forEach((key) => {
        const value = album[key];
        if (value !== null) {
          formData.append(key, value as string | Blob);
        }
      });
      await axiosApi.post('/albums', formData);
    } catch (e) {
      if (isAxiosError(e) && e.response && e.response.status === 400) {
        return rejectWithValue(e.response.data as ValidationError);
      }
      throw e;
    }
  });

export const albumsDelete = createAsyncThunk<void, string>(
  'albums/albumsDelete',
  async (id) => {
    await axiosApi.delete('/albums/albumsDelete/' + id);
  }
);

export const albumToggle = createAsyncThunk<void, string>(
  'albums/albumToggle',
  async (id) => {
    await axiosApi.patch('/albums/' + id + '/togglePublished/');
  });