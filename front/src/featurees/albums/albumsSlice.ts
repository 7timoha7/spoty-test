import {createSlice} from "@reduxjs/toolkit";
import {AlbumsMutation, ValidationError} from "../../types";
import {RootState} from "../../app/store";
import {albumAdd, albumsDelete, albumsFetch, albumToggle} from "./albumsThunks";

interface AlbumsState {
  albums: AlbumsMutation | null;
  albumsLoading: boolean;
  albumAddLoading: boolean;
  albumError: ValidationError | null;
  deleteLoading: boolean | string;
  albumToggleLoading: boolean | string;
}

const initialState: AlbumsState = {
  albums: null,
  albumsLoading: false,
  albumAddLoading: false,
  albumError: null,
  deleteLoading: false,
  albumToggleLoading: false,
}

export const albumsSLice = createSlice({
  name: 'albums',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(albumsFetch.pending, (state) => {
      state.albumsLoading = true;
    });
    builder.addCase(albumsFetch.fulfilled, (state, action) => {
      state.albums = action.payload!;
      state.albumsLoading = false;
    });
    builder.addCase(albumsFetch.rejected, (state) => {
      state.albumsLoading = false;
    });

    builder.addCase(albumAdd.pending, (state) => {
      state.albumAddLoading = true;
      state.albumError = null;
    });
    builder.addCase(albumAdd.fulfilled, (state) => {
      state.albumAddLoading = false;
    });
    builder.addCase(albumAdd.rejected, (state, {payload: error}) => {
      state.albumAddLoading = false;
      state.albumError = error || null;
    });

    builder.addCase(albumsDelete.pending, (state,action) => {
      state.deleteLoading = action.meta.arg;
    });
    builder.addCase(albumsDelete.fulfilled, (state) => {
      state.deleteLoading = false;
    });
    builder.addCase(albumsDelete.rejected, (state) => {
      state.deleteLoading = false;
    });

    builder.addCase(albumToggle.pending, (state, action) => {
      state.albumToggleLoading = action.meta.arg;
    });
    builder.addCase(albumToggle.fulfilled, (state) => {
      state.albumToggleLoading = false;
    });
    builder.addCase(albumToggle.rejected, (state) => {
      state.albumToggleLoading = false;
    });
  }
});

export const albumsReducer = albumsSLice.reducer;

export const selectAlbumsState = (state: RootState) => state.albums.albums;
export const selectAlbumsLoading = (state: RootState) => state.albums.albumsLoading;
export const selectAlbumAddLoading = (state: RootState) => state.albums.albumAddLoading;
export const selectAlbumsError = (state: RootState) => state.albums.albumError;
export const selectAlbumsDeleteLoading = (state: RootState) => state.albums.deleteLoading;
export const selectAlbumToggleLoading = (state: RootState) => state.albums.albumToggleLoading;








